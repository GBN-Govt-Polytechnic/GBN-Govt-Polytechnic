/**
 * @file auth.controller.ts
 * @description Auth request handlers — thin layer that delegates to auth service
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as authService from "./auth.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { LoginInput, RefreshInput, ChangePasswordInput, RegisterStudentInput, LogoutInput } from "./auth.schema";

/**
 * Handles user login by validating credentials and issuing JWT tokens.
 * Logs both successful and failed login attempts to the audit trail.
 * @param req - Express request with LoginInput body (email and password).
 * @param res - Express response object.
 * @returns JSON with access token, refresh token, and user profile.
 * @throws {ApiError} 401 if email or password is incorrect.
 */
export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body as LoginInput);

    auditService.log({
      action: "LOGIN",
      entityType: result.user.userType,
      entityId: result.user.id,
      adminId: result.user.userType === "admin" ? result.user.id : undefined,
      req,
    });

    return apiResponse.success(res, result);
  } catch (err) {
    auditService.log({
      action: "LOGIN",
      entityType: "FAILED",
      entityId: req.body?.email ?? "unknown",
      req,
    });
    throw err;
  }
}

/**
 * Refreshes an expired access token using a valid refresh token.
 * @param req - Express request with RefreshInput body (refreshToken).
 * @param res - Express response object.
 * @returns JSON with new access token, refresh token, and user profile.
 * @throws {ApiError} 401 if refresh token is invalid or expired.
 */
export async function refreshToken(req: Request, res: Response) {
  const result = await authService.refresh(req.body as RefreshInput);
  return apiResponse.success(res, result);
}

/**
 * Handles user logout by revoking the provided refresh token server-side.
 * @param req - Express request with LogoutInput body containing the refresh token.
 * @param res - Express response object.
 * @returns JSON with logout success message.
 */
export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body as LogoutInput;
  await authService.revokeRefreshToken(refreshToken);
  return apiResponse.success(res, { message: "Logged out successfully" });
}

/**
 * Changes the authenticated user's password after verifying their current password.
 * @param req - Express request with ChangePasswordInput body and authenticated user context.
 * @param res - Express response object.
 * @returns JSON with password change success message.
 * @throws {ApiError} 400 if current password is incorrect.
 * @throws {ApiError} 404 if user not found.
 */
export async function changePassword(req: Request, res: Response) {
  const { id, userType } = req.user!;
  await authService.changePassword(id, userType, req.body as ChangePasswordInput);
  return apiResponse.success(res, { message: "Password changed successfully" });
}

/**
 * Retrieves the authenticated user's profile information.
 * @param req - Express request with authenticated user context.
 * @param res - Express response object.
 * @returns JSON with user profile data including department info.
 * @throws {ApiError} 404 if user not found.
 */
export async function getMe(req: Request, res: Response) {
  const { id, userType } = req.user!;
  const user = await authService.getMe(id, userType);
  return apiResponse.success(res, user);
}

/**
 * Registers a new student account and returns JWT tokens for immediate login.
 * Students must provide their institution-issued enrollment number.
 * @param req - Express request with RegisterStudentInput body.
 * @param res - Express response object.
 * @returns 201 JSON with accessToken, refreshToken, and user payload.
 * @throws {ApiError} 409 if enrollment number or email already exists.
 */
export async function registerStudent(req: Request, res: Response) {
  const result = await authService.registerStudent(req.body as RegisterStudentInput);
  return apiResponse.created(res, result);
}

