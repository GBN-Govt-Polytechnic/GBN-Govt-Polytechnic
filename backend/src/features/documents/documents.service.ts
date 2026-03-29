/**
 * @file documents.service.ts
 * @description Public document business logic — CRUD with PDF file uploads.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import * as storageService from "@/services/storage.service";
import type { CreateDocumentInput, UpdateDocumentInput } from "./documents.schema";

/**
 * Retrieves all active public documents ordered by category then sort order.
 * @returns Array of public document records.
 */
export async function list() {
  return prisma.publicDocument.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { year: "desc" }],
  });
}

/**
 * Retrieves all public documents (including inactive) for admin use.
 * @returns Array of all public document records.
 */
export async function listAll() {
  return prisma.publicDocument.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { year: "desc" }],
  });
}

/**
 * Finds a single public document by its UUID.
 * @param id - The document UUID.
 * @returns The document record.
 * @throws {ApiError} 404 if not found.
 */
export async function findById(id: string) {
  const doc = await prisma.publicDocument.findUnique({ where: { id } });
  if (!doc) throw ApiError.notFound("Document not found");
  return doc;
}

/**
 * Creates a new public document with a required PDF file upload.
 * @param data - Validated document creation data.
 * @param file - Required uploaded PDF file.
 * @returns The newly created document record.
 * @throws {ApiError} 400 if no file is provided.
 */
export async function create(data: CreateDocumentInput, file?: Express.Multer.File) {
  if (!file) throw new ApiError(400, "PDF file is required");

  const uploaded = await storageService.upload(file, "documents");

  return prisma.publicDocument.create({
    data: {
      ...data,
      fileUrl: uploaded.url,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
    },
  });
}

/**
 * Updates an existing public document with optional file replacement.
 * @param id - The document UUID.
 * @param data - Validated partial update data.
 * @param file - Optional replacement PDF file.
 * @returns The updated document record.
 * @throws {ApiError} 404 if not found.
 */
export async function update(id: string, data: UpdateDocumentInput, file?: Express.Multer.File) {
  const existing = await prisma.publicDocument.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Document not found");

  let fileData = {};
  if (file) {
    const uploaded = await storageService.upload(file, "documents");
    fileData = {
      fileUrl: uploaded.url,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
    };
  }

  return prisma.publicDocument.update({
    where: { id },
    data: { ...data, ...fileData },
  });
}

/**
 * Permanently deletes a public document by ID.
 * @param id - The document UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function remove(id: string) {
  const existing = await prisma.publicDocument.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Document not found");
  await prisma.publicDocument.delete({ where: { id } });
}
