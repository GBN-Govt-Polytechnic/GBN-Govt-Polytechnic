/**
 * @file notifications.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for notification requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";
import { RECIPIENT_TYPES } from "@/config/constants";

/** Zod schema for notification creation — validates title, message, optional targetRole, departmentId, and sendEmail flag. */
export const createNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  targetRole: z.enum(RECIPIENT_TYPES).optional(),
  departmentId: z.string().uuid().optional(),
  sendEmail: z.boolean().optional(),
});

/** Zod schema for notification list query params — pagination with page and limit. */
export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
});

/** Zod schema for validating the notification UUID route parameter. */
export const notificationIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for notification creation payload. */
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
/** Inferred type for notification list query parameters. */
export type NotificationQuery = z.infer<typeof notificationQuerySchema>;
