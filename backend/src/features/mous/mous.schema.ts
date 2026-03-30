/**
 * @file mous.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for MoU requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Coerces multipart/form-data boolean strings ("true"/"false") to real booleans. */
const coercedBoolean = z.preprocess(
  (v) => (v === "true" ? true : v === "false" ? false : v),
  z.boolean(),
);

/** Zod schema for MoU creation — validates companyName, purpose, and optional dates/active status. */
export const createMoUSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  purpose: z.string().min(1, "Purpose is required"),
  signedDate: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
  isActive: coercedBoolean.optional(),
});

/** Zod schema for MoU updates — all fields optional for partial updates. */
export const updateMoUSchema = z.object({
  companyName: z.string().min(1).optional(),
  purpose: z.string().min(1).optional(),
  signedDate: z.coerce.date().optional().nullable(),
  validUntil: z.coerce.date().optional().nullable(),
  isActive: coercedBoolean.optional(),
});

/** Zod schema for validating the MoU UUID route parameter. */
export const mouIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for MoU creation payload. */
export type CreateMoUInput = z.infer<typeof createMoUSchema>;
/** Inferred type for MoU update payload. */
export type UpdateMoUInput = z.infer<typeof updateMoUSchema>;
