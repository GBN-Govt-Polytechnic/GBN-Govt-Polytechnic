/**
 * @file events.service.ts
 * @description Event business logic — CRUD with slug generation, image upload, and soft-delete
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import { generateUniqueSlug } from "@/utils/slug";
import * as storageService from "@/services/storage.service";
import type { CreateEventInput, UpdateEventInput, EventQuery } from "./events.schema";

/**
 * Retrieves a paginated list of events with optional status filtering.
 * Public mode restricts results to published events only.
 * @param query - Query parameters (page, limit, status).
 * @param isPublic - If true, only published events are returned.
 * @returns Object containing data array and pagination meta.
 */
export async function list(query: EventQuery, isPublic = false) {
  const { skip, take, page, limit } = parsePagination(query);
  const where: Record<string, unknown> = { deletedAt: null };

  if (isPublic) {
    where.status = "PUBLISHED";
  } else if (query.status) {
    where.status = query.status;
  }

  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take,
      orderBy: { startDate: "desc" },
    }),
    prisma.event.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Finds an event by UUID, excluding soft-deleted records.
 * @param id - UUID of the event.
 * @returns Event record.
 * @throws {ApiError} 404 if event not found.
 */
export async function findById(id: string) {
  const event = await prisma.event.findFirst({
    where: { id, deletedAt: null },
  });
  if (!event) throw ApiError.notFound("Event not found");
  return event;
}

/**
 * Finds a published event by its URL slug.
 * @param slug - URL-friendly slug of the event.
 * @returns Published event record.
 * @throws {ApiError} 404 if event not found or not published.
 */
export async function findBySlug(slug: string) {
  const event = await prisma.event.findFirst({
    where: { slug, deletedAt: null, status: "PUBLISHED" },
  });
  if (!event) throw ApiError.notFound("Event not found");
  return event;
}

/**
 * Creates a new event with auto-generated slug and optional image upload.
 * @param data - Event creation data (title, description, dates, location, status).
 * @param imageFile - Optional cover image file.
 * @returns The newly created event record.
 */
export async function create(
  data: CreateEventInput,
  imageFile?: Express.Multer.File,
) {
  const slug = await generateUniqueSlug(data.title, "event");

  let imageData = {};
  if (imageFile) {
    const result = await storageService.upload(imageFile, "events/images");
    imageData = {
      imageUrl: result.url,
      imageFileName: result.fileName,
      imageFileSize: result.fileSize,
      imageMimeType: result.mimeType,
    };
  }

  const event = await prisma.event.create({
    data: {
      ...data,
      slug,
      ...imageData,
    },
  });

  return event;
}

/**
 * Updates an existing event with optional new image and slug regeneration on title change.
 * @param id - UUID of the event to update.
 * @param data - Partial update data for the event.
 * @param imageFile - Optional new cover image to replace the existing one.
 * @returns The updated event record.
 * @throws {ApiError} 404 if event not found.
 */
export async function update(
  id: string,
  data: UpdateEventInput,
  imageFile?: Express.Multer.File,
) {
  const existing = await prisma.event.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Event not found");

  let imageData = {};
  if (imageFile) {
    const result = await storageService.upload(imageFile, "events/images");
    imageData = {
      imageUrl: result.url,
      imageFileName: result.fileName,
      imageFileSize: result.fileSize,
      imageMimeType: result.mimeType,
    };
  }

  let slugData = {};
  if (data.title && data.title !== existing.title) {
    slugData = { slug: await generateUniqueSlug(data.title, "event") };
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...data,
      ...slugData,
      ...imageData,
    },
  });

  return event;
}

/**
 * Soft-deletes an event by setting its deletedAt timestamp.
 * @param id - UUID of the event to soft-delete.
 * @throws {ApiError} 404 if event not found.
 */
export async function remove(id: string) {
  const existing = await prisma.event.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Event not found");

  await prisma.event.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
