/**
 * @file departments.controller.ts
 * @description Department request handlers — public listing and admin CRUD operations
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as departmentsService from "./departments.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import { checkDepartmentAccess } from "@/middleware/department-scope";
import type { CreateDepartmentInput, UpdateDepartmentInput } from "./departments.schema";

/**
 * Retrieves all active departments with faculty, student, and course counts.
 * @param _req - Express request object (unused).
 * @param res - Express response object.
 * @returns JSON array of department records sorted alphabetically.
 */
export async function getAll(_req: Request, res: Response) {
  const departments = await departmentsService.list();
  return apiResponse.success(res, departments);
}

/**
 * Retrieves a single department by its URL slug.
 * @param req - Express request with slug in params.
 * @param res - Express response object.
 * @returns JSON with department record including relation counts.
 * @throws {ApiError} 404 if department not found.
 */
export async function getBySlug(req: Request, res: Response) {
  const department = await departmentsService.findBySlug(req.params.slug);
  return apiResponse.success(res, department);
}

/**
 * Creates a new department and logs the action to the audit trail.
 * @param req - Express request with CreateDepartmentInput body and authenticated admin context.
 * @param res - Express response object.
 * @returns JSON with the newly created department record (201).
 * @throws {ApiError} 409 if department slug or code already exists.
 */
export async function create(req: Request, res: Response) {
  const department = await departmentsService.create(req.body as CreateDepartmentInput);

  auditService.log({
    action: "CREATE",
    entityType: "Department",
    entityId: department.id,
    adminId: req.user!.id,
    after: department,
    req,
  });

  return apiResponse.created(res, department);
}

/**
 * Updates an existing department and logs the action to the audit trail.
 * @param req - Express request with department ID in params and UpdateDepartmentInput body.
 * @param res - Express response object.
 * @returns JSON with the updated department record.
 * @throws {ApiError} 404 if department not found.
 * @throws {ApiError} 409 if updated slug or code conflicts with an existing department.
 */
export async function update(req: Request, res: Response) {
  const existingDepartment = await departmentsService.findById(req.params.id);

  // HOD and department-scoped users can only edit their own department
  checkDepartmentAccess(req.user!, existingDepartment.id);

  const department = await departmentsService.update(req.params.id, req.body as UpdateDepartmentInput);

  auditService.log({
    action: "UPDATE",
    entityType: "Department",
    entityId: department.id,
    adminId: req.user!.id,
    after: department,
    req,
  });

  return apiResponse.success(res, department);
}

/**
 * Permanently deletes a department and logs the action to the audit trail.
 * @param req - Express request with department ID in params and authenticated admin context.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 * @throws {ApiError} 404 if department not found.
 */
export async function remove(req: Request, res: Response) {
  await departmentsService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "Department",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
