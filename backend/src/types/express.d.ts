/**
 * @file express.d.ts
 * @description Express type augmentation — extends the Express Request interface to include
 *              the authenticated user payload and overrides `params` to always be
 *              `Record<string, string>` for Express 5 compatibility.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import "express";

declare module "express" {
  /**
   * Extended Express Request interface with authentication and typed params.
   */
  interface Request {
    /**
     * Authenticated user payload attached by the `authenticate` middleware.
     * Undefined if the request is unauthenticated.
     */
    user?: {
      /** Unique identifier of the authenticated user. */
      id: string;
      /** Role string (e.g., SUPER_ADMIN, HOD) of the authenticated user. */
      role: string;
      /** Type of user account. */
      userType: "admin" | "student";
      /** Department ID the user is bound to, if any. */
      departmentId?: string;
    };
    /** Route parameters, always typed as string values. */
    params: Record<string, string>;
  }
}
