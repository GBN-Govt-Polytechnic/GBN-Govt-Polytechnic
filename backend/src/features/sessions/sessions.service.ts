/**
 * @file sessions.service.ts
 * @description Academic session business logic — CRUD with current-session toggle using transactions.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import type { CreateSessionInput, UpdateSessionInput } from "./sessions.schema";

type TransactionClient = Prisma.TransactionClient;

/**
 * Retrieves all academic sessions ordered by name descending.
 * @returns Array of academic session records.
 */
export async function list() {
  const sessions = await prisma.academicSession.findMany({
    orderBy: { name: "desc" },
  });
  return sessions;
}

/**
 * Finds a single academic session by its UUID.
 * @param id - The session UUID.
 * @returns The session record.
 * @throws {ApiError} 404 if not found.
 */
export async function findById(id: string) {
  const session = await prisma.academicSession.findUnique({ where: { id } });
  if (!session) throw ApiError.notFound("Academic session not found");
  return session;
}

/**
 * Creates a new academic session within a transaction; if isCurrent is true, unsets all other current sessions.
 * @param data - Validated session creation data.
 * @returns The newly created session record.
 * @throws {ApiError} 409 if a session with the same name already exists.
 */
export async function create(data: CreateSessionInput) {
  return prisma.$transaction(async (tx: TransactionClient) => {
    const existing = await tx.academicSession.findFirst({ where: { name: data.name } });
    if (existing) throw ApiError.conflict("A session with this name already exists");

    if (data.isCurrent) {
      await tx.academicSession.updateMany({
        data: { isCurrent: false },
      });
    }

    return tx.academicSession.create({ data });
  });
}

/**
 * Updates an existing academic session; uses a transaction when toggling the current-session flag.
 * @param id - The session UUID.
 * @param data - Validated partial update data.
 * @returns The updated session record.
 * @throws {ApiError} 404 if not found; 409 if duplicate name.
 */
export async function update(id: string, data: UpdateSessionInput) {
  const existing = await prisma.academicSession.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Academic session not found");

  if (data.name && data.name !== existing.name) {
    const duplicate = await prisma.academicSession.findFirst({ where: { name: data.name } });
    if (duplicate) throw ApiError.conflict("A session with this name already exists");
  }

  if (data.isCurrent === true) {
    // Use a transaction to ensure atomicity when toggling the current session
    const session = await prisma.$transaction(async (tx: TransactionClient) => {
      await tx.academicSession.updateMany({
        data: { isCurrent: false },
      });
      return tx.academicSession.update({
        where: { id },
        data,
      });
    });
    return session;
  }

  const session = await prisma.academicSession.update({
    where: { id },
    data,
  });
  return session;
}

/**
 * Permanently deletes an academic session.
 * @param id - The session UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function remove(id: string) {
  const existing = await prisma.academicSession.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Academic session not found");

  await prisma.academicSession.delete({ where: { id } });
}
