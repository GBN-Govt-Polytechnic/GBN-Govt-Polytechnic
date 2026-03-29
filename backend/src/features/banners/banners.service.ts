/**
 * @file banners.service.ts
 * @description Banner business logic — CRUD with scheduling support and soft-delete.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import type { CreateBannerInput, UpdateBannerInput } from "./banners.schema";

/**
 * Retrieves all non-deleted banners ordered by sortOrder ascending.
 * @returns Array of banner records.
 */
export async function list() {
  return prisma.banner.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Retrieves only currently active banners within their scheduled date range.
 * @returns Array of active banner records.
 */
export async function listActive() {
  const now = new Date();
  return prisma.banner.findMany({
    where: {
      deletedAt: null,
      isActive: true,
      OR: [
        { startDate: null },
        { startDate: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: now } },
          ],
        },
      ],
    },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Finds a single banner by its UUID.
 * @param id - The banner UUID.
 * @returns The banner record.
 * @throws {ApiError} 404 if not found.
 */
export async function findById(id: string) {
  const banner = await prisma.banner.findFirst({
    where: { id, deletedAt: null },
  });
  if (!banner) throw ApiError.notFound("Banner not found");
  return banner;
}

/**
 * Creates a new banner.
 * @param data - Validated banner creation data.
 * @returns The newly created banner record.
 */
export async function create(data: CreateBannerInput) {
  return prisma.banner.create({ data });
}

/**
 * Updates an existing banner.
 * @param id - The banner UUID.
 * @param data - Validated partial update data.
 * @returns The updated banner record.
 * @throws {ApiError} 404 if not found.
 */
export async function update(id: string, data: UpdateBannerInput) {
  const existing = await prisma.banner.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("Banner not found");
  return prisma.banner.update({ where: { id }, data });
}

/**
 * Soft-deletes a banner by setting its deletedAt timestamp.
 * @param id - The banner UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function remove(id: string) {
  const existing = await prisma.banner.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("Banner not found");
  await prisma.banner.update({ where: { id }, data: { deletedAt: new Date() } });
}
