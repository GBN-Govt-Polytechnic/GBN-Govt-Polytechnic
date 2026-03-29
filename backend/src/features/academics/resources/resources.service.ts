/**
 * @file resources.service.ts
 * @description Resource business logic — CRUD for study materials, lesson plans, syllabus, and timetables with file uploads.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { checkDepartmentAccess } from "@/middleware/department-scope";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import * as storageService from "@/services/storage.service";
import type {
  CreateStudyMaterialInput,
  UpdateStudyMaterialInput,
  CreateLessonPlanInput,
  UpdateLessonPlanInput,
  CreateSyllabusInput,
  UpdateSyllabusInput,
  CreateTimetableInput,
  UpdateTimetableInput,
  ResourceQuery,
} from "./resources.schema";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/**
 * Builds a Prisma where clause from the resource query filters.
 * @param query - Query filters including departmentId, semester, and sessionId.
 * @returns A where object for Prisma queries.
 */
function buildResourceWhere(query: ResourceQuery) {
  const where: Record<string, unknown> = { deletedAt: null };
  if (query.departmentId) where.departmentId = query.departmentId;
  if (query.semester) where.semester = query.semester;
  if (query.sessionId) where.sessionId = query.sessionId;
  return where;
}

/**
 * Uploads a file to storage and returns the file metadata fields.
 * @param file - The uploaded Multer file.
 * @param folder - The storage folder path.
 * @returns Object containing fileUrl, fileName, fileSize, and fileMimeType.
 */
async function uploadFile(file: Express.Multer.File, folder: string) {
  const result = await storageService.upload(file, folder);
  return {
    fileUrl: result.url,
    fileName: result.fileName,
    fileSize: result.fileSize,
    fileMimeType: result.mimeType,
  };
}

// ---------------------------------------------------------------------------
// Study Materials
// ---------------------------------------------------------------------------

/**
 * Retrieves a paginated list of study materials with optional filtering.
 * @param query - Query filters including pagination, departmentId, semester, and sessionId.
 * @returns Object with data array and pagination meta.
 */
export async function listStudyMaterials(query: ResourceQuery) {
  const { skip, take, page, limit } = parsePagination(query);
  const where = buildResourceWhere(query);

  const [data, total] = await Promise.all([
    prisma.studyMaterial.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { department: true, session: true },
    }),
    prisma.studyMaterial.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Finds a single study material by its UUID.
 * @param id - The study material UUID.
 * @returns The study material record with department and session details.
 * @throws {ApiError} 404 if not found.
 */
export async function findStudyMaterialById(id: string) {
  const item = await prisma.studyMaterial.findFirst({
    where: { id, deletedAt: null },
    include: { department: true, session: true },
  });
  if (!item) throw ApiError.notFound("Study material not found");
  return item;
}

/**
 * Creates a new study material with file upload.
 * @param input - Validated study material creation data.
 * @param file - The uploaded document file.
 * @param uploadedById - UUID of the admin who uploaded the material.
 * @returns The newly created study material record.
 */
export async function createStudyMaterial(
  input: CreateStudyMaterialInput,
  file: Express.Multer.File,
  uploadedById: string,
) {
  const fileData = await uploadFile(file, "resources/study-materials");

  const item = await prisma.studyMaterial.create({
    data: {
      ...input,
      ...fileData,
      uploadedById,
    },
  });

  return item;
}

/**
 * Updates an existing study material with optional file replacement.
 * @param id - The study material UUID.
 * @param input - Validated partial update data.
 * @param file - Optional replacement document file.
 * @returns The updated study material record.
 * @throws {ApiError} 404 if not found.
 */
export async function updateStudyMaterial(
  id: string,
  input: UpdateStudyMaterialInput,
  file?: Express.Multer.File,
  user?: { role: string; departmentId?: string },
) {
  const existing = await prisma.studyMaterial.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Study material not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  let fileData = {};
  if (file) {
    fileData = await uploadFile(file, "resources/study-materials");
  }

  const item = await prisma.studyMaterial.update({
    where: { id },
    data: { ...input, ...fileData },
  });

  return item;
}

/**
 * Soft-deletes a study material by setting its deletedAt timestamp.
 * @param id - The study material UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function removeStudyMaterial(id: string, user?: { role: string; departmentId?: string }) {
  const existing = await prisma.studyMaterial.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Study material not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  await prisma.studyMaterial.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// ---------------------------------------------------------------------------
// Lesson Plans
// ---------------------------------------------------------------------------

/**
 * Retrieves a paginated list of lesson plans with optional filtering.
 * @param query - Query filters including pagination, departmentId, semester, and sessionId.
 * @returns Object with data array and pagination meta.
 */
export async function listLessonPlans(query: ResourceQuery) {
  const { skip, take, page, limit } = parsePagination(query);
  const where = { ...buildResourceWhere(query), type: "LESSON_PLAN" as const };

  const [data, total] = await Promise.all([
    prisma.academicDocument.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { department: true, session: true },
    }),
    prisma.academicDocument.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Finds a single lesson plan by its UUID.
 * @param id - The lesson plan UUID.
 * @returns The lesson plan record with department and session details.
 * @throws {ApiError} 404 if not found.
 */
export async function findLessonPlanById(id: string) {
  const item = await prisma.academicDocument.findFirst({
    where: { id, deletedAt: null, type: "LESSON_PLAN" },
    include: { department: true, session: true },
  });
  if (!item) throw ApiError.notFound("Lesson plan not found");
  return item;
}

/**
 * Creates a new lesson plan with file upload.
 * @param input - Validated lesson plan creation data.
 * @param file - The uploaded document file.
 * @returns The newly created lesson plan record.
 */
export async function createLessonPlan(
  input: CreateLessonPlanInput,
  file: Express.Multer.File,
) {
  const fileData = await uploadFile(file, "resources/lesson-plans");

  const item = await prisma.academicDocument.create({
    data: { ...input, ...fileData, type: "LESSON_PLAN" },
  });

  return item;
}

/**
 * Updates an existing lesson plan with optional file replacement.
 * @param id - The lesson plan UUID.
 * @param input - Validated partial update data.
 * @param file - Optional replacement document file.
 * @returns The updated lesson plan record.
 * @throws {ApiError} 404 if not found.
 */
export async function updateLessonPlan(
  id: string,
  input: UpdateLessonPlanInput,
  file?: Express.Multer.File,
  user?: { role: string; departmentId?: string },
) {
  const existing = await prisma.academicDocument.findFirst({
    where: { id, deletedAt: null, type: "LESSON_PLAN" },
  });
  if (!existing) throw ApiError.notFound("Lesson plan not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  let fileData = {};
  if (file) {
    fileData = await uploadFile(file, "resources/lesson-plans");
  }

  const item = await prisma.academicDocument.update({
    where: { id },
    data: { ...input, ...fileData },
  });

  return item;
}

/**
 * Soft-deletes a lesson plan by setting its deletedAt timestamp.
 * @param id - The lesson plan UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function removeLessonPlan(id: string, user?: { role: string; departmentId?: string }) {
  const existing = await prisma.academicDocument.findFirst({
    where: { id, deletedAt: null, type: "LESSON_PLAN" },
  });
  if (!existing) throw ApiError.notFound("Lesson plan not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  await prisma.academicDocument.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// ---------------------------------------------------------------------------
// Syllabus
// ---------------------------------------------------------------------------

/**
 * Retrieves a paginated list of syllabus records with optional filtering.
 * @param query - Query filters including pagination, departmentId, semester, and sessionId.
 * @returns Object with data array and pagination meta.
 */
export async function listSyllabus(query: ResourceQuery) {
  const { skip, take, page, limit } = parsePagination(query);
  const where = { ...buildResourceWhere(query), type: "SYLLABUS" as const };

  const [data, total] = await Promise.all([
    prisma.academicDocument.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { department: true, session: true },
    }),
    prisma.academicDocument.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Finds a single syllabus by its UUID.
 * @param id - The syllabus UUID.
 * @returns The syllabus record with department and session details.
 * @throws {ApiError} 404 if not found.
 */
export async function findSyllabusById(id: string) {
  const item = await prisma.academicDocument.findFirst({
    where: { id, deletedAt: null, type: "SYLLABUS" },
    include: { department: true, session: true },
  });
  if (!item) throw ApiError.notFound("Syllabus not found");
  return item;
}

/**
 * Creates a new syllabus with file upload.
 * @param input - Validated syllabus creation data.
 * @param file - The uploaded document file.
 * @returns The newly created syllabus record.
 */
export async function createSyllabus(
  input: CreateSyllabusInput,
  file: Express.Multer.File,
) {
  const fileData = await uploadFile(file, "resources/syllabus");

  const item = await prisma.academicDocument.create({
    data: { ...input, ...fileData, type: "SYLLABUS" },
  });

  return item;
}

/**
 * Updates an existing syllabus with optional file replacement.
 * @param id - The syllabus UUID.
 * @param input - Validated partial update data.
 * @param file - Optional replacement document file.
 * @returns The updated syllabus record.
 * @throws {ApiError} 404 if not found.
 */
export async function updateSyllabus(
  id: string,
  input: UpdateSyllabusInput,
  file?: Express.Multer.File,
  user?: { role: string; departmentId?: string },
) {
  const existing = await prisma.academicDocument.findFirst({
    where: { id, deletedAt: null, type: "SYLLABUS" },
  });
  if (!existing) throw ApiError.notFound("Syllabus not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  let fileData = {};
  if (file) {
    fileData = await uploadFile(file, "resources/syllabus");
  }

  const item = await prisma.academicDocument.update({
    where: { id },
    data: { ...input, ...fileData },
  });

  return item;
}

/**
 * Soft-deletes a syllabus by setting its deletedAt timestamp.
 * @param id - The syllabus UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function removeSyllabus(id: string, user?: { role: string; departmentId?: string }) {
  const existing = await prisma.academicDocument.findFirst({
    where: { id, deletedAt: null, type: "SYLLABUS" },
  });
  if (!existing) throw ApiError.notFound("Syllabus not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  await prisma.academicDocument.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// ---------------------------------------------------------------------------
// Timetables
// ---------------------------------------------------------------------------

/**
 * Retrieves a paginated list of timetables with optional filtering.
 * @param query - Query filters including pagination, departmentId, semester, and sessionId.
 * @returns Object with data array and pagination meta.
 */
export async function listTimetables(query: ResourceQuery) {
  const { skip, take, page, limit } = parsePagination(query);
  const where = { ...buildResourceWhere(query), type: "TIMETABLE" as const };

  const [data, total] = await Promise.all([
    prisma.academicDocument.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { department: true, session: true },
    }),
    prisma.academicDocument.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Finds a single timetable by its UUID.
 * @param id - The timetable UUID.
 * @returns The timetable record with department and session details.
 * @throws {ApiError} 404 if not found.
 */
export async function findTimetableById(id: string) {
  const item = await prisma.academicDocument.findFirst({
    where: { id, deletedAt: null, type: "TIMETABLE" },
    include: { department: true, session: true },
  });
  if (!item) throw ApiError.notFound("Timetable not found");
  return item;
}

/**
 * Creates a new timetable with file upload.
 * @param input - Validated timetable creation data.
 * @param file - The uploaded document file.
 * @returns The newly created timetable record.
 */
export async function createTimetable(
  input: CreateTimetableInput,
  file: Express.Multer.File,
) {
  const fileData = await uploadFile(file, "resources/timetables");

  const item = await prisma.academicDocument.create({
    data: { ...input, ...fileData, type: "TIMETABLE" },
  });

  return item;
}

/**
 * Updates an existing timetable with optional file replacement.
 * @param id - The timetable UUID.
 * @param input - Validated partial update data.
 * @param file - Optional replacement document file.
 * @returns The updated timetable record.
 * @throws {ApiError} 404 if not found.
 */
export async function updateTimetable(
  id: string,
  input: UpdateTimetableInput,
  file?: Express.Multer.File,
  user?: { role: string; departmentId?: string },
) {
  const existing = await prisma.academicDocument.findFirst({
    where: { id, deletedAt: null, type: "TIMETABLE" },
  });
  if (!existing) throw ApiError.notFound("Timetable not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  let fileData = {};
  if (file) {
    fileData = await uploadFile(file, "resources/timetables");
  }

  const item = await prisma.academicDocument.update({
    where: { id },
    data: { ...input, ...fileData },
  });

  return item;
}

/**
 * Soft-deletes a timetable by setting its deletedAt timestamp.
 * @param id - The timetable UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function removeTimetable(id: string, user?: { role: string; departmentId?: string }) {
  const existing = await prisma.academicDocument.findFirst({
    where: { id, deletedAt: null, type: "TIMETABLE" },
  });
  if (!existing) throw ApiError.notFound("Timetable not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  await prisma.academicDocument.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
