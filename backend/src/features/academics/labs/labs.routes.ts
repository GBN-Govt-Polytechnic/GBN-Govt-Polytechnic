/**
 * @file labs.routes.ts
 * @description Lab route definitions — public listing by department and CMS CRUD with image uploads.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./labs.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { requireDepartmentScope } from "@/middleware/department-scope";
import { imageUpload } from "@/middleware/upload";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createLabSchema,
  updateLabSchema,
  labQuerySchema,
  labIdParam,
} from "./labs.schema";

/** Lab management routes — public read and admin CRUD with image upload support. */
const router = Router();

// Public routes
router.get("/", validate({ query: labQuerySchema }), controller.getAll);
router.get("/:id", validate({ params: labIdParam }), controller.getById);

// Admin routes
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "HOD"),
  requireDepartmentScope(),
  strictLimiter,
  imageUpload.single("image"),
  validate({ body: createLabSchema }),
  controller.create,
);
router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "HOD"),
  requireDepartmentScope(),
  strictLimiter,
  imageUpload.single("image"),
  validate({ params: labIdParam, body: updateLabSchema }),
  controller.update,
);
router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "HOD"),
  requireDepartmentScope(),
  validate({ params: labIdParam }),
  controller.remove,
);

export default router;
