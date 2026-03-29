/**
 * @file mous.service.ts
 * @description MoU business logic — CRUD with optional document uploads and soft-delete.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import * as storageService from "@/services/storage.service";
import type { CreateMoUInput, UpdateMoUInput } from "./mous.schema";

/**
 * Retrieves all active, non-deleted MoUs ordered by creation date descending.
 * @returns Array of MoU records.
 */
export async function list() {
  const mous = await prisma.moU.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return mous;
}

/**
 * Finds a single MoU by its UUID.
 * @param id - The MoU UUID.
 * @returns The MoU record.
 * @throws {ApiError} 404 if not found.
 */
export async function findById(id: string) {
  const mou = await prisma.moU.findFirst({
    where: { id, deletedAt: null },
  });
  if (!mou) throw ApiError.notFound("MoU not found");
  return mou;
}

/**
 * Creates a new MoU with optional document upload.
 * @param data - Validated MoU creation data.
 * @param file - Optional uploaded document file.
 * @returns The newly created MoU record.
 */
export async function create(data: CreateMoUInput, file?: Express.Multer.File) {
  let documentData = {};
  if (file) {
    const uploaded = await storageService.upload(file, "mous");
    documentData = {
      documentUrl: uploaded.url,
      documentFileName: uploaded.fileName,
      documentFileSize: uploaded.fileSize,
      documentMimeType: uploaded.mimeType,
    };
  }

  const mou = await prisma.moU.create({
    data: {
      ...data,
      ...documentData,
    },
  });

  return mou;
}

/**
 * Updates an existing MoU with optional document replacement.
 * @param id - The MoU UUID.
 * @param data - Validated partial update data.
 * @param file - Optional replacement document file.
 * @returns The updated MoU record.
 * @throws {ApiError} 404 if not found.
 */
export async function update(id: string, data: UpdateMoUInput, file?: Express.Multer.File) {
  const existing = await prisma.moU.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("MoU not found");

  let documentData = {};
  if (file) {
    const uploaded = await storageService.upload(file, "mous");
    documentData = {
      documentUrl: uploaded.url,
      documentFileName: uploaded.fileName,
      documentFileSize: uploaded.fileSize,
      documentMimeType: uploaded.mimeType,
    };
  }

  const mou = await prisma.moU.update({
    where: { id },
    data: {
      ...data,
      ...documentData,
    },
  });

  return mou;
}

/**
 * Soft-deletes a MoU by setting its deletedAt timestamp.
 * @param id - The MoU UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function remove(id: string) {
  const existing = await prisma.moU.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("MoU not found");

  await prisma.moU.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
