/**
 * @file placements.controller.ts
 * @description Placement request handlers — companies, stats, and activities with audit logging.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as placementsService from "./placements.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  UpsertStatInput,
  StatQuery,
  CreateActivityInput,
  UpdateActivityInput,
  ActivityQuery,
} from "./placements.schema";

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

/**
 * Lists all placement companies.
 * @param _req - Express request (unused).
 * @param res - Express response object.
 * @returns JSON array of company records.
 */
export async function getAllCompanies(_req: Request, res: Response) {
  const companies = await placementsService.listCompanies();
  return apiResponse.success(res, companies);
}

/**
 * Retrieves a single placement company by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON company record.
 */
export async function getCompanyById(req: Request, res: Response) {
  const company = await placementsService.findCompanyById(req.params.id);
  return apiResponse.success(res, company);
}

/**
 * Creates a new placement company and logs the audit event.
 * @param req - Express request with CreateCompanyInput body.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created company record.
 */
export async function createCompany(req: Request, res: Response) {
  const company = await placementsService.createCompany(req.body as CreateCompanyInput);

  auditService.log({
    action: "CREATE",
    entityType: "PlacementCompany",
    entityId: company.id,
    adminId: req.user!.id,
    after: company,
    req,
  });

  return apiResponse.created(res, company);
}

/**
 * Updates an existing placement company and logs the audit event.
 * @param req - Express request with id route param and UpdateCompanyInput body.
 * @param res - Express response object.
 * @returns JSON with the updated company record.
 */
export async function updateCompany(req: Request, res: Response) {
  const company = await placementsService.updateCompany(
    req.params.id,
    req.body as UpdateCompanyInput,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "PlacementCompany",
    entityId: company.id,
    adminId: req.user!.id,
    after: company,
    req,
  });

  return apiResponse.success(res, company);
}

/**
 * Soft-deletes a placement company and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function removeCompany(req: Request, res: Response) {
  await placementsService.removeCompany(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "PlacementCompany",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

/**
 * Lists placement statistics with optional session filtering.
 * @param req - Express request with optional sessionId query param.
 * @param res - Express response object.
 * @returns JSON array of placement stat records.
 */
export async function getAllStats(req: Request, res: Response) {
  const stats = await placementsService.listStats(req.query as unknown as StatQuery);
  return apiResponse.success(res, stats);
}

/**
 * Creates or updates a placement stat record (upsert by department + session) and logs the audit event.
 * @param req - Express request with UpsertStatInput body.
 * @param res - Express response object.
 * @returns JSON with the upserted placement stat record.
 */
export async function upsertStat(req: Request, res: Response) {
  const stat = await placementsService.upsertStat(req.body as UpsertStatInput);

  auditService.log({
    action: "UPDATE",
    entityType: "PlacementStat",
    entityId: stat.id,
    adminId: req.user!.id,
    after: stat,
    req,
  });

  return apiResponse.success(res, stat);
}

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

/**
 * Lists placement activities with pagination and optional filtering.
 * @param req - Express request with optional sessionId, type, departmentId, page, limit query params.
 * @param res - Express response object.
 * @returns Paginated JSON array of placement activity records.
 */
export async function getAllActivities(req: Request, res: Response) {
  const { data, meta } = await placementsService.listActivities(
    req.query as unknown as ActivityQuery,
  );
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single placement activity by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON placement activity record with company/department/session details.
 */
export async function getActivityById(req: Request, res: Response) {
  const activity = await placementsService.findActivityById(req.params.id);
  return apiResponse.success(res, activity);
}

/**
 * Creates a new placement activity with optional image upload and logs the audit event.
 * @param req - Express request with CreateActivityInput body and optional image file.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created activity record.
 */
export async function createActivity(req: Request, res: Response) {
  const activity = await placementsService.createActivity(
    req.body as CreateActivityInput,
    req.file,
  );

  auditService.log({
    action: "CREATE",
    entityType: "PlacementActivity",
    entityId: activity.id,
    adminId: req.user!.id,
    after: activity,
    req,
  });

  return apiResponse.created(res, activity);
}

/**
 * Updates an existing placement activity with optional image replacement and logs the audit event.
 * @param req - Express request with id route param, UpdateActivityInput body, and optional image.
 * @param res - Express response object.
 * @returns JSON with the updated activity record.
 */
export async function updateActivity(req: Request, res: Response) {
  const activity = await placementsService.updateActivity(
    req.params.id,
    req.body as UpdateActivityInput,
    req.file,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "PlacementActivity",
    entityId: activity.id,
    adminId: req.user!.id,
    after: activity,
    req,
  });

  return apiResponse.success(res, activity);
}

/**
 * Soft-deletes a placement activity and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function removeActivity(req: Request, res: Response) {
  await placementsService.removeActivity(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "PlacementActivity",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
