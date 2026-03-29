/**
 * @file results.controller.ts
 * @description Result links request handlers — delegates to results.service and logs audit events.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as resultsService from "./results.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateResultInput, UpdateResultInput, ResultQuery } from "./results.schema";

/**
 * Lists all result links with pagination and optional filtering by semester, year, or session.
 * @param req - Express request with optional query params.
 * @param res - Express response object.
 * @returns Paginated JSON array of result link records.
 */
export async function getAll(req: Request, res: Response) {
  const { data, meta } = await resultsService.list(req.query as unknown as ResultQuery);
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single result link by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON result link record with session details.
 */
export async function getById(req: Request, res: Response) {
  const result = await resultsService.findById(req.params.id);
  return apiResponse.success(res, result);
}

/**
 * Creates a new result link with optional file upload and logs the audit event.
 * @param req - Express request with CreateResultInput body and optional file.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created result link.
 */
export async function create(req: Request, res: Response) {
  const file = req.file;
  const result = await resultsService.create(req.body as CreateResultInput, file);

  auditService.log({
    action: "CREATE",
    entityType: "ResultLink",
    entityId: result.id,
    adminId: req.user!.id,
    after: result,
    req,
  });

  return apiResponse.created(res, result);
}

/**
 * Updates an existing result link with optional file replacement and logs the audit event.
 * @param req - Express request with id route param, UpdateResultInput body, and optional file.
 * @param res - Express response object.
 * @returns JSON with the updated result link record.
 */
export async function update(req: Request, res: Response) {
  const file = req.file;
  const result = await resultsService.update(
    req.params.id,
    req.body as UpdateResultInput,
    file,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "ResultLink",
    entityId: result.id,
    adminId: req.user!.id,
    after: result,
    req,
  });

  return apiResponse.success(res, result);
}

/**
 * Soft-deletes a result link by ID and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function remove(req: Request, res: Response) {
  await resultsService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "ResultLink",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
