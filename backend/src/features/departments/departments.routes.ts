/**
 * @file departments.routes.ts
 * @description Department route definitions — public listing by slug and admin CRUD
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./departments.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentIdParam,
  departmentSlugParam,
} from "./departments.schema";

/** Department routes — public list/detail and admin create, update, delete. */
const router = Router();

// Public routes
router.get("/", controller.getAll);
router.get("/:slug", validate({ params: departmentSlugParam }), controller.getBySlug);

// Admin routes
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  validate({ body: createDepartmentSchema }),
  controller.create,
);
router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "HOD"),
  strictLimiter,
  validate({ params: departmentIdParam, body: updateDepartmentSchema }),
  controller.update,
);
router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN"),
  validate({ params: departmentIdParam }),
  controller.remove,
);

export default router;
