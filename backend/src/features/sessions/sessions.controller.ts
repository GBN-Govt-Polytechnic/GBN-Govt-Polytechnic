/**
 * @file sessions.controller.ts
 * @description Academic session request handlers — delegates to sessions.service and logs audit events.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as sessionsService from "./sessions.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateSessionInput, UpdateSessionInput } from "./sessions.schema";

/**
 * Lists all academic sessions ordered by name descending.
 * @param _req - Express request (unused).
 * @param res - Express response object.
 * @returns JSON array of academic session records.
 */
export async function getAll(_req: Request, res: Response) {
  const sessions = await sessionsService.list();
  return apiResponse.success(res, sessions);
}

/**
 * Creates a new academic session and logs the audit event.
 * @param req - Express request with CreateSessionInput body.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created session record.
 */
export async function create(req: Request, res: Response) {
  const session = await sessionsService.create(req.body as CreateSessionInput);

  auditService.log({
    action: "CREATE",
    entityType: "AcademicSession",
    entityId: session.id,
    adminId: req.user!.id,
    after: session,
    req,
  });

  return apiResponse.created(res, session);
}

/**
 * Updates an existing academic session and logs the audit event.
 * @param req - Express request with id route param and UpdateSessionInput body.
 * @param res - Express response object.
 * @returns JSON with the updated session record.
 */
export async function update(req: Request, res: Response) {
  const session = await sessionsService.update(
    req.params.id,
    req.body as UpdateSessionInput,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "AcademicSession",
    entityId: session.id,
    adminId: req.user!.id,
    after: session,
    req,
  });

  return apiResponse.success(res, session);
}

/**
 * Permanently deletes an academic session and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function remove(req: Request, res: Response) {
  await sessionsService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "AcademicSession",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
