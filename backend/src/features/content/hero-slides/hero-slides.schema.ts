/**
 * @file hero-slides.schema.ts
 * @description Zod schemas for hero slide requests — create, update, and ID validation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Coerce FormData string booleans ("true"/"false") to actual booleans. */
const coerceBool = z.preprocess(
  (v) => (v === "true" ? true : v === "false" ? false : v),
  z.boolean(),
);

/** Zod schema for creating a hero slide — validates title, optional subtitle/link, sort order, and active status. */
export const createHeroSlideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  badge: z.string().optional(),
  linkUrl: z.string().url().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: coerceBool.default(true),
});

/** Zod schema for updating a hero slide — all fields optional for partial updates. */
export const updateHeroSlideSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  linkUrl: z.string().url().optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: coerceBool.optional(),
});

/** Zod schema for validating hero slide ID route parameter as a UUID. */
export const heroSlideIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred TypeScript type for hero slide creation payload. */
export type CreateHeroSlideInput = z.infer<typeof createHeroSlideSchema>;

/** Inferred TypeScript type for hero slide update payload. */
export type UpdateHeroSlideInput = z.infer<typeof updateHeroSlideSchema>;
