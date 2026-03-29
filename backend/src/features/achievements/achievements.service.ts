/**
 * @file achievements.service.ts
 * @description Achievement business logic — CRUD with optional image uploads and soft-delete.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import * as storageService from "@/services/storage.service";
import type { CreateAchievementInput, UpdateAchievementInput } from "./achievements.schema";

/**
 * Retrieves all non-deleted achievements ordered by date descending.
 * @returns Array of achievement records.
 */
export async function list() {
  const achievements = await prisma.achievement.findMany({
    where: { deletedAt: null },
    orderBy: { date: "desc" },
  });
  return achievements;
}

/**
 * Finds a single achievement by its UUID.
 * @param id - The achievement UUID.
 * @returns The achievement record.
 * @throws {ApiError} 404 if not found.
 */
export async function findById(id: string) {
  const achievement = await prisma.achievement.findFirst({
    where: { id, deletedAt: null },
  });
  if (!achievement) throw ApiError.notFound("Achievement not found");
  return achievement;
}

/**
 * Creates a new achievement with optional image upload.
 * @param data - Validated achievement creation data.
 * @param file - Optional uploaded image file.
 * @returns The newly created achievement record.
 */
export async function create(data: CreateAchievementInput, file?: Express.Multer.File) {
  let imageData = {};
  if (file) {
    const uploaded = await storageService.upload(file, "achievements");
    imageData = {
      imageUrl: uploaded.url,
      imageFileName: uploaded.fileName,
      imageFileSize: uploaded.fileSize,
      imageMimeType: uploaded.mimeType,
    };
  }

  const achievement = await prisma.achievement.create({
    data: {
      ...data,
      ...imageData,
    },
  });

  return achievement;
}

/**
 * Updates an existing achievement with optional image replacement.
 * @param id - The achievement UUID.
 * @param data - Validated partial update data.
 * @param file - Optional replacement image file.
 * @returns The updated achievement record.
 * @throws {ApiError} 404 if not found.
 */
export async function update(id: string, data: UpdateAchievementInput, file?: Express.Multer.File) {
  const existing = await prisma.achievement.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("Achievement not found");

  let imageData = {};
  if (file) {
    const uploaded = await storageService.upload(file, "achievements");
    imageData = {
      imageUrl: uploaded.url,
      imageFileName: uploaded.fileName,
      imageFileSize: uploaded.fileSize,
      imageMimeType: uploaded.mimeType,
    };
  }

  const achievement = await prisma.achievement.update({
    where: { id },
    data: {
      ...data,
      ...imageData,
    },
  });

  return achievement;
}

/**
 * Soft-deletes an achievement by setting its deletedAt timestamp.
 * @param id - The achievement UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function remove(id: string) {
  const existing = await prisma.achievement.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("Achievement not found");

  await prisma.achievement.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
