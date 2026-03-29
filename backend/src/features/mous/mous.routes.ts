/**
 * @file mous.routes.ts
 * @description MoU route definitions — public listing and admin CRUD with document uploads.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./mous.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { documentUpload } from "@/middleware/upload";
import { createMoUSchema, updateMoUSchema, mouIdParam } from "./mous.schema";
import { strictLimiter } from "@/middleware/rate-limit";

/** MoU management routes — public listing and admin CRUD with document upload support. */
const router = Router();

// Public routes
router.get("/", controller.getAll);
router.get("/:id", validate({ params: mouIdParam }), controller.getById);

// Admin routes
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  documentUpload.single("document"),
  validate({ body: createMoUSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  documentUpload.single("document"),
  validate({ params: mouIdParam, body: updateMoUSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN"),
  validate({ params: mouIdParam }),
  controller.remove,
);

export default router;
