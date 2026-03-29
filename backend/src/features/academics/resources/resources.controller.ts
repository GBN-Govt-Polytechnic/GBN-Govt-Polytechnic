/**
 * @file resources.controller.ts
 * @description Resource request handlers — study materials, lesson plans, syllabus, and timetables.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as resourcesService from "./resources.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import { ApiError } from "@/utils/api-error";
import type {
  CreateStudyMaterialInput,
  UpdateStudyMaterialInput,
  CreateLessonPlanInput,
  UpdateLessonPlanInput,
  CreateSyllabusInput,
  UpdateSyllabusInput,
  CreateTimetableInput,
  UpdateTimetableInput,
  ResourceQuery,
} from "./resources.schema";

// ---------------------------------------------------------------------------
// Study Materials
// ---------------------------------------------------------------------------

/**
 * Lists all study materials with pagination and optional filtering.
 * @param req - Express request with optional departmentId, semester, sessionId, page, limit query params.
 * @param res - Express response object.
 * @returns Paginated JSON array of study material records.
 */
export async function getAllStudyMaterials(req: Request, res: Response) {
  const { data, meta } = await resourcesService.listStudyMaterials(
    req.query as unknown as ResourceQuery,
  );
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single study material by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON study material record.
 */
export async function getStudyMaterialById(req: Request, res: Response) {
  const item = await resourcesService.findStudyMaterialById(req.params.id);
  return apiResponse.success(res, item);
}

/**
 * Creates a new study material with a required file upload and logs the audit event.
 * @param req - Express request with CreateStudyMaterialInput body and file attachment.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created study material.
 * @throws {ApiError} 400 if no file is uploaded.
 */
export async function createStudyMaterial(req: Request, res: Response) {
  if (!req.file) throw ApiError.badRequest("File is required");

  const item = await resourcesService.createStudyMaterial(
    req.body as CreateStudyMaterialInput,
    req.file,
    req.user!.id,
  );

  auditService.log({
    action: "CREATE",
    entityType: "StudyMaterial",
    entityId: item.id,
    adminId: req.user!.id,
    after: item,
    req,
  });

  return apiResponse.created(res, item);
}

/**
 * Updates an existing study material with optional file replacement and logs the audit event.
 * @param req - Express request with id route param, UpdateStudyMaterialInput body, and optional file.
 * @param res - Express response object.
 * @returns JSON with the updated study material record.
 */
export async function updateStudyMaterial(req: Request, res: Response) {
  const item = await resourcesService.updateStudyMaterial(
    req.params.id,
    req.body as UpdateStudyMaterialInput,
    req.file,
    req.user!,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "StudyMaterial",
    entityId: item.id,
    adminId: req.user!.id,
    after: item,
    req,
  });

  return apiResponse.success(res, item);
}

/**
 * Soft-deletes a study material by ID and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function removeStudyMaterial(req: Request, res: Response) {
  await resourcesService.removeStudyMaterial(req.params.id, req.user!);

  auditService.log({
    action: "DELETE",
    entityType: "StudyMaterial",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}

// ---------------------------------------------------------------------------
// Lesson Plans
// ---------------------------------------------------------------------------

/**
 * Lists all lesson plans with pagination and optional filtering.
 * @param req - Express request with optional query params.
 * @param res - Express response object.
 * @returns Paginated JSON array of lesson plan records.
 */
export async function getAllLessonPlans(req: Request, res: Response) {
  const { data, meta } = await resourcesService.listLessonPlans(
    req.query as unknown as ResourceQuery,
  );
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single lesson plan by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON lesson plan record.
 */
export async function getLessonPlanById(req: Request, res: Response) {
  const item = await resourcesService.findLessonPlanById(req.params.id);
  return apiResponse.success(res, item);
}

/**
 * Creates a new lesson plan with a required file upload and logs the audit event.
 * @param req - Express request with CreateLessonPlanInput body and file attachment.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created lesson plan.
 * @throws {ApiError} 400 if no file is uploaded.
 */
export async function createLessonPlan(req: Request, res: Response) {
  if (!req.file) throw ApiError.badRequest("File is required");

  const item = await resourcesService.createLessonPlan(
    req.body as CreateLessonPlanInput,
    req.file,
  );

  auditService.log({
    action: "CREATE",
    entityType: "LessonPlan",
    entityId: item.id,
    adminId: req.user!.id,
    after: item,
    req,
  });

  return apiResponse.created(res, item);
}

/**
 * Updates an existing lesson plan with optional file replacement and logs the audit event.
 * @param req - Express request with id route param, UpdateLessonPlanInput body, and optional file.
 * @param res - Express response object.
 * @returns JSON with the updated lesson plan record.
 */
export async function updateLessonPlan(req: Request, res: Response) {
  const item = await resourcesService.updateLessonPlan(
    req.params.id,
    req.body as UpdateLessonPlanInput,
    req.file,
    req.user!,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "LessonPlan",
    entityId: item.id,
    adminId: req.user!.id,
    after: item,
    req,
  });

  return apiResponse.success(res, item);
}

/**
 * Soft-deletes a lesson plan by ID and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function removeLessonPlan(req: Request, res: Response) {
  await resourcesService.removeLessonPlan(req.params.id, req.user!);

  auditService.log({
    action: "DELETE",
    entityType: "LessonPlan",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}

// ---------------------------------------------------------------------------
// Syllabus
// ---------------------------------------------------------------------------

/**
 * Lists all syllabus records with pagination and optional filtering.
 * @param req - Express request with optional query params.
 * @param res - Express response object.
 * @returns Paginated JSON array of syllabus records.
 */
export async function getAllSyllabus(req: Request, res: Response) {
  const { data, meta } = await resourcesService.listSyllabus(
    req.query as unknown as ResourceQuery,
  );
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single syllabus by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON syllabus record.
 */
export async function getSyllabusById(req: Request, res: Response) {
  const item = await resourcesService.findSyllabusById(req.params.id);
  return apiResponse.success(res, item);
}

/**
 * Creates a new syllabus with a required file upload and logs the audit event.
 * @param req - Express request with CreateSyllabusInput body and file attachment.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created syllabus.
 * @throws {ApiError} 400 if no file is uploaded.
 */
export async function createSyllabus(req: Request, res: Response) {
  if (!req.file) throw ApiError.badRequest("File is required");

  const item = await resourcesService.createSyllabus(
    req.body as CreateSyllabusInput,
    req.file,
  );

  auditService.log({
    action: "CREATE",
    entityType: "Syllabus",
    entityId: item.id,
    adminId: req.user!.id,
    after: item,
    req,
  });

  return apiResponse.created(res, item);
}

/**
 * Updates an existing syllabus with optional file replacement and logs the audit event.
 * @param req - Express request with id route param, UpdateSyllabusInput body, and optional file.
 * @param res - Express response object.
 * @returns JSON with the updated syllabus record.
 */
export async function updateSyllabus(req: Request, res: Response) {
  const item = await resourcesService.updateSyllabus(
    req.params.id,
    req.body as UpdateSyllabusInput,
    req.file,
    req.user!,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "Syllabus",
    entityId: item.id,
    adminId: req.user!.id,
    after: item,
    req,
  });

  return apiResponse.success(res, item);
}

/**
 * Soft-deletes a syllabus by ID and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function removeSyllabus(req: Request, res: Response) {
  await resourcesService.removeSyllabus(req.params.id, req.user!);

  auditService.log({
    action: "DELETE",
    entityType: "Syllabus",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}

// ---------------------------------------------------------------------------
// Timetables
// ---------------------------------------------------------------------------

/**
 * Lists all timetables with pagination and optional filtering.
 * @param req - Express request with optional query params.
 * @param res - Express response object.
 * @returns Paginated JSON array of timetable records.
 */
export async function getAllTimetables(req: Request, res: Response) {
  const { data, meta } = await resourcesService.listTimetables(
    req.query as unknown as ResourceQuery,
  );
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single timetable by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON timetable record.
 */
export async function getTimetableById(req: Request, res: Response) {
  const item = await resourcesService.findTimetableById(req.params.id);
  return apiResponse.success(res, item);
}

/**
 * Creates a new timetable with a required file upload and logs the audit event.
 * @param req - Express request with CreateTimetableInput body and file attachment.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created timetable.
 * @throws {ApiError} 400 if no file is uploaded.
 */
export async function createTimetable(req: Request, res: Response) {
  if (!req.file) throw ApiError.badRequest("File is required");

  const item = await resourcesService.createTimetable(
    req.body as CreateTimetableInput,
    req.file,
  );

  auditService.log({
    action: "CREATE",
    entityType: "Timetable",
    entityId: item.id,
    adminId: req.user!.id,
    after: item,
    req,
  });

  return apiResponse.created(res, item);
}

/**
 * Updates an existing timetable with optional file replacement and logs the audit event.
 * @param req - Express request with id route param, UpdateTimetableInput body, and optional file.
 * @param res - Express response object.
 * @returns JSON with the updated timetable record.
 */
export async function updateTimetable(req: Request, res: Response) {
  const item = await resourcesService.updateTimetable(
    req.params.id,
    req.body as UpdateTimetableInput,
    req.file,
    req.user!,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "Timetable",
    entityId: item.id,
    adminId: req.user!.id,
    after: item,
    req,
  });

  return apiResponse.success(res, item);
}

/**
 * Soft-deletes a timetable by ID and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function removeTimetable(req: Request, res: Response) {
  await resourcesService.removeTimetable(req.params.id, req.user!);

  auditService.log({
    action: "DELETE",
    entityType: "Timetable",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
