/**
 * @file department-scope.ts
 * @description Department scoping middleware — ensures HOD and department-bound admins
 *              can only operate on resources within their own department. SUPER_ADMIN
 *              and ADMIN roles bypass all department restrictions.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response, NextFunction } from "express";
import { AdminRole } from "@/config/constants";
import { ApiError } from "@/utils/api-error";

/**
 * Creates an Express middleware that enforces department-level access control.
 * Compares the authenticated user's `departmentId` against the `departmentId` found
 * in `req.body` or `req.query`. SUPER_ADMIN and ADMIN roles bypass the check entirely.
 * Users without a bound department also bypass the check.
 * @returns Express middleware function.
 * @throws {ApiError} 401 if no user is attached to the request.
 * @throws {ApiError} 403 if the target department does not match the user's department.
 */
export function requireDepartmentScope() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    // SUPER_ADMIN and ADMIN without department restriction bypass
    if (
      req.user.role === AdminRole.SUPER_ADMIN ||
      req.user.role === AdminRole.ADMIN
    ) {
      return next();
    }

    // Department-scoped roles (HOD, TPO) MUST have a departmentId assigned
    if (!req.user.departmentId) {
      if (req.user.role === AdminRole.HOD || req.user.role === AdminRole.TPO) {
        throw ApiError.forbidden("Your account has no department assigned. Contact an administrator.");
      }
      return next();
    }

    // Check target departmentId from body or query
    const targetDeptId =
      req.body?.departmentId ||
      req.query?.departmentId;

    if (targetDeptId && targetDeptId !== req.user.departmentId) {
      throw ApiError.forbidden("Cannot operate on resources outside your department");
    }

    // Auto-inject user's departmentId if none provided (prevents bypass by omitting the field)
    if (!targetDeptId) {
      if (req.body && typeof req.body === "object") {
        req.body.departmentId = req.user.departmentId;
      }
    }

    next();
  };
}

/**
 * Checks department access for operations on existing resources where the departmentId
 * is on the entity rather than in the request. Call this in the service layer after
 * fetching the resource.
 * @param user - The authenticated user object with role and optional departmentId.
 * @param resourceDepartmentId - The department ID of the target resource.
 * @throws {ApiError} 403 if the user's department does not match the resource's department.
 */
export function checkDepartmentAccess(
  user: { role: string; departmentId?: string },
  resourceDepartmentId: string | null | undefined,
): void {
  if (user.role === AdminRole.SUPER_ADMIN || user.role === AdminRole.ADMIN) {
    return;
  }

  if (!user.departmentId) {
    if (user.role === AdminRole.HOD || user.role === AdminRole.TPO) {
      throw ApiError.forbidden("Your account has no department assigned. Contact an administrator.");
    }
    return;
  }

  if (resourceDepartmentId && resourceDepartmentId !== user.departmentId) {
    throw ApiError.forbidden("Cannot operate on resources outside your department");
  }
}
