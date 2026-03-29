/**
 * @file courses.routes.ts
 * @description Course route definitions — public listing by department and CMS CRUD.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./courses.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { requireDepartmentScope } from "@/middleware/department-scope";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createCourseSchema,
  updateCourseSchema,
  courseQuerySchema,
  courseIdParam,
} from "./courses.schema";

/** Course management routes — public read and admin CRUD with role-based access. */
const router = Router();

// Public routes
router.get("/", validate({ query: courseQuerySchema }), controller.getAll);
router.get("/:id", validate({ params: courseIdParam }), controller.getById);

// Admin routes
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "HOD"),
  requireDepartmentScope(),
  strictLimiter,
  validate({ body: createCourseSchema }),
  controller.create,
);
router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "HOD"),
  requireDepartmentScope(),
  strictLimiter,
  validate({ params: courseIdParam, body: updateCourseSchema }),
  controller.update,
);
router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: courseIdParam }),
  controller.remove,
);

export default router;
