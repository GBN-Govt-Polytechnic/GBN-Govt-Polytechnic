/**
 * @file users.controller.ts
 * @description User management request handlers — admin-only CRUD for CMS admin users
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as usersService from "./users.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateUserInput, UpdateUserInput, ResetUserPasswordInput, UserQuery } from "./users.schema";

/**
 * Retrieves a paginated list of all admin users with optional role filtering.
 * @param req - Express request with optional query params (page, limit, role).
 * @param res - Express response object.
 * @returns Paginated JSON array of admin user records.
 */
export async function getAll(req: Request, res: Response) {
  const { data, meta } = await usersService.list(req.query as unknown as UserQuery);
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single admin user by their UUID.
 * @param req - Express request with user ID in params.
 * @param res - Express response object.
 * @returns JSON with admin user record including department info.
 * @throws {ApiError} 404 if user not found.
 */
export async function getById(req: Request, res: Response) {
  const user = await usersService.findById(req.params.id);
  return apiResponse.success(res, user);
}

/**
 * Creates a new admin user and logs the action to the audit trail.
 * @param req - Express request with CreateUserInput body and authenticated admin context.
 * @param res - Express response object.
 * @returns JSON with the newly created admin user record (201).
 * @throws {ApiError} 409 if a user with the same email already exists.
 */
export async function create(req: Request, res: Response) {
  const user = await usersService.create(req.body as CreateUserInput);

  auditService.log({
    action: "CREATE",
    entityType: "AdminUser",
    entityId: user.id,
    adminId: req.user!.id,
    after: user,
    req,
  });

  return apiResponse.created(res, user);
}

/**
 * Updates an existing admin user's details and logs the action to the audit trail.
 * @param req - Express request with user ID in params and UpdateUserInput body.
 * @param res - Express response object.
 * @returns JSON with the updated admin user record.
 * @throws {ApiError} 404 if user not found.
 * @throws {ApiError} 409 if updated email conflicts with an existing user.
 */
export async function update(req: Request, res: Response) {
  const before = await usersService.findById(req.params.id);
  const user = await usersService.update(req.params.id, req.body as UpdateUserInput);

  auditService.log({
    action: "UPDATE",
    entityType: "AdminUser",
    entityId: user.id,
    adminId: req.user!.id,
    before,
    after: user,
    req,
  });

  return apiResponse.success(res, user);
}

/**
 * Permanently deletes an admin user and logs the action to the audit trail.
 * @param req - Express request with user ID in params and authenticated admin context.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 * @throws {ApiError} 404 if user not found.
 */
export async function remove(req: Request, res: Response) {
  await usersService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "AdminUser",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}

/**
 * Resets an existing admin user's password and revokes their active sessions.
 * @param req - Express request with user ID in params and reset payload in body.
 * @param res - Express response object.
 * @returns JSON success message.
 * @throws {ApiError} 404 if user not found.
 */
export async function resetPassword(req: Request, res: Response) {
  await usersService.resetPassword(req.params.id, req.body as ResetUserPasswordInput);

  auditService.log({
    action: "UPDATE",
    entityType: "AdminUser",
    entityId: req.params.id,
    adminId: req.user!.id,
    after: { passwordReset: true },
    req,
  });

  return apiResponse.success(res, { message: "Password reset successfully" });
}
