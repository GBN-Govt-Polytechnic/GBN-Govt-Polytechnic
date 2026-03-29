/**
 * @file hero-slides.service.ts
 * @description Hero slide business logic — CRUD with automatic ordering, image upload, and soft-delete
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import * as storageService from "@/services/storage.service";
import type { CreateHeroSlideInput, UpdateHeroSlideInput } from "./hero-slides.schema";

/**
 * Lists all active hero slides sorted by display order, excluding soft-deleted records.
 * @returns Array of active hero slide records ordered by sortOrder.
 */
export async function list() {
  const slides = await prisma.heroSlide.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  return slides;
}

/**
 * Finds a hero slide by UUID, excluding soft-deleted records.
 * @param id - UUID of the hero slide.
 * @returns Hero slide record.
 * @throws {ApiError} 404 if hero slide not found.
 */
export async function findById(id: string) {
  const slide = await prisma.heroSlide.findFirst({
    where: { id, deletedAt: null },
  });
  if (!slide) throw ApiError.notFound("Hero slide not found");
  return slide;
}

/**
 * Creates a new hero slide with image upload and automatic sort order placement.
 * If no sortOrder is specified, the slide is placed at the end of the carousel.
 * @param data - Hero slide creation data (title, subtitle, linkUrl, sortOrder, isActive).
 * @param imageFile - Required cover image file for the slide.
 * @returns The newly created hero slide record.
 */
export async function create(
  data: CreateHeroSlideInput,
  imageFile: Express.Multer.File,
) {
  const result = await storageService.upload(imageFile, "hero-slides");

  // If no sortOrder provided, place it at the end
  let sortOrder = data.sortOrder;
  if (sortOrder === undefined) {
    const last = await prisma.heroSlide.findFirst({
      where: { deletedAt: null },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    sortOrder = (last?.sortOrder ?? -1) + 1;
  }

  const slide = await prisma.heroSlide.create({
    data: {
      ...data,
      sortOrder,
      imageUrl: result.url,
    },
  });

  return slide;
}

/**
 * Updates a hero slide's metadata and optionally replaces its image.
 * @param id - UUID of the hero slide to update.
 * @param data - Partial update data for the hero slide.
 * @param imageFile - Optional new image to replace the existing one.
 * @returns The updated hero slide record.
 * @throws {ApiError} 404 if hero slide not found.
 */
export async function update(
  id: string,
  data: UpdateHeroSlideInput,
  imageFile?: Express.Multer.File,
) {
  const existing = await prisma.heroSlide.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Hero slide not found");

  let imageData = {};
  if (imageFile) {
    const result = await storageService.upload(imageFile, "hero-slides");
    imageData = { imageUrl: result.url };
  }

  const slide = await prisma.heroSlide.update({
    where: { id },
    data: {
      ...data,
      ...imageData,
    },
  });

  return slide;
}

/**
 * Soft-deletes a hero slide by setting its deletedAt timestamp.
 * @param id - UUID of the hero slide to soft-delete.
 * @throws {ApiError} 404 if hero slide not found.
 */
export async function remove(id: string) {
  const existing = await prisma.heroSlide.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Hero slide not found");

  await prisma.heroSlide.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
