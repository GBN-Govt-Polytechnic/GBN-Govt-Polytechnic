/**
 * @file error-handler.ts
 * @description Global Express error handler — catches all thrown/forwarded errors and returns
 *              a standardized JSON response. Handles ApiError, ZodError, Prisma known request
 *              errors, and unknown/unexpected errors with appropriate status codes.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import multer from "multer";
import { ApiError } from "@/utils/api-error";
import { logger } from "@/utils/logger";

/**
 * Global Express error handling middleware. Must be registered last in the middleware stack.
 * Converts known error types into consistent JSON responses:
 * - ApiError: uses the error's statusCode and message.
 * - ZodError: returns 400 with field-level validation errors.
 * - Prisma P2002 (unique constraint): returns 409 Conflict.
 * - Prisma P2025 (record not found): returns 404 Not Found.
 * - Unknown errors: logs the stack trace and returns 500 without leaking details.
 * @param err - The error object thrown or passed via `next(err)`.
 * @param _req - Express request object (unused).
 * @param res - Express response object.
 * @param _next - Express next function (unused, required for Express error handler signature).
 * @returns JSON error response.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // ApiError — known operational errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join(".") || "value";
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    }
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Multer file upload errors
  if (err instanceof multer.MulterError) {
    const messages: Record<string, string> = {
      LIMIT_FILE_SIZE: "File too large",
      LIMIT_FILE_COUNT: "Too many files",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field",
      LIMIT_FIELD_KEY: "Field name too long",
      LIMIT_FIELD_VALUE: "Field value too long",
      LIMIT_FIELD_COUNT: "Too many fields",
      LIMIT_PART_COUNT: "Too many parts",
    };
    return res.status(400).json({
      success: false,
      message: messages[err.code] ?? err.message,
    });
  }

  // Prisma unique constraint violation — map known column names to friendly labels, never leak raw names
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = err.meta?.target as string[] | undefined;
      const friendlyLabels: Record<string, string> = {
        email: "email address",
        slug: "URL slug",
        code: "course code",
        enrollmentNo: "enrollment number",
        enrollment_no: "enrollment number",
        name: "name",
      };
      const knownField = target?.find((t) => friendlyLabels[t]);
      const fieldLabel = knownField ? friendlyLabels[knownField] : "value";
      return res.status(409).json({
        success: false,
        message: `A record with this ${fieldLabel} already exists`,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
  }

  // Unknown errors — never leak internal details to clients
  logger.error("Unhandled error", { message: err.message, stack: err.stack });
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
