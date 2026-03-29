/**
 * @file results.service.ts
 * @description Result links business logic — CRUD with optional file uploads and soft-delete.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import * as storageService from "@/services/storage.service";
import type { CreateResultInput, UpdateResultInput, ResultQuery } from "./results.schema";

/**
 * Retrieves a paginated list of result links with optional filtering.
 * @param query - Query filters including pagination, semester, year, and sessionId.
 * @returns Object with data array and pagination meta.
 */
export async function list(query: ResultQuery) {
  const { skip, take, page, limit } = parsePagination(query);
  const where: Record<string, unknown> = { deletedAt: null };

  if (query.semester) {
    where.semester = query.semester;
  }

  if (query.year) {
    where.year = query.year;
  }

  if (query.sessionId) {
    where.sessionId = query.sessionId;
  }

  const [data, total] = await Promise.all([
    prisma.resultLink.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { session: true },
    }),
    prisma.resultLink.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Finds a single result link by its UUID.
 * @param id - The result link UUID.
 * @returns The result link record with session details.
 * @throws {ApiError} 404 if not found.
 */
export async function findById(id: string) {
  const result = await prisma.resultLink.findFirst({
    where: { id, deletedAt: null },
    include: { session: true },
  });
  if (!result) throw ApiError.notFound("Result link not found");
  return result;
}

/**
 * Creates a new result link with optional file upload.
 * @param data - Validated result link creation data.
 * @param file - Optional uploaded result document.
 * @returns The newly created result link record with session details.
 */
export async function create(data: CreateResultInput, file?: Express.Multer.File) {
  let fileData = {};
  if (file) {
    const uploaded = await storageService.upload(file, "results");
    fileData = {
      fileUrl: uploaded.url,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
      fileMimeType: uploaded.mimeType,
    };
  }

  const result = await prisma.resultLink.create({
    data: {
      ...data,
      ...fileData,
    },
    include: { session: true },
  });

  return result;
}

/**
 * Updates an existing result link with optional file replacement.
 * @param id - The result link UUID.
 * @param data - Validated partial update data.
 * @param file - Optional replacement document file.
 * @returns The updated result link record with session details.
 * @throws {ApiError} 404 if not found.
 */
export async function update(id: string, data: UpdateResultInput, file?: Express.Multer.File) {
  const existing = await prisma.resultLink.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("Result link not found");

  let fileData = {};
  if (file) {
    const uploaded = await storageService.upload(file, "results");
    fileData = {
      fileUrl: uploaded.url,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
      fileMimeType: uploaded.mimeType,
    };
  }

  const result = await prisma.resultLink.update({
    where: { id },
    data: {
      ...data,
      ...fileData,
    },
    include: { session: true },
  });

  return result;
}

/**
 * Soft-deletes a result link by setting its deletedAt timestamp.
 * @param id - The result link UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function remove(id: string) {
  const existing = await prisma.resultLink.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("Result link not found");

  await prisma.resultLink.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
