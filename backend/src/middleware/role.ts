/**
 * @file role.ts
 * @description Role-based access control middleware — checks the authenticated user's role
 *              against a list of allowed roles. SUPER_ADMIN always bypasses the check.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response, NextFunction } from "express";
import { AdminRole } from "@/config/constants";
import { ApiError } from "@/utils/api-error";

/**
 * Creates an Express middleware that restricts access to users with the specified roles.
 * SUPER_ADMIN role always passes regardless of the allowed roles list.
 * @param roles - One or more role strings that are permitted to access the route.
 * @returns Express middleware function that checks `req.user.role`.
 * @throws {ApiError} 401 if no user is attached to the request.
 * @throws {ApiError} 403 if the user's role is not in the allowed list.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    // SUPER_ADMIN always passes
    if (req.user.role === AdminRole.SUPER_ADMIN) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action");
    }

    next();
  };
}
