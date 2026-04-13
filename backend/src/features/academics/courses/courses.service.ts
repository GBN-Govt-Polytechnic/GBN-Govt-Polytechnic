/**
 * @file courses.service.ts
 * @description Course business logic — CRUD operations on the courses table with soft-delete support.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { checkDepartmentAccess } from "@/middleware/department-scope";
import type { CreateCourseInput, UpdateCourseInput, CourseQuery } from "./courses.schema";

/**
 * Retrieves a list of active courses, optionally filtered by department, semester, and type.
 * @param query - Query filters including departmentId, semester, and type.
 * @returns Array of course objects with department details, ordered by semester then name.
 */
export async function list(query: CourseQuery) {
  const where: Record<string, unknown> = { deletedAt: null, isActive: true };

  if (query.departmentId) where.departmentId = query.departmentId;
  if (query.semester) where.semester = query.semester;
  if (query.type) where.type = query.type;

  const courses = await prisma.course.findMany({
    where,
    orderBy: [{ semester: "asc" }, { name: "asc" }],
    include: { department: true },
  });

  return courses;
}

/**
 * Finds a single course by its UUID.
 * @param id - The course UUID.
 * @returns The course record with department details.
 * @throws {ApiError} 404 if the course is not found or soft-deleted.
 */
export async function findById(id: string) {
  const course = await prisma.course.findFirst({
    where: { id, deletedAt: null, isActive: true },
    include: { department: true },
  });
  if (!course) throw ApiError.notFound("Course not found");
  return course;
}

/**
 * Creates a new course after checking for duplicate course codes.
 * @param input - Validated course creation data.
 * @returns The newly created course record.
 * @throws {ApiError} 409 if a course with the same code already exists.
 */
export async function create(input: CreateCourseInput) {
  const existing = await prisma.course.findFirst({
    where: { code: input.code, deletedAt: null },
  });
  if (existing) throw ApiError.conflict("A course with this code already exists");

  const course = await prisma.course.create({
    data: {
      code: input.code,
      name: input.name,
      departmentId: input.departmentId,
      semester: input.semester,
      type: input.type,
      credits: input.credits,
      description: input.description,
    },
  });
  return course;
}

/**
 * Updates an existing course by ID, checking for duplicate codes if the code is changed.
 * @param id - The course UUID.
 * @param input - Validated partial course update data.
 * @param user - Authenticated user for department access verification.
 * @returns The updated course record.
 * @throws {ApiError} 404 if the course is not found; 409 if duplicate code.
 * @throws {ApiError} 403 if user lacks department access to this resource.
 */
export async function update(id: string, input: UpdateCourseInput, user?: { role: string; departmentId?: string }) {
  const existing = await prisma.course.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Course not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  if (input.code && input.code !== existing.code) {
    const duplicate = await prisma.course.findFirst({
      where: { code: input.code, deletedAt: null },
    });
    if (duplicate) throw ApiError.conflict("A course with this code already exists");
  }

  const course = await prisma.course.update({
    where: { id },
    data: {
      ...(input.code !== undefined && { code: input.code }),
      ...(input.name !== undefined && { name: input.name }),
      ...(input.departmentId !== undefined && { departmentId: input.departmentId }),
      ...(input.semester !== undefined && { semester: input.semester }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.credits !== undefined && { credits: input.credits }),
      ...(input.description !== undefined && { description: input.description }),
    },
  });
  return course;
}

/**
 * Soft-deletes a course by setting its deletedAt timestamp.
 * @param id - The course UUID.
 * @param user - Authenticated user for department access verification.
 * @throws {ApiError} 404 if the course is not found or already deleted.
 * @throws {ApiError} 403 if user lacks department access to this resource.
 */
export async function remove(id: string, user?: { role: string; departmentId?: string }) {
  const existing = await prisma.course.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("Course not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  await prisma.course.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
