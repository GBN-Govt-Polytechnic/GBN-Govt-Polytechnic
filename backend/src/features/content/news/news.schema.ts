/**
 * @file news.schema.ts
 * @description Zod schemas for news and notices requests — create, update, query, and ID validation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";
import { CONTENT_STATUSES, NEWS_CATEGORIES } from "@/config/constants";

/** Zod schema for creating a news item — validates title, content, category, status, and optional fields. */
export const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  category: z.enum(NEWS_CATEGORIES),
  status: z.enum(CONTENT_STATUSES).default("PUBLISHED"),
  publishDate: z.coerce.date().optional(),
  isPinned: z.boolean().default(false),
});

/** Zod schema for updating a news item — all fields optional for partial updates. */
export const updateNewsSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional().nullable(),
  category: z.enum(NEWS_CATEGORIES).optional(),
  status: z.enum(CONTENT_STATUSES).optional(),
  publishDate: z.coerce.date().optional().nullable(),
  isPinned: z.boolean().optional(),
});

/** Zod schema for news list query parameters — pagination, category, status, and search filters. */
export const newsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  category: z.enum(NEWS_CATEGORIES).optional(),
  status: z.enum(CONTENT_STATUSES).optional(),
  search: z.string().optional(),
});

/** Zod schema for validating news ID route parameter as a UUID. */
export const newsIdParam = z.object({
  id: z.string().uuid(),
});

/** Inferred TypeScript type for news creation payload. */
export type CreateNewsInput = z.infer<typeof createNewsSchema>;

/** Inferred TypeScript type for news update payload. */
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;

/** Inferred TypeScript type for news list query parameters. */
export type NewsQuery = z.infer<typeof newsQuerySchema>;
