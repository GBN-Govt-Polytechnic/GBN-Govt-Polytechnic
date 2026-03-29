/**
 * @file achievements.controller.ts
 * @description Achievement request handlers — delegates to achievements.service and logs audit events.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as achievementsService from "./achievements.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateAchievementInput, UpdateAchievementInput } from "./achievements.schema";

/**
 * Lists all achievements ordered by date descending.
 * @param _req - Express request (unused).
 * @param res - Express response object.
 * @returns JSON array of achievement records.
 */
export async function getAll(_req: Request, res: Response) {
  const achievements = await achievementsService.list();
  return apiResponse.success(res, achievements);
}

/**
 * Retrieves a single achievement by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON achievement record.
 */
export async function getById(req: Request, res: Response) {
  const achievement = await achievementsService.findById(req.params.id);
  return apiResponse.success(res, achievement);
}

/**
 * Creates a new achievement with optional image upload and logs the audit event.
 * @param req - Express request with CreateAchievementInput body and optional image file.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created achievement record.
 */
export async function create(req: Request, res: Response) {
  const file = req.file;
  const achievement = await achievementsService.create(
    req.body as CreateAchievementInput,
    file,
  );

  auditService.log({
    action: "CREATE",
    entityType: "Achievement",
    entityId: achievement.id,
    adminId: req.user!.id,
    after: achievement,
    req,
  });

  return apiResponse.created(res, achievement);
}

/**
 * Updates an existing achievement with optional image replacement and logs the audit event.
 * @param req - Express request with id route param, UpdateAchievementInput body, and optional image.
 * @param res - Express response object.
 * @returns JSON with the updated achievement record.
 */
export async function update(req: Request, res: Response) {
  const file = req.file;
  const achievement = await achievementsService.update(
    req.params.id,
    req.body as UpdateAchievementInput,
    file,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "Achievement",
    entityId: achievement.id,
    adminId: req.user!.id,
    after: achievement,
    req,
  });

  return apiResponse.success(res, achievement);
}

/**
 * Soft-deletes an achievement by ID and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function remove(req: Request, res: Response) {
  await achievementsService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "Achievement",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
