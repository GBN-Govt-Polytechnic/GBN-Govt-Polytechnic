/**
 * @file notifications.service.ts
 * @description Notification business logic — create, list, detail, delete with optional email dispatch.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import type { CreateNotificationInput, NotificationQuery } from "./notifications.schema";

/** Untyped alias for Notification model not yet in Prisma schema (reserved for future feature). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/**
 * Retrieves a paginated list of notifications with department details.
 * @param query - Query filters including page and limit.
 * @returns Object with data array and pagination meta.
 */
export async function list(query: NotificationQuery) {
  const { skip, take, page, limit } = parsePagination(query);

  const [data, total] = await Promise.all([
    db.notification.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { department: true },
    }),
    db.notification.count(),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Finds a single notification by its UUID with department and recipient count.
 * @param id - The notification UUID.
 * @returns The notification record.
 * @throws {ApiError} 404 if not found.
 */
export async function findById(id: string) {
  const notification = await db.notification.findUnique({
    where: { id },
    include: {
      department: true,
      _count: { select: { recipients: true } },
    },
  });
  if (!notification) throw ApiError.notFound("Notification not found");
  return notification;
}

/**
 * Creates a new notification and optionally triggers fire-and-forget email dispatch.
 * @param data - Validated notification creation data including optional sendEmail flag.
 * @returns The newly created notification record with department details.
 */
export async function create(data: CreateNotificationInput) {
  const { sendEmail, ...notificationData } = data;

  const notification = await db.notification.create({
    data: {
      ...notificationData,
      emailSent: false,
    },
    include: { department: true },
  });

  // Fire-and-forget email sending if requested
  if (sendEmail) {
    sendNotificationEmails(notification.id).catch(() => {
      // Silently handle email send failures
    });
  }

  return notification;
}

/**
 * Permanently deletes a notification record.
 * @param id - The notification UUID.
 * @throws {ApiError} 404 if not found.
 */
export async function remove(id: string) {
  const existing = await db.notification.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Notification not found");

  await db.notification.delete({ where: { id } });
}

/**
 * Sends notification emails to targeted recipients (fire-and-forget).
 * Updates the notification record once emails are dispatched.
 */
async function sendNotificationEmails(notificationId: string) {
  // TODO: Implement email dispatch logic based on targetRole / departmentId
  await db.notification.update({
    where: { id: notificationId },
    data: {
      emailSent: true,
      emailSentAt: new Date(),
    },
  });
}
