/**
 * @file faculty.routes.ts
 * @description Faculty route definitions — public listing by department and CMS CRUD with photo upload
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./faculty.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { imageUpload } from "@/middleware/upload";
import { createFacultySchema, updateFacultySchema, facultyIdParam, querySchema } from "./faculty.schema";
import { requireDepartmentScope } from "@/middleware/department-scope";
import { strictLimiter } from "@/middleware/rate-limit";

/** Faculty routes — public list/detail by department and admin CRUD with photo upload. */
const router = Router();

// Public routes
router.get("/", validate({ query: querySchema }), controller.getAll);
router.get("/:id", validate({ params: facultyIdParam }), controller.getById);

// Admin routes
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "HOD"),
  strictLimiter,
  requireDepartmentScope(),
  imageUpload.single("photo"),
  validate({ body: createFacultySchema }),
  controller.create,
);
router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "HOD"),
  strictLimiter,
  requireDepartmentScope(),
  imageUpload.single("photo"),
  validate({ params: facultyIdParam, body: updateFacultySchema }),
  controller.update,
);
router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: facultyIdParam }),
  controller.remove,
);

export default router;
