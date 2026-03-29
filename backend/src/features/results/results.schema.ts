/**
 * @file results.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for result link requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Zod schema for result link creation — validates title, optional semester, year, sessionId, and externalUrl. */
export const createResultSchema = z.object({
  title: z.string().min(1, "Title is required"),
  semester: z.coerce.number().int().optional(),
  year: z.coerce.number().int().optional(),
  sessionId: z.string().uuid().optional(),
  externalUrl: z.string().url().refine(
    (url) => url.startsWith("https://") || url.startsWith("http://"),
    "External URL must use http or https scheme",
  ).optional(),
});

/** Zod schema for result link updates — all fields optional for partial updates. */
export const updateResultSchema = z.object({
  title: z.string().min(1).optional(),
  semester: z.coerce.number().int().optional().nullable(),
  year: z.coerce.number().int().optional().nullable(),
  sessionId: z.string().uuid().optional().nullable(),
  externalUrl: z.string().url().refine(
    (url) => url.startsWith("https://") || url.startsWith("http://"),
    "External URL must use http or https scheme",
  ).optional().nullable(),
});

/** Zod schema for result list query params — pagination plus optional semester, year, and sessionId filters. */
export const resultQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  semester: z.coerce.number().int().optional(),
  year: z.coerce.number().int().optional(),
  sessionId: z.string().uuid().optional(),
});

/** Zod schema for validating the result link UUID route parameter. */
export const resultIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for result link creation payload. */
export type CreateResultInput = z.infer<typeof createResultSchema>;
/** Inferred type for result link update payload. */
export type UpdateResultInput = z.infer<typeof updateResultSchema>;
/** Inferred type for result list query parameters. */
export type ResultQuery = z.infer<typeof resultQuerySchema>;
