/**
 * @file sessions.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for academic session requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Zod schema for session creation — validates name format (YYYY-YY), optional dates, and isCurrent flag. */
export const createSessionSchema = z.object({
  name: z.string().regex(/^\d{4}-\d{2}$/, "Name must match format like 2025-26"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isCurrent: z.boolean().optional(),
});

/** Zod schema for session updates — all fields optional for partial updates. */
export const updateSessionSchema = z.object({
  name: z.string().regex(/^\d{4}-\d{2}$/, "Name must match format like 2025-26").optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().optional(),
});

/** Zod schema for validating the session UUID route parameter. */
export const sessionIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for session creation payload. */
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
/** Inferred type for session update payload. */
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
