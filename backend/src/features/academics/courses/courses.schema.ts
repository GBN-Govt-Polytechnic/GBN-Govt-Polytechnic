/**
 * @file courses.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for course requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";
import { COURSE_TYPES } from "@/config/constants";

/** Zod schema for course creation — validates code, name, departmentId, semester, type, and optional credits/description. */
export const createCourseSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  departmentId: z.string().uuid("Invalid department ID"),
  semester: z.coerce.number().int().min(1).max(6),
  type: z.enum(COURSE_TYPES),
  credits: z.coerce.number().int().min(1).optional(),
  description: z.string().optional(),
});

/** Zod schema for course updates — all fields optional to allow partial updates. */
export const updateCourseSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  departmentId: z.string().uuid().optional(),
  semester: z.coerce.number().int().min(1).max(6).optional(),
  type: z.enum(COURSE_TYPES).optional(),
  credits: z.coerce.number().int().min(1).optional().nullable(),
  description: z.string().optional().nullable(),
});

/** Zod schema for course list query params — optional departmentId, semester, and type filters. */
export const courseQuerySchema = z.object({
  departmentId: z.string().uuid().optional(),
  semester: z.coerce.number().int().min(1).max(6).optional(),
  type: z.enum(COURSE_TYPES).optional(),
});

/** Zod schema for validating the course UUID route parameter. */
export const courseIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for course creation payload. */
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
/** Inferred type for course update payload. */
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
/** Inferred type for course list query parameters. */
export type CourseQuery = z.infer<typeof courseQuerySchema>;
