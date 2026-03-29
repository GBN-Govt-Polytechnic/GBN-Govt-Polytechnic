/**
 * @file users.schema.ts
 * @description Zod schemas for user management requests — create, update, and ID validation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";
import { ADMIN_ROLES } from "@/config/constants";

/** Zod schema for creating a new admin user — validates name, email, password, role, and optional department. */
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(12, "Password must be at least 12 characters").max(128),
  role: z.enum(ADMIN_ROLES),
  departmentId: z.string().uuid().optional(),
});

/** Zod schema for updating an admin user — all fields optional, supports partial updates. */
export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(ADMIN_ROLES).optional(),
  departmentId: z.string().uuid().optional().nullable(),
  isActive: z.boolean().optional(),
});

/** Zod schema for validating user ID route parameter as a UUID. */
export const userIdParam = z.object({
  id: z.string().uuid(),
});

/** Zod schema for GET /users query parameters — optional role/isActive filters and pagination. */
export const userQuerySchema = z.object({
  role: z.enum(ADMIN_ROLES).optional(),
  isActive: z.string().transform((v) => v === "true").optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** Inferred TypeScript type for user list query parameters. */
export type UserQuery = z.infer<typeof userQuerySchema>;

/** Inferred TypeScript type for admin user creation payload. */
export type CreateUserInput = z.infer<typeof createUserSchema>;

/** Inferred TypeScript type for admin user update payload. */
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
