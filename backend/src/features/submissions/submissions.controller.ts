/**
 * @file submissions.controller.ts
 * @description Submission request handlers — public contact/complaint forms and admin review.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as submissionsService from "./submissions.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type {
  CreateSubmissionInput,
  UpdateInquiryStatusInput,
  SubmissionQuery,
} from "./submissions.schema";

/**
 * Accepts a public form submission (contact or complaint).
 * @param req - Express request with CreateSubmissionInput body (type injected by route middleware).
 * @param res - Express response object.
 * @returns 201 JSON with the created submission record.
 */
export async function createSubmission(req: Request, res: Response) {
  const submission = await submissionsService.createSubmission(req.body as CreateSubmissionInput);
  return apiResponse.created(res, submission);
}

/**
 * Lists submissions with optional type/status filters for admin review.
 * @param req - Express request with optional page, limit, type, status query params.
 * @param res - Express response object.
 * @returns Paginated JSON array of submission records.
 */
export async function listSubmissions(req: Request, res: Response) {
  const { data, meta } = await submissionsService.listSubmissions(
    req.query as unknown as SubmissionQuery,
  );
  return apiResponse.paginated(res, data, meta);
}

/**
 * Updates the status of a submission and logs the audit event.
 * @param req - Express request with id route param and UpdateInquiryStatusInput body.
 * @param res - Express response object.
 * @returns JSON with the updated submission record.
 */
export async function updateSubmissionStatus(req: Request, res: Response) {
  const updated = await submissionsService.updateSubmissionStatus(
    req.params.id,
    req.body as UpdateInquiryStatusInput,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "Submission",
    entityId: updated.id,
    adminId: req.user!.id,
    after: updated,
    req,
  });

  return apiResponse.success(res, updated);
}
