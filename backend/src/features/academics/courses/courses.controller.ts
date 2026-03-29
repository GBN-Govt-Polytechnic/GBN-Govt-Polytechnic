/**
 * @file courses.controller.ts
 * @description Course request handlers — delegates to courses.service and logs audit events.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as coursesService from "./courses.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateCourseInput, UpdateCourseInput, CourseQuery } from "./courses.schema";

/**
 * Lists all courses with optional filtering by department, semester, and type.
 * @param req - Express request with optional departmentId, semester, type query params.
 * @param res - Express response object.
 * @returns JSON array of course records.
 */
export async function getAll(req: Request, res: Response) {
  const courses = await coursesService.list(req.query as unknown as CourseQuery);
  return apiResponse.success(res, courses);
}

/**
 * Retrieves a single course by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON course record with department details.
 */
export async function getById(req: Request, res: Response) {
  const course = await coursesService.findById(req.params.id);
  return apiResponse.success(res, course);
}

/**
 * Creates a new course and logs the action to the audit trail.
 * @param req - Express request with CreateCourseInput body.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created course record.
 */
export async function create(req: Request, res: Response) {
  const course = await coursesService.create(req.body as CreateCourseInput);

  auditService.log({
    action: "CREATE",
    entityType: "Course",
    entityId: course.id,
    adminId: req.user!.id,
    after: course,
    req,
  });

  return apiResponse.created(res, course);
}

/**
 * Updates an existing course by ID and logs the action to the audit trail.
 * @param req - Express request with id route param and UpdateCourseInput body.
 * @param res - Express response object.
 * @returns JSON with the updated course record.
 */
export async function update(req: Request, res: Response) {
  const course = await coursesService.update(req.params.id, req.body as UpdateCourseInput, req.user!);

  auditService.log({
    action: "UPDATE",
    entityType: "Course",
    entityId: course.id,
    adminId: req.user!.id,
    after: course,
    req,
  });

  return apiResponse.success(res, course);
}

/**
 * Soft-deletes a course by ID and logs the action to the audit trail.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function remove(req: Request, res: Response) {
  await coursesService.remove(req.params.id, req.user!);

  auditService.log({
    action: "DELETE",
    entityType: "Course",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
