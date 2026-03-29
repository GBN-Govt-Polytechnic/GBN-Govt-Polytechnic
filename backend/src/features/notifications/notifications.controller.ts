/**
 * @file notifications.controller.ts
 * @description Notification request handlers — admin create, list, detail, and delete.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as notificationsService from "./notifications.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateNotificationInput, NotificationQuery } from "./notifications.schema";

/**
 * Lists all notifications with pagination.
 * @param req - Express request with optional page, limit query params.
 * @param res - Express response object.
 * @returns Paginated JSON array of notification records.
 */
export async function getAll(req: Request, res: Response) {
  const { data, meta } = await notificationsService.list(
    req.query as unknown as NotificationQuery,
  );
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single notification by its UUID with recipient count.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON notification record with department and recipient count.
 */
export async function getById(req: Request, res: Response) {
  const notification = await notificationsService.findById(req.params.id);
  return apiResponse.success(res, notification);
}

/**
 * Creates a new notification with optional email dispatch and logs the audit event.
 * @param req - Express request with CreateNotificationInput body.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created notification record.
 */
export async function create(req: Request, res: Response) {
  const notification = await notificationsService.create(
    req.body as CreateNotificationInput,
  );

  auditService.log({
    action: "CREATE",
    entityType: "Notification",
    entityId: notification.id,
    adminId: req.user!.id,
    after: notification,
    req,
  });

  return apiResponse.created(res, notification);
}

/**
 * Permanently deletes a notification by ID and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function remove(req: Request, res: Response) {
  await notificationsService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "Notification",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
