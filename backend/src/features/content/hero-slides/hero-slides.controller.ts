/**
 * @file hero-slides.controller.ts
 * @description Hero slide request handlers — homepage carousel CRUD with image upload
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as heroSlidesService from "./hero-slides.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import { ApiError } from "@/utils/api-error";
import type { CreateHeroSlideInput, UpdateHeroSlideInput } from "./hero-slides.schema";

/**
 * Retrieves all active hero slides sorted by display order.
 * @param _req - Express request object (unused).
 * @param res - Express response object.
 * @returns JSON array of active hero slide records.
 */
export async function getAll(_req: Request, res: Response) {
  const slides = await heroSlidesService.list();
  return apiResponse.success(res, slides);
}

/**
 * Retrieves a single hero slide by its UUID.
 * @param req - Express request with slide ID in params.
 * @param res - Express response object.
 * @returns JSON with hero slide record.
 * @throws {ApiError} 404 if hero slide not found.
 */
export async function getById(req: Request, res: Response) {
  const slide = await heroSlidesService.findById(req.params.id);
  return apiResponse.success(res, slide);
}

/**
 * Creates a new hero slide with a required image upload and logs to audit trail.
 * @param req - Express request with CreateHeroSlideInput body, required image file, and admin context.
 * @param res - Express response object.
 * @returns JSON with the newly created hero slide record (201).
 * @throws {ApiError} 400 if no image file is provided.
 */
export async function create(req: Request, res: Response) {
  if (!req.file) {
    throw ApiError.badRequest("Image is required");
  }

  const slide = await heroSlidesService.create(
    req.body as CreateHeroSlideInput,
    req.file,
  );

  auditService.log({
    action: "CREATE",
    entityType: "HeroSlide",
    entityId: slide.id,
    adminId: req.user!.id,
    after: slide,
    req,
  });

  return apiResponse.created(res, slide);
}

/**
 * Updates an existing hero slide's details and optional image replacement, logs to audit trail.
 * @param req - Express request with slide ID in params, UpdateHeroSlideInput body, and optional image file.
 * @param res - Express response object.
 * @returns JSON with the updated hero slide record.
 * @throws {ApiError} 404 if hero slide not found.
 */
export async function update(req: Request, res: Response) {
  const slide = await heroSlidesService.update(
    req.params.id,
    req.body as UpdateHeroSlideInput,
    req.file,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "HeroSlide",
    entityId: slide.id,
    adminId: req.user!.id,
    after: slide,
    req,
  });

  return apiResponse.success(res, slide);
}

/**
 * Soft-deletes a hero slide and logs the action to the audit trail.
 * @param req - Express request with slide ID in params and authenticated admin context.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 * @throws {ApiError} 404 if hero slide not found.
 */
export async function remove(req: Request, res: Response) {
  await heroSlidesService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "HeroSlide",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
