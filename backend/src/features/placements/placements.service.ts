/**
 * @file placements.service.ts
 * @description Placement business logic — companies, stats upsert, and activities with image uploads.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import * as storageService from "@/services/storage.service";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  UpsertStatInput,
  StatQuery,
  CreateActivityInput,
  UpdateActivityInput,
  ActivityQuery,
} from "./placements.schema";

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

/**
 * Retrieves all non-deleted placement companies ordered by name.
 * @returns Array of company records.
 */
export async function listCompanies() {
  const companies = await prisma.placementCompany.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { name: "asc" },
  });
  return companies;
}

/**
 * Finds a single placement company by its UUID.
 * @param id - The company UUID.
 * @returns The company record.
 * @throws {ApiError} 404 if not found.
 */
export async function findCompanyById(id: string) {
  const company = await prisma.placementCompany.findFirst({
    where: { id, deletedAt: null },
  });
  if (!company) throw ApiError.notFound("Placement company not found");
  return company;
}

/**
 * Creates a new placement company.
 * @param input - Validated company creation data.
 * @returns The newly created company record.
 */
export async function createCompany(input: CreateCompanyInput) {
  const company = await prisma.placementCompany.create({
    data: {
      name: input.name,
      logoUrl: input.logoUrl,
      industry: input.industry,
      website: input.website,
      description: input.description,
      isActive: input.isActive,
    },
  });
  return company;
}

/**
 * Updates an existing placement company.
 * @param id - The company UUID.
 * @param input - Validated partial update data.
 * @returns The updated company record.
 * @throws {ApiError} 404 if not found.
 */
export async function updateCompany(id: string, input: UpdateCompanyInput) {
  const existing = await prisma.placementCompany.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Placement company not found");

  const company = await prisma.placementCompany.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.logoUrl !== undefined && { logoUrl: input.logoUrl }),
      ...(input.industry !== undefined && { industry: input.industry }),
      ...(input.website !== undefined && { website: input.website }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
    },
  });
  return company;
}

/**
 * Soft-deletes a placement company by setting its deletedAt timestamp.
 * @param id - The company UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function removeCompany(id: string) {
  const existing = await prisma.placementCompany.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Placement company not found");

  await prisma.placementCompany.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

/**
 * Retrieves placement statistics with optional session filtering.
 * @param query - Query filters including optional sessionId.
 * @returns Array of placement stat records with department and session details.
 */
export async function listStats(query: StatQuery) {
  const where: Record<string, unknown> = {};
  if (query.sessionId) where.sessionId = query.sessionId;

  const stats = await prisma.placementStat.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { department: true, session: true },
  });
  return stats;
}

/**
 * Creates or updates a placement stat record using a unique department+session compound key.
 * @param input - Validated stat data including departmentId, sessionId, and placement metrics.
 * @returns The upserted placement stat record.
 */
export async function upsertStat(input: UpsertStatInput) {
  const { departmentId, sessionId, ...data } = input;

  const stat = await prisma.placementStat.upsert({
    where: {
      departmentId_sessionId: { departmentId, sessionId },
    },
    create: { departmentId, sessionId, ...data },
    update: data,
  });

  return stat;
}

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

/**
 * Retrieves a paginated list of placement activities with optional filtering.
 * @param query - Query filters including pagination, sessionId, type, and departmentId.
 * @returns Object with data array and pagination meta.
 */
export async function listActivities(query: ActivityQuery) {
  const { skip, take, page, limit } = parsePagination(query);
  const where: Record<string, unknown> = { deletedAt: null };

  if (query.sessionId) where.sessionId = query.sessionId;
  if (query.type) where.type = query.type;
  if (query.departmentId) where.departmentId = query.departmentId;

  const [data, total] = await Promise.all([
    prisma.placementActivity.findMany({
      where,
      skip,
      take,
      orderBy: { date: "desc" },
      include: { company: true, department: true, session: true },
    }),
    prisma.placementActivity.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Finds a single placement activity by its UUID.
 * @param id - The activity UUID.
 * @returns The activity record with company, department, and session details.
 * @throws {ApiError} 404 if not found.
 */
export async function findActivityById(id: string) {
  const activity = await prisma.placementActivity.findFirst({
    where: { id, deletedAt: null },
    include: { company: true, department: true, session: true },
  });
  if (!activity) throw ApiError.notFound("Placement activity not found");
  return activity;
}

/**
 * Creates a new placement activity with optional image upload.
 * @param input - Validated activity creation data.
 * @param imageFile - Optional uploaded image file.
 * @returns The newly created activity record.
 */
export async function createActivity(
  input: CreateActivityInput,
  imageFile?: Express.Multer.File,
) {
  let imageUrl: string | undefined;
  if (imageFile) {
    const result = await storageService.upload(imageFile, "placements/activities");
    imageUrl = result.url;
  }

  const activity = await prisma.placementActivity.create({
    data: {
      title: input.title,
      type: input.type,
      companyId: input.companyId,
      departmentId: input.departmentId,
      sessionId: input.sessionId,
      date: input.date,
      description: input.description,
      studentsParticipated: input.studentsParticipated,
      studentsSelected: input.studentsSelected,
      ...(imageUrl !== undefined && { imageUrl }),
    },
  });

  return activity;
}

/**
 * Updates an existing placement activity with optional image replacement.
 * @param id - The activity UUID.
 * @param input - Validated partial update data.
 * @param imageFile - Optional replacement image file.
 * @returns The updated activity record.
 * @throws {ApiError} 404 if not found.
 */
export async function updateActivity(
  id: string,
  input: UpdateActivityInput,
  imageFile?: Express.Multer.File,
) {
  const existing = await prisma.placementActivity.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Placement activity not found");

  let imageUrl: string | undefined;
  if (imageFile) {
    const result = await storageService.upload(imageFile, "placements/activities");
    imageUrl = result.url;
  }

  const activity = await prisma.placementActivity.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.companyId !== undefined && { companyId: input.companyId }),
      ...(input.departmentId !== undefined && { departmentId: input.departmentId }),
      ...(input.sessionId !== undefined && { sessionId: input.sessionId }),
      ...(input.date !== undefined && { date: input.date }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.studentsParticipated !== undefined && { studentsParticipated: input.studentsParticipated }),
      ...(input.studentsSelected !== undefined && { studentsSelected: input.studentsSelected }),
      ...(imageUrl !== undefined && { imageUrl }),
    },
  });

  return activity;
}

/**
 * Soft-deletes a placement activity by setting its deletedAt timestamp.
 * @param id - The activity UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function removeActivity(id: string) {
  const existing = await prisma.placementActivity.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Placement activity not found");

  await prisma.placementActivity.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
