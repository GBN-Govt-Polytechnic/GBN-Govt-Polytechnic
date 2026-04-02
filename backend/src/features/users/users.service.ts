/**
 * @file users.service.ts
 * @description User management business logic — CRUD operations on admin user accounts
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import { invalidateUserCache } from "@/middleware/auth";
import type { CreateUserInput, UpdateUserInput, ResetUserPasswordInput, UserQuery } from "./users.schema";

/**
 * Finds a single admin user by ID with department details.
 * @param id - UUID of the admin user to retrieve.
 * @returns Admin user record with department relation.
 * @throws {ApiError} 404 if user not found.
 */
export async function findById(id: string) {
  const user = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      departmentId: true,
      avatarUrl: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      department: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!user) throw ApiError.notFound("User not found");
  return user;
}

/**
 * Retrieves a paginated list of admin users with optional role filtering.
 * @param query - Query parameters including page, limit, and optional role filter.
 * @returns Object containing data array and pagination meta.
 */
export async function list(query: UserQuery) {
  const { skip, take, page, limit } = parsePagination(query);
  const where: Record<string, unknown> = {};

  if (query.role) {
    where.role = query.role;
  }
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  const [data, total] = await Promise.all([
    prisma.adminUser.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        departmentId: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        department: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.adminUser.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Creates a new admin user with a bcrypt-hashed password.
 * @param input - User creation data (name, email, password, role, optional departmentId).
 * @returns The newly created admin user record.
 * @throws {ApiError} 409 if a user with the same email already exists.
 */
export async function create(input: CreateUserInput) {
  const existing = await prisma.adminUser.findFirst({ where: { email: input.email } });
  if (existing) throw ApiError.conflict("A user with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.adminUser.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      departmentId: input.departmentId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      departmentId: true,
      isActive: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Updates an existing admin user's profile fields.
 * @param id - UUID of the admin user to update.
 * @param input - Partial update data (name, email, role, departmentId, isActive).
 * @returns The updated admin user record.
 * @throws {ApiError} 404 if user not found.
 * @throws {ApiError} 409 if updated email conflicts with an existing user.
 */
export async function update(id: string, input: UpdateUserInput) {
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound("User not found");

  if (input.email && input.email !== user.email) {
    const existing = await prisma.adminUser.findFirst({ where: { email: input.email } });
    if (existing) throw ApiError.conflict("A user with this email already exists");
  }

  const updated = await prisma.adminUser.update({
    where: { id },
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      departmentId: input.departmentId,
      isActive: input.isActive,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      departmentId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Proactively invalidate isActive cache so deactivation takes effect immediately
  invalidateUserCache(id);

  return updated;
}

/**
 * Permanently deletes an admin user from the database.
 * @param id - UUID of the admin user to delete.
 * @throws {ApiError} 404 if user not found.
 */
export async function remove(id: string) {
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound("User not found");

  await prisma.$transaction([
    prisma.refreshToken.updateMany({
      where: {
        userId: id,
        userType: "admin",
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    }),
    prisma.adminUser.delete({ where: { id } }),
  ]);

  invalidateUserCache(id);
}

/**
 * Resets an existing admin user's password and revokes all active refresh tokens.
 * @param id - UUID of the admin user whose password will be reset.
 * @param input - Password reset payload containing the new plaintext password.
 * @throws {ApiError} 404 if user not found.
 */
export async function resetPassword(id: string, input: ResetUserPasswordInput) {
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound("User not found");

  const passwordHash = await bcrypt.hash(input.newPassword, 12);

  await prisma.$transaction([
    prisma.adminUser.update({
      where: { id },
      data: {
        passwordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
    prisma.refreshToken.updateMany({
      where: {
        userId: id,
        userType: "admin",
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    }),
  ]);

  invalidateUserCache(id);
}
