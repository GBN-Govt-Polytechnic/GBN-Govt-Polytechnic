/**
 * @file placements.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for placement requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";
import { PLACEMENT_ACTIVITY_TYPES } from "@/config/constants";

const safeHttpUrl = z.string().url().refine((value) => /^https?:\/\//i.test(value), {
  message: "URL must start with http:// or https://",
});

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

/** Zod schema for placement company creation — validates name and optional logoUrl, website, description. */
export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  logoUrl: safeHttpUrl.optional(),
  industry: z.string().max(100).optional(),
  website: safeHttpUrl.optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

/** Zod schema for placement company updates — all fields optional for partial updates. */
export const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  logoUrl: safeHttpUrl.optional().nullable(),
  industry: z.string().max(100).optional().nullable(),
  website: safeHttpUrl.optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

/** Zod schema for validating the company UUID route parameter. */
export const companyIdParam = z.object({
  id: z.string().uuid(),
});

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

/** Zod schema for placement stat upsert — validates departmentId, sessionId, student counts, and packages. */
export const upsertStatSchema = z.object({
  departmentId: z.string().uuid("Invalid department ID"),
  sessionId: z.string().uuid("Invalid session ID"),
  studentsPlaced: z.coerce.number().int().min(0),
  totalStudents: z.coerce.number().int().min(0),
  highestPackage: z.coerce.number().min(0).optional(),
  averagePackage: z.coerce.number().min(0).optional(),
  companiesVisited: z.coerce.number().int().min(0),
});

/** Zod schema for placement stat query params — optional sessionId filter. */
export const statQuerySchema = z.object({
  sessionId: z.string().uuid().optional(),
});

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

/** Zod schema for placement activity creation — validates title, type, date, sessionId, and optional company/department. */
export const createActivitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(PLACEMENT_ACTIVITY_TYPES),
  companyId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  sessionId: z.string().uuid("Invalid session ID"),
  date: z.coerce.date(),
  description: z.string().optional(),
  studentsParticipated: z.coerce.number().int().min(0).optional(),
  studentsSelected: z.coerce.number().int().min(0).optional(),
});

/** Zod schema for placement activity updates — all fields optional for partial updates. */
export const updateActivitySchema = z.object({
  title: z.string().min(1).optional(),
  type: z.enum(PLACEMENT_ACTIVITY_TYPES).optional(),
  companyId: z.string().uuid().optional().nullable(),
  departmentId: z.string().uuid().optional().nullable(),
  sessionId: z.string().uuid().optional(),
  date: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  studentsParticipated: z.coerce.number().int().min(0).optional().nullable(),
  studentsSelected: z.coerce.number().int().min(0).optional().nullable(),
});

/** Zod schema for placement activity query params — pagination plus optional sessionId, type, and departmentId filters. */
export const activityQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  sessionId: z.string().uuid().optional(),
  type: z.enum(PLACEMENT_ACTIVITY_TYPES).optional(),
  departmentId: z.string().uuid().optional(),
});

/** Zod schema for validating the activity UUID route parameter. */
export const activityIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for company creation payload. */
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
/** Inferred type for company update payload. */
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
/** Inferred type for placement stat upsert payload. */
export type UpsertStatInput = z.infer<typeof upsertStatSchema>;
/** Inferred type for placement stat query parameters. */
export type StatQuery = z.infer<typeof statQuerySchema>;
/** Inferred type for placement activity creation payload. */
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
/** Inferred type for placement activity update payload. */
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
/** Inferred type for placement activity query parameters. */
export type ActivityQuery = z.infer<typeof activityQuerySchema>;
