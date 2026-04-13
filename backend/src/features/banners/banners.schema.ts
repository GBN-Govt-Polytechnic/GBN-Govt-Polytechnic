/**
 * @file banners.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for banner requests.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Allowed banner variant values. */
const bannerVariant = z.enum(["INFO", "WARNING", "URGENT", "SUCCESS"]);
const safeLinkUrl = z
  .string()
  .max(500)
  .refine((value) => /^(https?:\/\/|\/(?!\/)).+/i.test(value), {
    message: "linkUrl must be http(s) or an internal path",
  });

/** Zod schema for banner creation. */
export const createBannerSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  message: z.string().min(1, "Message is required").max(1000),
  linkUrl: safeLinkUrl.optional().nullable(),
  linkText: z.string().max(100).optional().nullable(),
  variant: bannerVariant.optional(),
  isActive: z.coerce.boolean().optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
});

/** Zod schema for banner updates — all fields optional. */
export const updateBannerSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  message: z.string().min(1).max(1000).optional(),
  linkUrl: safeLinkUrl.optional().nullable(),
  linkText: z.string().max(100).optional().nullable(),
  variant: bannerVariant.optional(),
  isActive: z.coerce.boolean().optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
});

/** Zod schema for validating the banner UUID route parameter. */
export const bannerIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred type for banner creation payload. */
export type CreateBannerInput = z.infer<typeof createBannerSchema>;
/** Inferred type for banner update payload. */
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
