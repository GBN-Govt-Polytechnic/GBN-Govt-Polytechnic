/**
 * @file banners.controller.ts
 * @description Banner request handlers — delegates to banners.service and logs audit events.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as bannersService from "./banners.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateBannerInput, UpdateBannerInput } from "./banners.schema";

/**
 * Lists all banners (admin view — includes inactive).
 * @param _req - Express request (unused).
 * @param res - Express response object.
 * @returns JSON array of banner records.
 */
export async function getAll(_req: Request, res: Response) {
  const banners = await bannersService.list();
  return apiResponse.success(res, banners);
}

/**
 * Lists only currently active banners (public endpoint).
 * @param _req - Express request (unused).
 * @param res - Express response object.
 * @returns JSON array of active banner records within their scheduled dates.
 */
export async function getActive(_req: Request, res: Response) {
  const banners = await bannersService.listActive();
  return apiResponse.success(res, banners);
}

/**
 * Retrieves a single banner by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON banner record.
 */
export async function getById(req: Request, res: Response) {
  const banner = await bannersService.findById(req.params.id);
  return apiResponse.success(res, banner);
}

/**
 * Creates a new banner and logs the audit event.
 * @param req - Express request with CreateBannerInput body.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created banner record.
 */
export async function create(req: Request, res: Response) {
  const banner = await bannersService.create(req.body as CreateBannerInput);

  auditService.log({
    action: "CREATE",
    entityType: "Banner",
    entityId: banner.id,
    adminId: req.user!.id,
    after: banner,
    req,
  });

  return apiResponse.created(res, banner);
}

/**
 * Updates an existing banner and logs the audit event.
 * @param req - Express request with id route param and UpdateBannerInput body.
 * @param res - Express response object.
 * @returns JSON with the updated banner record.
 */
export async function update(req: Request, res: Response) {
  const banner = await bannersService.update(req.params.id, req.body as UpdateBannerInput);

  auditService.log({
    action: "UPDATE",
    entityType: "Banner",
    entityId: banner.id,
    adminId: req.user!.id,
    after: banner,
    req,
  });

  return apiResponse.success(res, banner);
}

/**
 * Soft-deletes a banner by ID and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function remove(req: Request, res: Response) {
  await bannersService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "Banner",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
