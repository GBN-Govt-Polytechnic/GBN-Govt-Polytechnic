/**
 * @file labs.controller.ts
 * @description Lab request handlers — delegates to labs.service and logs audit events.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as labsService from "./labs.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateLabInput, UpdateLabInput, LabQuery } from "./labs.schema";

/**
 * Lists all labs with optional filtering by department.
 * @param req - Express request with optional departmentId query param.
 * @param res - Express response object.
 * @returns JSON array of lab records.
 */
export async function getAll(req: Request, res: Response) {
  const labs = await labsService.list(req.query as unknown as LabQuery);
  return apiResponse.success(res, labs);
}

/**
 * Retrieves a single lab by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON lab record with department details.
 */
export async function getById(req: Request, res: Response) {
  const lab = await labsService.findById(req.params.id);
  return apiResponse.success(res, lab);
}

/**
 * Creates a new lab with optional image upload and logs the action to the audit trail.
 * @param req - Express request with CreateLabInput body and optional image file.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created lab record.
 */
export async function create(req: Request, res: Response) {
  const imageFile = req.file;
  const lab = await labsService.create(req.body as CreateLabInput, imageFile);

  auditService.log({
    action: "CREATE",
    entityType: "Lab",
    entityId: lab.id,
    adminId: req.user!.id,
    after: lab,
    req,
  });

  return apiResponse.created(res, lab);
}

/**
 * Updates an existing lab by ID with optional image replacement and logs the audit event.
 * @param req - Express request with id route param, UpdateLabInput body, and optional image file.
 * @param res - Express response object.
 * @returns JSON with the updated lab record.
 */
export async function update(req: Request, res: Response) {
  const imageFile = req.file;
  const lab = await labsService.update(req.params.id, req.body as UpdateLabInput, imageFile, req.user!);

  auditService.log({
    action: "UPDATE",
    entityType: "Lab",
    entityId: lab.id,
    adminId: req.user!.id,
    after: lab,
    req,
  });

  return apiResponse.success(res, lab);
}

/**
 * Soft-deletes a lab by ID and logs the action to the audit trail.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function remove(req: Request, res: Response) {
  await labsService.remove(req.params.id, req.user!);

  auditService.log({
    action: "DELETE",
    entityType: "Lab",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
