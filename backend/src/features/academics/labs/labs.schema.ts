/**
 * @file labs.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for lab requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Zod schema for lab creation — validates name, roomNumber, departmentId, description, and equipment list. */
export const createLabSchema = z.object({
  name: z.string().min(1, "Name is required"),
  roomNumber: z.string().optional(),
  departmentId: z.string().uuid("Invalid department ID"),
  description: z.string().optional(),
  equipment: z.array(z.string()).optional(),
});

/** Zod schema for lab updates — all fields optional to allow partial updates. */
export const updateLabSchema = z.object({
  name: z.string().min(1).optional(),
  roomNumber: z.string().optional().nullable(),
  departmentId: z.string().uuid().optional(),
  description: z.string().optional().nullable(),
  equipment: z.array(z.string()).optional().nullable(),
});

/** Zod schema for lab list query params — optional departmentId filter. */
export const labQuerySchema = z.object({
  departmentId: z.string().uuid().optional(),
});

/** Zod schema for validating the lab UUID route parameter. */
export const labIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for lab creation payload. */
export type CreateLabInput = z.infer<typeof createLabSchema>;
/** Inferred type for lab update payload. */
export type UpdateLabInput = z.infer<typeof updateLabSchema>;
/** Inferred type for lab list query parameters. */
export type LabQuery = z.infer<typeof labQuerySchema>;
