/**
 * @file gallery.controller.ts
 * @description Gallery request handlers — album CRUD, batch image upload, and image ordering
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as galleryService from "./gallery.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";

/**
 * Retrieves all gallery albums. Public visitors see only published albums.
 * @param req - Express request with optional authenticated user context.
 * @param res - Express response object.
 * @returns JSON array of album records with image counts.
 */
export async function getAlbums(req: Request, res: Response) {
  const isPublic = !req.user;
  const albums = await galleryService.listAlbums(isPublic);
  return apiResponse.success(res, albums);
}

/**
 * Retrieves a single gallery album by UUID with all its images.
 * @param req - Express request with album ID in params.
 * @param res - Express response object.
 * @returns JSON with album record and ordered image list.
 * @throws {ApiError} 404 if album not found.
 */
export async function getAlbumById(req: Request, res: Response) {
  const album = await galleryService.findAlbumById(req.params.id);
  return apiResponse.success(res, album);
}

/**
 * Creates a new gallery album and logs the action to the audit trail.
 * @param req - Express request with CreateAlbumInput body and authenticated admin context.
 * @param res - Express response object.
 * @returns JSON with the newly created album record (201).
 */
export async function createAlbum(req: Request, res: Response) {
  const album = await galleryService.createAlbum(req.body);

  auditService.log({
    action: "CREATE",
    entityType: "GalleryAlbum",
    entityId: album.id,
    adminId: req.user!.id,
    after: album,
    req,
  });

  return apiResponse.created(res, album);
}

/**
 * Updates an existing gallery album's metadata and logs to audit trail.
 * @param req - Express request with album ID in params and UpdateAlbumInput body.
 * @param res - Express response object.
 * @returns JSON with the updated album record.
 * @throws {ApiError} 404 if album not found.
 */
export async function updateAlbum(req: Request, res: Response) {
  const album = await galleryService.updateAlbum(req.params.id, req.body);

  auditService.log({
    action: "UPDATE",
    entityType: "GalleryAlbum",
    entityId: album.id,
    adminId: req.user!.id,
    after: album,
    req,
  });

  return apiResponse.success(res, album);
}

/**
 * Permanently deletes a gallery album and all its images, logs to audit trail.
 * @param req - Express request with album ID in params and authenticated admin context.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 * @throws {ApiError} 404 if album not found.
 */
export async function deleteAlbum(req: Request, res: Response) {
  await galleryService.deleteAlbum(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "GalleryAlbum",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}

/**
 * Sets the cover image for a gallery album and logs to audit trail.
 * @param req - Express request with albumId in params and imageId in body.
 * @param res - Express response object.
 * @returns JSON with the updated album record.
 * @throws {ApiError} 404 if album or image not found.
 */
export async function setCover(req: Request, res: Response) {
  const album = await galleryService.setCover(req.params.albumId, req.body.imageId);

  auditService.log({
    action: "UPDATE",
    entityType: "GalleryAlbum",
    entityId: album.id,
    adminId: req.user!.id,
    after: { coverUrl: album.coverUrl },
    req,
  });

  return apiResponse.success(res, album);
}

/**
 * Uploads one or more images to a gallery album in batch, logs to audit trail.
 * @param req - Express request with albumId in params and image files array.
 * @param res - Express response object.
 * @returns JSON array of newly created image records (201).
 * @throws {ApiError} 404 if album not found.
 */
export async function addImages(req: Request, res: Response) {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return apiResponse.success(res, []);
  }

  const images = await galleryService.addImages(req.params.albumId, files);

  auditService.log({
    action: "CREATE",
    entityType: "GalleryImage",
    entityId: req.params.albumId,
    adminId: req.user!.id,
    after: { count: images.length },
    req,
  });

  return apiResponse.created(res, images);
}

/**
 * Deletes a single image from a gallery album and logs to audit trail.
 * @param req - Express request with imageId in params and authenticated admin context.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 * @throws {ApiError} 404 if image not found.
 */
export async function deleteImage(req: Request, res: Response) {
  await galleryService.deleteImage(req.params.imageId);

  auditService.log({
    action: "DELETE",
    entityType: "GalleryImage",
    entityId: req.params.imageId,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}

/**
 * Updates the sort order of a single gallery image.
 * @param req - Express request with imageId in params and sortOrder in body.
 * @param res - Express response object.
 * @returns JSON with the updated image record.
 * @throws {ApiError} 404 if image not found.
 */
export async function updateImageOrder(req: Request, res: Response) {
  const image = await galleryService.updateImageOrder(
    req.params.imageId,
    req.body.sortOrder,
  );

  return apiResponse.success(res, image);
}
