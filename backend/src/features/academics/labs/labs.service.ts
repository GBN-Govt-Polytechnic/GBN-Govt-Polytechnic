/**
 * @file labs.service.ts
 * @description Lab business logic — CRUD operations on the labs table with image upload support.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { checkDepartmentAccess } from "@/middleware/department-scope";
import * as storageService from "@/services/storage.service";
import type { CreateLabInput, UpdateLabInput, LabQuery } from "./labs.schema";

/**
 * Retrieves a list of active labs, optionally filtered by department.
 * @param query - Query filters including optional departmentId.
 * @returns Array of lab objects with department details, ordered by name.
 */
export async function list(query: LabQuery) {
  const where: Record<string, unknown> = { deletedAt: null, isActive: true };

  if (query.departmentId) where.departmentId = query.departmentId;

  const labs = await prisma.lab.findMany({
    where,
    orderBy: { name: "asc" },
    include: { department: true },
  });

  return labs;
}

/**
 * Finds a single lab by its UUID.
 * @param id - The lab UUID.
 * @returns The lab record with department details.
 * @throws {ApiError} 404 if the lab is not found or soft-deleted.
 */
export async function findById(id: string) {
  const lab = await prisma.lab.findFirst({
    where: { id, deletedAt: null },
    include: { department: true },
  });
  if (!lab) throw ApiError.notFound("Lab not found");
  return lab;
}

/**
 * Creates a new lab with optional image upload.
 * @param input - Validated lab creation data.
 * @param imageFile - Optional uploaded image file.
 * @returns The newly created lab record.
 */
export async function create(input: CreateLabInput, imageFile?: Express.Multer.File) {
  let imageData = {};
  if (imageFile) {
    const result = await storageService.upload(imageFile, "labs");
    imageData = { imageUrl: result.url };
  }

  const lab = await prisma.lab.create({
    data: {
      name: input.name,
      roomNumber: input.roomNumber,
      departmentId: input.departmentId,
      description: input.description,
      equipment: input.equipment ?? [],
      ...imageData,
    },
  });

  return lab;
}

/**
 * Updates an existing lab by ID with optional image replacement.
 * @param id - The lab UUID.
 * @param input - Validated partial lab update data.
 * @param imageFile - Optional replacement image file.
 * @param user - Authenticated user for department access verification.
 * @returns The updated lab record.
 * @throws {ApiError} 404 if the lab is not found.
 * @throws {ApiError} 403 if user lacks department access to this resource.
 */
export async function update(
  id: string,
  input: UpdateLabInput,
  imageFile?: Express.Multer.File,
  user?: { role: string; departmentId?: string },
) {
  const existing = await prisma.lab.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Lab not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  let imageData = {};
  if (imageFile) {
    const result = await storageService.upload(imageFile, "labs");
    imageData = { imageUrl: result.url };
  }

  const lab = await prisma.lab.update({
    where: { id },
    data: {
      ...input,
      ...imageData,
    },
  });

  return lab;
}

/**
 * Soft-deletes a lab by setting its deletedAt timestamp.
 * @param id - The lab UUID.
 * @param user - Authenticated user for department access verification.
 * @throws {ApiError} 404 if the lab is not found or already deleted.
 * @throws {ApiError} 403 if user lacks department access to this resource.
 */
export async function remove(id: string, user?: { role: string; departmentId?: string }) {
  const existing = await prisma.lab.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Lab not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  await prisma.lab.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
