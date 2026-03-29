/**
 * @file achievements.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for achievement requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Zod schema for achievement creation — validates title, description, and optional date. */
export const createAchievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date().optional(),
});

/** Zod schema for achievement updates — all fields optional for partial updates. */
export const updateAchievementSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  date: z.coerce.date().optional().nullable(),
});

/** Zod schema for validating the achievement UUID route parameter. */
export const achievementIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for achievement creation payload. */
export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
/** Inferred type for achievement update payload. */
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
