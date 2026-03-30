/**
 * @file slug.ts
 * @description Slug generation utility with database collision handling.
 *              Converts text to URL-friendly slugs and ensures uniqueness by
 *              appending numeric suffixes when duplicates exist.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";

/**
 * Converts a text string into a URL-friendly slug.
 * Lowercases, strips special characters, and replaces whitespace with hyphens.
 * @param text - The input text to slugify.
 * @returns A URL-safe slug string.
 * @example
 * slugify("Hello World!") // "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generates a unique slug for the given Prisma model by checking for existing
 * records and appending a numeric suffix if needed.
 * @param text - The input text to derive the slug from.
 * @param model - The Prisma model name to check for slug uniqueness.
 * @returns A unique slug string that does not exist in the target model's table.
 */
export async function generateUniqueSlug(
  text: string,
  model: "newsNotice" | "event" | "galleryAlbum",
): Promise<string> {
  const base = slugify(text);
  let slug = base;
  let counter = 1;

  while (true) {
    // Check ALL records including soft-deleted ones, since the DB unique
    // constraint covers all rows. The soft-delete middleware sets
    // `deletedAt: args.where?.deletedAt ?? null` — passing a non-nullish
    // object prevents the override.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic Prisma model access
    const existing = await (prisma[model] as any).findFirst({
      where: { slug, deletedAt: { not: new Date(0) } },
      select: { id: true },
    });
    if (!existing) return slug;
    counter++;
    slug = `${base}-${counter}`;
  }
}
