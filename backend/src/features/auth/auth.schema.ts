/**
 * @file auth.schema.ts
 * @description Zod schemas for auth requests — login, refresh, and password change validation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

/** Zod schema for login request body — validates email format and password presence. */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required").max(128),
});

/** Zod schema for token refresh request body — validates refresh token presence. */
export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

/** Zod schema for logout request body — requires the refresh token so it can be revoked server-side. */
export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

/** Zod schema for password change request body — validates current and new password requirements. */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(12, "Password must be at least 12 characters").max(128),
});

/** Inferred TypeScript type for login request body. */
export type LoginInput = z.infer<typeof loginSchema>;

/** Inferred TypeScript type for token refresh request body. */
export type RefreshInput = z.infer<typeof refreshSchema>;

/** Inferred TypeScript type for logout request body. */
export type LogoutInput = z.infer<typeof logoutSchema>;

/** Inferred TypeScript type for password change request body. */
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ---------------------------------------------------------------------------
// Public self-registration schemas
// ---------------------------------------------------------------------------

/**
 * Zod schema for student self-registration.
 * Students provide their institution-issued enrollment number to create a portal account.
 */
export const registerStudentSchema = z.object({
  rollNo: z.string().min(1, "Roll number is required").max(30),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required").max(254),
  password: z.string().min(12, "Password must be at least 12 characters").max(128),
  phone: z.string().max(20).optional(),
  departmentId: z.string().uuid("Invalid department"),
  semester: z.coerce.number().int().min(1).max(6),
  batch: z.string().regex(/^\d{4}-\d{2}$/, "Batch format must be YYYY-YY (e.g. 2023-26)"),
});

/** Inferred TypeScript type for student self-registration payload. */
export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;
