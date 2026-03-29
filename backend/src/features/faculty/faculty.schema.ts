/**
 * @file faculty.schema.ts
 * @description Zod schemas for faculty requests — create, update, ID param, and query validation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Zod schema for creating a faculty member — validates name, designation, qualification, department, and optional fields. */
export const createFacultySchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  qualification: z.string().min(1, "Qualification is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  departmentId: z.string().uuid("Invalid department ID"),
  specialization: z.string().optional(),
  experience: z.string().max(200).optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});

/** Zod schema for updating a faculty member — all fields optional for partial updates. */
export const updateFacultySchema = z.object({
  name: z.string().min(1).optional(),
  designation: z.string().min(1).optional(),
  qualification: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().nullable(),
  departmentId: z.string().uuid().optional(),
  specialization: z.string().optional().nullable(),
  experience: z.string().max(200).optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});

/** Zod schema for validating faculty ID route parameter as a UUID. */
export const facultyIdParam = z.object({
  id: z.string().uuid(),
});

/** Zod schema for faculty list query parameters — optional department filter. */
export const querySchema = z.object({
  departmentId: z.string().uuid().optional(),
});

/** Inferred TypeScript type for faculty creation payload. */
export type CreateFacultyInput = z.infer<typeof createFacultySchema>;

/** Inferred TypeScript type for faculty update payload. */
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
