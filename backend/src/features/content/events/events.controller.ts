/**
 * @file events.controller.ts
 * @description Event request handlers — public listing, slug lookup, and admin CRUD with image upload
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as eventsService from "./events.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateEventInput, UpdateEventInput, EventQuery } from "./events.schema";

/**
 * Retrieves a paginated list of events with optional status filter.
 * Public visitors only see published events; authenticated users see all statuses.
 * @param req - Express request with EventQuery params (page, limit, status).
 * @param res - Express response object.
 * @returns Paginated JSON array of event records.
 */
export async function getAll(req: Request, res: Response) {
  const isPublic = !req.user;
  const { data, meta } = await eventsService.list(
    req.query as unknown as EventQuery,
    isPublic,
  );
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single published event by its URL slug.
 * @param req - Express request with slug in params.
 * @param res - Express response object.
 * @returns JSON with event record.
 * @throws {ApiError} 404 if event not found or not published.
 */
export async function getBySlug(req: Request, res: Response) {
  const event = await eventsService.findBySlug(req.params.slug);
  return apiResponse.success(res, event);
}

/**
 * Retrieves a single event by its UUID (admin use, includes drafts).
 * @param req - Express request with event ID in params.
 * @param res - Express response object.
 * @returns JSON with event record.
 * @throws {ApiError} 404 if event not found.
 */
export async function getById(req: Request, res: Response) {
  const event = await eventsService.findById(req.params.id);
  return apiResponse.success(res, event);
}

/**
 * Creates a new event with optional image upload and logs to audit trail.
 * @param req - Express request with CreateEventInput body, optional image file, and admin context.
 * @param res - Express response object.
 * @returns JSON with the newly created event record (201).
 */
export async function create(req: Request, res: Response) {
  const imageFile = req.file;

  const event = await eventsService.create(
    req.body as CreateEventInput,
    imageFile,
  );

  auditService.log({
    action: "CREATE",
    entityType: "Event",
    entityId: event.id,
    adminId: req.user!.id,
    after: event,
    req,
  });

  return apiResponse.created(res, event);
}

/**
 * Updates an existing event with optional new image, logs to audit trail.
 * @param req - Express request with event ID in params, UpdateEventInput body, and optional image file.
 * @param res - Express response object.
 * @returns JSON with the updated event record.
 * @throws {ApiError} 404 if event not found.
 */
export async function update(req: Request, res: Response) {
  const imageFile = req.file;

  const event = await eventsService.update(
    req.params.id,
    req.body as UpdateEventInput,
    imageFile,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "Event",
    entityId: event.id,
    adminId: req.user!.id,
    after: event,
    req,
  });

  return apiResponse.success(res, event);
}

/**
 * Soft-deletes an event and logs the action to the audit trail.
 * @param req - Express request with event ID in params and authenticated admin context.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 * @throws {ApiError} 404 if event not found.
 */
export async function remove(req: Request, res: Response) {
  await eventsService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "Event",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
