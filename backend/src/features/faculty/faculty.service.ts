/**
 * @file faculty.service.ts
 * @description Faculty business logic — CRUD, department filtering, and photo management via MinIO
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { checkDepartmentAccess } from "@/middleware/department-scope";
import * as storageService from "@/services/storage.service";
import type { CreateFacultyInput, UpdateFacultyInput } from "./faculty.schema";

/** Storage folder path for faculty profile photos. */
const FACULTY_PHOTO_FOLDER = "faculty";

/**
 * Lists all faculty members, optionally filtered by department, sorted by display order.
 * @param departmentId - Optional UUID to filter faculty by department.
 * @returns Array of faculty records with department details.
 */
export async function list(departmentId?: string) {
  const where: Record<string, unknown> = {};
  if (departmentId) {
    where.departmentId = departmentId;
  }

  const faculty = await prisma.faculty.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    include: {
      department: { select: { id: true, name: true, slug: true, code: true } },
    },
  });

  return faculty;
}

/**
 * Finds a single faculty member by UUID with department details.
 * @param id - UUID of the faculty member.
 * @returns Faculty record with department relation.
 * @throws {ApiError} 404 if faculty member not found.
 */
export async function findById(id: string) {
  const faculty = await prisma.faculty.findUnique({
    where: { id },
    include: {
      department: { select: { id: true, name: true, slug: true, code: true } },
    },
  });
  if (!faculty) throw ApiError.notFound("Faculty member not found");
  return faculty;
}

/**
 * Creates a new faculty member with optional photo upload to storage.
 * @param input - Faculty creation data (name, designation, qualification, departmentId, etc.).
 * @param photo - Optional uploaded photo file.
 * @returns The newly created faculty record with department details.
 */
export async function create(input: CreateFacultyInput, photo?: Express.Multer.File) {
  let photoData: {
    photoUrl?: string;
    photoFileName?: string;
    photoFileSize?: number;
    photoMimeType?: string;
  } = {};

  if (photo) {
    const result = await storageService.upload(photo, FACULTY_PHOTO_FOLDER);
    photoData = {
      photoUrl: result.url,
      photoFileName: result.fileName,
      photoFileSize: result.fileSize,
      photoMimeType: result.mimeType,
    };
  }

  const faculty = await prisma.faculty.create({
    data: {
      name: input.name,
      designation: input.designation,
      qualification: input.qualification,
      email: input.email || undefined,
      phone: input.phone,
      departmentId: input.departmentId,
      specialization: input.specialization,
      experience: input.experience,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
      ...photoData,
    },
    include: {
      department: { select: { id: true, name: true, slug: true, code: true } },
    },
  });

  return faculty;
}

/**
 * Updates a faculty member's details and replaces their photo if a new one is uploaded.
 * Deletes the old photo from storage when replaced.
 * @param id - UUID of the faculty member to update.
 * @param input - Partial update data for the faculty member.
 * @param photo - Optional new photo file to replace the existing one.
 * @param user - Authenticated user for department access verification.
 * @returns The updated faculty record with department details.
 * @throws {ApiError} 404 if faculty member not found.
 * @throws {ApiError} 403 if user lacks department access to this resource.
 */
export async function update(
  id: string,
  input: UpdateFacultyInput,
  photo?: Express.Multer.File,
  user?: { role: string; departmentId?: string },
) {
  const existing = await prisma.faculty.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Faculty member not found");

  if (user) checkDepartmentAccess(user, existing.departmentId);

  let photoData: {
    photoUrl?: string;
    photoFileName?: string;
    photoFileSize?: number;
    photoMimeType?: string;
  } = {};

  if (photo) {
    // Delete old photo if exists
    if (existing.photoUrl) {
      const oldKey = extractKeyFromUrl(existing.photoUrl);
      if (oldKey) {
        storageService.deleteFile(oldKey).catch(() => {});
      }
    }

    const result = await storageService.upload(photo, FACULTY_PHOTO_FOLDER);
    photoData = {
      photoUrl: result.url,
      photoFileName: result.fileName,
      photoFileSize: result.fileSize,
      photoMimeType: result.mimeType,
    };
  }

  const faculty = await prisma.faculty.update({
    where: { id },
    data: {
      name: input.name,
      designation: input.designation,
      qualification: input.qualification,
      email: input.email,
      phone: input.phone,
      departmentId: input.departmentId,
      specialization: input.specialization,
      experience: input.experience,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
      ...photoData,
    },
    include: {
      department: { select: { id: true, name: true, slug: true, code: true } },
    },
  });

  return faculty;
}

/**
 * Permanently deletes a faculty member and removes their photo from storage.
 * @param id - UUID of the faculty member to delete.
 * @param user - Authenticated user for department access verification.
 * @throws {ApiError} 404 if faculty member not found.
 * @throws {ApiError} 403 if user lacks department access to this resource.
 */
export async function remove(id: string, user?: { role: string; departmentId?: string }) {
  const faculty = await prisma.faculty.findUnique({ where: { id } });
  if (!faculty) throw ApiError.notFound("Faculty member not found");

  if (user) checkDepartmentAccess(user, faculty.departmentId);

  // Delete photo from storage if exists
  if (faculty.photoUrl) {
    const key = extractKeyFromUrl(faculty.photoUrl);
    if (key) {
      storageService.deleteFile(key).catch(() => {});
    }
  }

  await prisma.faculty.delete({ where: { id } });
}

/**
 * Extracts the storage object key from a full MinIO URL.
 * @param url - Full URL of the stored file.
 * @returns The object key string, or null if URL format is invalid.
 */
function extractKeyFromUrl(url: string): string | null {
  // URL format: protocol://host:port/bucket/key
  const parts = url.split("/");
  // key starts after bucket name (4th segment: protocol, empty, host:port, bucket, ...key)
  if (parts.length >= 5) {
    return parts.slice(4).join("/");
  }
  return null;
}
