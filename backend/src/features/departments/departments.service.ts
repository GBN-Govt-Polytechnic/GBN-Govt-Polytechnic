/**
 * @file departments.service.ts
 * @description Department business logic — list, detail, create, update, and delete
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import type { CreateDepartmentInput, UpdateDepartmentInput } from "./departments.schema";

/**
 * Lists all active departments sorted alphabetically with faculty and course counts.
 * @returns Array of department records with relation counts.
 */
export async function list() {
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          faculty: true,
          courses: true,
        },
      },
    },
  });

  return departments;
}

/**
 * Finds a department by its URL-friendly slug.
 * @param slug - The unique slug identifier for the department.
 * @returns Department record with relation counts.
 * @throws {ApiError} 404 if department not found.
 */
export async function findBySlug(slug: string) {
  const department = await prisma.department.findFirst({
    where: { slug },
    include: {
      _count: {
        select: {
          faculty: true,
          courses: true,
        },
      },
    },
  });
  if (!department) throw ApiError.notFound("Department not found");
  return department;
}

/**
 * Finds a department by its UUID.
 * @param id - UUID of the department.
 * @returns Department record with relation counts.
 * @throws {ApiError} 404 if department not found.
 */
export async function findById(id: string) {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          faculty: true,
          courses: true,
        },
      },
    },
  });
  if (!department) throw ApiError.notFound("Department not found");
  return department;
}

/**
 * Creates a new department after checking for slug and code uniqueness.
 * @param input - Department creation data (name, slug, code, description, hodName, isActive).
 * @returns The newly created department record.
 * @throws {ApiError} 409 if a department with the same slug or code already exists.
 */
export async function create(input: CreateDepartmentInput) {
  const existingSlug = await prisma.department.findFirst({ where: { slug: input.slug } });
  if (existingSlug) throw ApiError.conflict("A department with this slug already exists");

  const existingCode = await prisma.department.findFirst({ where: { code: input.code } });
  if (existingCode) throw ApiError.conflict("A department with this code already exists");

  const department = await prisma.department.create({
    data: {
      name: input.name,
      slug: input.slug,
      code: input.code,
      description: input.description,
      hodName: input.hodName,
      isActive: input.isActive,
    },
  });

  return department;
}

/**
 * Updates an existing department's fields with uniqueness checks on slug and code.
 * @param id - UUID of the department to update.
 * @param input - Partial update data for the department.
 * @returns The updated department record.
 * @throws {ApiError} 404 if department not found.
 * @throws {ApiError} 409 if updated slug or code conflicts with an existing department.
 */
export async function update(id: string, input: UpdateDepartmentInput) {
  const department = await prisma.department.findUnique({ where: { id } });
  if (!department) throw ApiError.notFound("Department not found");

  if (input.slug && input.slug !== department.slug) {
    const existing = await prisma.department.findFirst({ where: { slug: input.slug } });
    if (existing) throw ApiError.conflict("A department with this slug already exists");
  }

  if (input.code && input.code !== department.code) {
    const existing = await prisma.department.findFirst({ where: { code: input.code } });
    if (existing) throw ApiError.conflict("A department with this code already exists");
  }

  const updated = await prisma.department.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      code: input.code,
      description: input.description,
      hodName: input.hodName,
      isActive: input.isActive,
    },
  });

  return updated;
}

/**
 * Permanently deletes a department from the database.
 * @param id - UUID of the department to delete.
 * @throws {ApiError} 404 if department not found.
 */
export async function remove(id: string) {
  const department = await prisma.department.findUnique({ where: { id } });
  if (!department) throw ApiError.notFound("Department not found");

  await prisma.department.delete({ where: { id } });
}
