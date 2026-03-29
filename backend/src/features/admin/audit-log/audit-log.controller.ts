/**
 * @file audit-log.controller.ts
 * @description Audit log request handlers — admin-only paginated log viewer.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as auditLogService from "./audit-log.service";
import * as apiResponse from "@/utils/api-response";

/**
 * Lists audit log entries with pagination and optional filtering by action, entityType, adminId, and date range.
 * @param req - Express request with optional query params for filtering and pagination.
 * @param res - Express response object.
 * @returns Paginated JSON array of audit log entries with admin details.
 */
export async function getAll(req: Request, res: Response) {
  const { data, meta } = await auditLogService.list(
    req.query as Record<string, string>,
  );
  return apiResponse.paginated(res, data, meta);
}
