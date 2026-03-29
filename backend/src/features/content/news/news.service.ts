/**
 * @file news.service.ts
 * @description News and notices business logic — covers news, notices, circulars, and tenders with file uploads
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import { generateUniqueSlug } from "@/utils/slug";
import * as storageService from "@/services/storage.service";
import type { CreateNewsInput, UpdateNewsInput, NewsQuery } from "./news.schema";

/**
 * Retrieves a paginated list of news items with filtering by category, status, and search text.
 * Public mode restricts results to published items only.
 * @param query - Query parameters (page, limit, category, status, search).
 * @param isPublic - If true, only published items are returned.
 * @returns Object containing data array and pagination meta.
 */
export async function list(query: NewsQuery, isPublic = false) {
  const { skip, take, page, limit } = parsePagination(query);
  const where: Record<string, unknown> = { deletedAt: null };

  if (isPublic) {
    where.status = "PUBLISHED";
  } else if (query.status) {
    where.status = query.status;
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { content: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.newsNotice.findMany({
      where,
      skip,
      take,
      orderBy: [{ isPinned: "desc" }, { publishDate: "desc" }],
    }),
    prisma.newsNotice.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Finds a news item by UUID, excluding soft-deleted records.
 * @param id - UUID of the news item.
 * @returns News record.
 * @throws {ApiError} 404 if news item not found.
 */
export async function findById(id: string) {
  const news = await prisma.newsNotice.findFirst({
    where: { id, deletedAt: null },
  });
  if (!news) throw ApiError.notFound("News item not found");
  return news;
}

/**
 * Finds a published news item by its URL slug.
 * @param slug - URL-friendly slug of the news item.
 * @returns Published news record.
 * @throws {ApiError} 404 if news item not found or not published.
 */
export async function findBySlug(slug: string) {
  const news = await prisma.newsNotice.findFirst({
    where: { slug, deletedAt: null, status: "PUBLISHED" },
  });
  if (!news) throw ApiError.notFound("News item not found");
  return news;
}

/**
 * Creates a new news item with auto-generated slug and optional image/attachment uploads.
 * @param data - News creation data (title, content, category, status, etc.).
 * @param imageFile - Optional cover image file.
 * @param attachmentFile - Optional attachment file (PDF, document, etc.).
 * @returns The newly created news record.
 */
export async function create(
  data: CreateNewsInput,
  imageFile?: Express.Multer.File,
  attachmentFile?: Express.Multer.File,
) {
  const slug = await generateUniqueSlug(data.title, "newsNotice");

  let imageData = {};
  if (imageFile) {
    const result = await storageService.upload(imageFile, "news/images");
    imageData = {
      imageUrl: result.url,
      imageFileName: result.fileName,
      imageFileSize: result.fileSize,
      imageMimeType: result.mimeType,
    };
  }

  let attachmentData = {};
  if (attachmentFile) {
    const result = await storageService.upload(attachmentFile, "news/attachments");
    attachmentData = {
      attachmentUrl: result.url,
      attachmentFileName: result.fileName,
      attachmentFileSize: result.fileSize,
      attachmentMimeType: result.mimeType,
    };
  }

  const news = await prisma.newsNotice.create({
    data: {
      ...data,
      slug,
      ...imageData,
      ...attachmentData,
    },
  });

  return news;
}

/**
 * Updates an existing news item with optional new image/attachment and slug regeneration on title change.
 * @param id - UUID of the news item to update.
 * @param data - Partial update data for the news item.
 * @param imageFile - Optional new cover image to replace the existing one.
 * @param attachmentFile - Optional new attachment to replace the existing one.
 * @returns The updated news record.
 * @throws {ApiError} 404 if news item not found.
 */
export async function update(
  id: string,
  data: UpdateNewsInput,
  imageFile?: Express.Multer.File,
  attachmentFile?: Express.Multer.File,
) {
  const existing = await prisma.newsNotice.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("News item not found");

  let imageData = {};
  if (imageFile) {
    const result = await storageService.upload(imageFile, "news/images");
    imageData = {
      imageUrl: result.url,
      imageFileName: result.fileName,
      imageFileSize: result.fileSize,
      imageMimeType: result.mimeType,
    };
  }

  let attachmentData = {};
  if (attachmentFile) {
    const result = await storageService.upload(attachmentFile, "news/attachments");
    attachmentData = {
      attachmentUrl: result.url,
      attachmentFileName: result.fileName,
      attachmentFileSize: result.fileSize,
      attachmentMimeType: result.mimeType,
    };
  }

  let slugData = {};
  if (data.title && data.title !== existing.title) {
    slugData = { slug: await generateUniqueSlug(data.title, "newsNotice") };
  }

  const news = await prisma.newsNotice.update({
    where: { id },
    data: {
      ...data,
      ...slugData,
      ...imageData,
      ...attachmentData,
    },
  });

  return news;
}

/**
 * Soft-deletes a news item by setting its deletedAt timestamp.
 * @param id - UUID of the news item to soft-delete.
 * @throws {ApiError} 404 if news item not found.
 */
export async function remove(id: string) {
  const existing = await prisma.newsNotice.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw ApiError.notFound("News item not found");

  await prisma.newsNotice.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
