/**
 * @file gallery.service.ts
 * @description Gallery business logic — album management, batch image upload, ordering, and MinIO integration
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { generateUniqueSlug } from "@/utils/slug";
import * as storageService from "@/services/storage.service";
import type { CreateAlbumInput, UpdateAlbumInput } from "./gallery.schema";

// ---------------------------------------------------------------------------
// Albums
// ---------------------------------------------------------------------------

/**
 * Lists all gallery albums with image counts, optionally filtered to published only.
 * @param isPublic - If true, only published albums are returned.
 * @returns Array of album records with image count.
 */
export async function listAlbums(isPublic = false) {
  const where: Record<string, unknown> = {};

  if (isPublic) {
    where.isPublished = true;
  }

  where.deletedAt = null;

  const albums = await prisma.galleryAlbum.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { images: true } },
    },
  });

  return albums;
}

/**
 * Finds a gallery album by UUID with all images sorted by display order.
 * @param id - UUID of the album.
 * @returns Album record with ordered image list.
 * @throws {ApiError} 404 if album not found.
 */
export async function findAlbumById(id: string) {
  const album = await prisma.galleryAlbum.findFirst({
    where: { id, deletedAt: null },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!album) throw ApiError.notFound("Album not found");
  return album;
}

/**
 * Creates a new gallery album with an auto-generated unique slug.
 * @param data - Album creation data (title, optional description, publish status).
 * @returns The newly created album record.
 */
export async function createAlbum(data: CreateAlbumInput) {
  const slug = await generateUniqueSlug(data.title, "galleryAlbum");

  const album = await prisma.galleryAlbum.create({
    data: {
      ...data,
      slug,
    },
  });

  return album;
}

/**
 * Updates a gallery album's metadata with slug regeneration on title change.
 * @param id - UUID of the album to update.
 * @param data - Partial update data for the album.
 * @returns The updated album record.
 * @throws {ApiError} 404 if album not found.
 */
export async function updateAlbum(id: string, data: UpdateAlbumInput) {
  const existing = await prisma.galleryAlbum.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("Album not found");

  let slugData = {};
  if (data.title && data.title !== existing.title) {
    slugData = { slug: await generateUniqueSlug(data.title, "galleryAlbum") };
  }

  const album = await prisma.galleryAlbum.update({
    where: { id },
    data: {
      ...data,
      ...slugData,
    },
  });

  return album;
}

/**
 * Permanently deletes a gallery album and all its associated images.
 * @param id - UUID of the album to delete.
 * @throws {ApiError} 404 if album not found.
 */
export async function deleteAlbum(id: string) {
  const existing = await prisma.galleryAlbum.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound("Album not found");

  await prisma.galleryAlbum.delete({ where: { id } });
}

/**
 * Sets the cover image for a gallery album using an existing image's URL.
 * @param albumId - UUID of the album.
 * @param imageId - UUID of the image to use as cover.
 * @returns The updated album record.
 * @throws {ApiError} 404 if album not found or image not in album.
 */
export async function setCover(albumId: string, imageId: string) {
  const album = await prisma.galleryAlbum.findFirst({ where: { id: albumId, deletedAt: null } });
  if (!album) throw ApiError.notFound("Album not found");

  const image = await prisma.galleryImage.findUnique({ where: { id: imageId } });
  if (!image || image.albumId !== albumId) throw ApiError.notFound("Image not found in this album");

  const updated = await prisma.galleryAlbum.update({
    where: { id: albumId },
    data: { coverUrl: image.imageUrl },
  });

  return updated;
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

/**
 * Uploads multiple images to a gallery album with automatic sort ordering.
 * Sets the album cover to the first image if no cover exists.
 * @param albumId - UUID of the target album.
 * @param files - Array of uploaded image files.
 * @returns Array of newly created gallery image records.
 * @throws {ApiError} 404 if album not found.
 */
export async function addImages(albumId: string, files: Express.Multer.File[]) {
  const album = await prisma.galleryAlbum.findFirst({ where: { id: albumId, deletedAt: null } });
  if (!album) throw ApiError.notFound("Album not found");

  // Get current max sortOrder
  const lastImage = await prisma.galleryImage.findFirst({
    where: { albumId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  let nextOrder = (lastImage?.sortOrder ?? -1) + 1;

  const images = [];
  for (const file of files) {
    const result = await storageService.upload(file, "gallery");
    const image = await prisma.galleryImage.create({
      data: {
        albumId,
        imageUrl: result.url,
        imageFileName: result.fileName,
        imageFileSize: result.fileSize,
        imageMimeType: result.mimeType,
        sortOrder: nextOrder++,
      },
    });
    images.push(image);
  }

  // Update album cover to the first image if none set
  if (!album.coverUrl && images.length > 0) {
    await prisma.galleryAlbum.update({
      where: { id: albumId },
      data: { coverUrl: images[0].imageUrl },
    });
  }

  return images;
}

/**
 * Permanently deletes a single gallery image.
 * @param imageId - UUID of the image to delete.
 * @throws {ApiError} 404 if image not found.
 */
export async function deleteImage(imageId: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id: imageId } });
  if (!image) throw ApiError.notFound("Image not found");

  await prisma.galleryImage.delete({ where: { id: imageId } });
}

/**
 * Updates the display sort order of a gallery image.
 * @param imageId - UUID of the image to reorder.
 * @param sortOrder - New sort position (0-based).
 * @returns The updated image record.
 * @throws {ApiError} 404 if image not found.
 */
export async function updateImageOrder(imageId: string, sortOrder: number) {
  const image = await prisma.galleryImage.findUnique({ where: { id: imageId } });
  if (!image) throw ApiError.notFound("Image not found");

  const updated = await prisma.galleryImage.update({
    where: { id: imageId },
    data: { sortOrder },
  });

  return updated;
}
