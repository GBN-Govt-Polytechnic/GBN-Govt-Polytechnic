/**
 * @file events.schema.ts
 * @description Zod schemas for event requests — create, update, query, and ID validation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";
import { CONTENT_STATUSES } from "@/config/constants";

/** Zod schema for creating an event — validates title, description, dates, location, and status. */
export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().optional(),
  status: z.enum(CONTENT_STATUSES).default("DRAFT"),
});

/** Zod schema for updating an event — all fields optional for partial updates. */
export const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  location: z.string().optional().nullable(),
  status: z.enum(CONTENT_STATUSES).optional(),
});

/** Zod schema for event list query parameters — pagination and status filter. */
export const eventQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  status: z.enum(CONTENT_STATUSES).optional(),
});

/** Zod schema for validating event ID route parameter as a UUID. */
export const eventIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred TypeScript type for event creation payload. */
export type CreateEventInput = z.infer<typeof createEventSchema>;

/** Inferred TypeScript type for event update payload. */
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

/** Inferred TypeScript type for event list query parameters. */
export type EventQuery = z.infer<typeof eventQuerySchema>;
