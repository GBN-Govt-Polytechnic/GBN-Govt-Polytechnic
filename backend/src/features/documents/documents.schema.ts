/**
 * @file documents.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for public document requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

const CATEGORIES = ["APPROVAL", "MANDATORY_DISCLOSURE", "FEE_STRUCTURE", "RTI", "ANNUAL_REPORT", "COMMITTEE", "GOVT_ORDER", "OTHER"] as const;

/** Zod schema for public document creation — validates title, category, year, and optional ordering. */
export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  category: z.enum(CATEGORIES, { message: "Invalid category" }),
  year: z.coerce.number().int().min(2000).max(2100),
  isActive: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});

/** Zod schema for public document updates — all fields optional for partial updates. */
export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  category: z.enum(CATEGORIES).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  isActive: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

/** Zod schema for validating the document UUID route parameter. */
export const documentIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for document creation payload. */
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
/** Inferred type for document update payload. */
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
