/**
 * @file gallery.schema.ts
 * @description Zod schemas for gallery requests — album CRUD, image params, and sort order validation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Zod schema for creating a gallery album — validates title, optional description, and publish status. */
export const createAlbumSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
});

/** Zod schema for updating a gallery album — all fields optional for partial updates. */
export const updateAlbumSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  coverUrl: z.string().url().optional().nullable(),
});

/** Zod schema for validating album ID route parameter as a UUID. */
export const albumIdParam = z.object({
  id: z.string().uuid(),
});

/** Zod schema for validating image ID route parameter as a UUID. */
export const imageIdParam = z.object({
  imageId: z.string().uuid(),
});

/** Zod schema for validating albumId route parameter used in image upload endpoints. */
export const albumIdForImagesParam = z.object({
  albumId: z.string().uuid(),
});

/** Zod schema for updating an image's sort order — validates sortOrder as a non-negative integer. */
export const updateImageOrderSchema = z.object({
  sortOrder: z.number().int().min(0),
});

/** Inferred TypeScript type for album creation payload. */
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;

/** Inferred TypeScript type for album update payload. */
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
