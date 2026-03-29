/**
 * @file departments.schema.ts
 * @description Zod schemas for department requests — create, update, and param validation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Zod schema for creating a department — validates name, slug, code, and optional metadata. */
export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  hodName: z.string().optional(),
  isActive: z.boolean().default(true),
});

/** Zod schema for updating a department — all fields optional for partial updates. */
export const updateDepartmentSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  hodName: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

/** Zod schema for validating department ID route parameter as a UUID. */
export const departmentIdParam = z.object({
  id: z.string().uuid(),
});

/** Zod schema for validating department slug route parameter. */
export const departmentSlugParam = z.object({
  slug: z.string().min(1),
});

/** Inferred TypeScript type for department creation payload. */
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

/** Inferred TypeScript type for department update payload. */
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
