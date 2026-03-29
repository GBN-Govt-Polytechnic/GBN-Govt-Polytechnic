/**
 * @file faculty.controller.ts
 * @description Faculty request handlers — public listing and admin CRUD with photo upload
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as facultyService from "./faculty.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateFacultyInput, UpdateFacultyInput } from "./faculty.schema";

/**
 * Retrieves all faculty members, optionally filtered by department.
 * @param req - Express request with optional departmentId query parameter.
 * @param res - Express response object.
 * @returns JSON array of faculty records with department details.
 */
export async function getAll(req: Request, res: Response) {
  const departmentId = req.query.departmentId as string | undefined;
  const faculty = await facultyService.list(departmentId);
  return apiResponse.success(res, faculty);
}

/**
 * Retrieves a single faculty member by their UUID.
 * @param req - Express request with faculty ID in params.
 * @param res - Express response object.
 * @returns JSON with faculty record including department details.
 * @throws {ApiError} 404 if faculty member not found.
 */
export async function getById(req: Request, res: Response) {
  const faculty = await facultyService.findById(req.params.id);
  return apiResponse.success(res, faculty);
}

/**
 * Creates a new faculty member with optional photo upload and logs to audit trail.
 * @param req - Express request with CreateFacultyInput body, optional photo file, and admin context.
 * @param res - Express response object.
 * @returns JSON with the newly created faculty record (201).
 */
export async function create(req: Request, res: Response) {
  const faculty = await facultyService.create(
    req.body as CreateFacultyInput,
    req.file,
  );

  auditService.log({
    action: "CREATE",
    entityType: "Faculty",
    entityId: faculty.id,
    adminId: req.user!.id,
    after: faculty,
    req,
  });

  return apiResponse.created(res, faculty);
}

/**
 * Updates an existing faculty member's details and optional photo, logs to audit trail.
 * @param req - Express request with faculty ID in params, UpdateFacultyInput body, and optional photo file.
 * @param res - Express response object.
 * @returns JSON with the updated faculty record.
 * @throws {ApiError} 404 if faculty member not found.
 */
export async function update(req: Request, res: Response) {
  const faculty = await facultyService.update(
    req.params.id,
    req.body as UpdateFacultyInput,
    req.file,
    req.user!,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "Faculty",
    entityId: faculty.id,
    adminId: req.user!.id,
    after: faculty,
    req,
  });

  return apiResponse.success(res, faculty);
}

/**
 * Permanently deletes a faculty member and their photo, logs to audit trail.
 * @param req - Express request with faculty ID in params and authenticated admin context.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 * @throws {ApiError} 404 if faculty member not found.
 */
export async function remove(req: Request, res: Response) {
  await facultyService.remove(req.params.id, req.user!);

  auditService.log({
    action: "DELETE",
    entityType: "Faculty",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
