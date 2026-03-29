/**
 * @file mous.controller.ts
 * @description MoU (Memorandum of Understanding) request handlers — delegates to mous.service and logs audit events.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as mousService from "./mous.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateMoUInput, UpdateMoUInput } from "./mous.schema";

/**
 * Lists all active MoUs.
 * @param _req - Express request (unused).
 * @param res - Express response object.
 * @returns JSON array of MoU records.
 */
export async function getAll(_req: Request, res: Response) {
  const mous = await mousService.list();
  return apiResponse.success(res, mous);
}

/**
 * Retrieves a single MoU by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON MoU record.
 */
export async function getById(req: Request, res: Response) {
  const mou = await mousService.findById(req.params.id);
  return apiResponse.success(res, mou);
}

/**
 * Creates a new MoU with optional document upload and logs the audit event.
 * @param req - Express request with CreateMoUInput body and optional document file.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created MoU record.
 */
export async function create(req: Request, res: Response) {
  const file = req.file;
  const mou = await mousService.create(req.body as CreateMoUInput, file);

  auditService.log({
    action: "CREATE",
    entityType: "MoU",
    entityId: mou.id,
    adminId: req.user!.id,
    after: mou,
    req,
  });

  return apiResponse.created(res, mou);
}

/**
 * Updates an existing MoU with optional document replacement and logs the audit event.
 * @param req - Express request with id route param, UpdateMoUInput body, and optional document file.
 * @param res - Express response object.
 * @returns JSON with the updated MoU record.
 */
export async function update(req: Request, res: Response) {
  const file = req.file;
  const mou = await mousService.update(req.params.id, req.body as UpdateMoUInput, file);

  auditService.log({
    action: "UPDATE",
    entityType: "MoU",
    entityId: mou.id,
    adminId: req.user!.id,
    after: mou,
    req,
  });

  return apiResponse.success(res, mou);
}

/**
 * Soft-deletes a MoU by ID and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function remove(req: Request, res: Response) {
  await mousService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "MoU",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
