/**
 * @file resources.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for academic resource requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";
import { CONTENT_STATUSES } from "@/config/constants";

// ---------------------------------------------------------------------------
// Study Materials
// ---------------------------------------------------------------------------

/** Zod schema for study material creation — validates title, departmentId, semester, sessionId, and optional status. */
export const createStudyMaterialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  departmentId: z.string().uuid("Invalid department ID"),
  semester: z.coerce.number().int().min(1).max(6),
  sessionId: z.string().uuid("Invalid session ID"),
  status: z.enum(CONTENT_STATUSES).optional().default("DRAFT"),
});

/** Zod schema for study material updates — all fields optional for partial updates. */
export const updateStudyMaterialSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  departmentId: z.string().uuid().optional(),
  semester: z.coerce.number().int().min(1).max(6).optional(),
  sessionId: z.string().uuid().optional(),
  status: z.enum(CONTENT_STATUSES).optional(),
});

// ---------------------------------------------------------------------------
// Lesson Plans
// ---------------------------------------------------------------------------

/** Zod schema for lesson plan creation — validates title, departmentId, semester, sessionId, and facultyName. */
export const createLessonPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  departmentId: z.string().uuid("Invalid department ID"),
  semester: z.coerce.number().int().min(1).max(6),
  sessionId: z.string().uuid("Invalid session ID"),
  facultyName: z.string().min(1, "Faculty name is required"),
});

/** Zod schema for lesson plan updates — all fields optional for partial updates. */
export const updateLessonPlanSchema = z.object({
  title: z.string().min(1).optional(),
  departmentId: z.string().uuid().optional(),
  semester: z.coerce.number().int().min(1).max(6).optional(),
  sessionId: z.string().uuid().optional(),
  facultyName: z.string().min(1).optional(),
});

// ---------------------------------------------------------------------------
// Syllabus
// ---------------------------------------------------------------------------

/** Zod schema for syllabus creation — validates title, departmentId, semester, and sessionId. */
export const createSyllabusSchema = z.object({
  title: z.string().min(1, "Title is required"),
  departmentId: z.string().uuid("Invalid department ID"),
  semester: z.coerce.number().int().min(1).max(6),
  sessionId: z.string().uuid("Invalid session ID"),
});

/** Zod schema for syllabus updates — all fields optional for partial updates. */
export const updateSyllabusSchema = z.object({
  title: z.string().min(1).optional(),
  departmentId: z.string().uuid().optional(),
  semester: z.coerce.number().int().min(1).max(6).optional(),
  sessionId: z.string().uuid().optional(),
});

// ---------------------------------------------------------------------------
// Timetables
// ---------------------------------------------------------------------------

/** Zod schema for timetable creation — validates title, departmentId, semester, and sessionId. */
export const createTimetableSchema = z.object({
  title: z.string().min(1, "Title is required"),
  departmentId: z.string().uuid("Invalid department ID"),
  semester: z.coerce.number().int().min(1).max(6),
  sessionId: z.string().uuid("Invalid session ID"),
});

/** Zod schema for timetable updates — all fields optional for partial updates. */
export const updateTimetableSchema = z.object({
  title: z.string().min(1).optional(),
  departmentId: z.string().uuid().optional(),
  semester: z.coerce.number().int().min(1).max(6).optional(),
  sessionId: z.string().uuid().optional(),
});

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** Zod schema for resource list query params — pagination plus optional department, semester, and session filters. */
export const resourceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  departmentId: z.string().uuid().optional(),
  semester: z.coerce.number().int().min(1).max(6).optional(),
  sessionId: z.string().uuid().optional(),
});

/** Zod schema for validating the resource UUID route parameter. */
export const resourceIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for study material creation payload. */
export type CreateStudyMaterialInput = z.infer<typeof createStudyMaterialSchema>;
/** Inferred type for study material update payload. */
export type UpdateStudyMaterialInput = z.infer<typeof updateStudyMaterialSchema>;
/** Inferred type for lesson plan creation payload. */
export type CreateLessonPlanInput = z.infer<typeof createLessonPlanSchema>;
/** Inferred type for lesson plan update payload. */
export type UpdateLessonPlanInput = z.infer<typeof updateLessonPlanSchema>;
/** Inferred type for syllabus creation payload. */
export type CreateSyllabusInput = z.infer<typeof createSyllabusSchema>;
/** Inferred type for syllabus update payload. */
export type UpdateSyllabusInput = z.infer<typeof updateSyllabusSchema>;
/** Inferred type for timetable creation payload. */
export type CreateTimetableInput = z.infer<typeof createTimetableSchema>;
/** Inferred type for timetable update payload. */
export type UpdateTimetableInput = z.infer<typeof updateTimetableSchema>;
/** Inferred type for resource list query parameters. */
export type ResourceQuery = z.infer<typeof resourceQuerySchema>;
