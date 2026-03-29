/**
 * @file documents.routes.ts
 * @description Public document route definitions — public listing and admin CRUD with PDF uploads.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./documents.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { documentUpload } from "@/middleware/upload";
import { createDocumentSchema, updateDocumentSchema, documentIdParam } from "./documents.schema";
import { strictLimiter } from "@/middleware/rate-limit";

/** Public document routes — public listing and admin CRUD with PDF uploads. */
const router = Router();

// Public routes
router.get("/", controller.getAll);
router.get("/admin/all", authenticate, requireRole("SUPER_ADMIN", "ADMIN"), controller.getAllAdmin);
router.get("/:id", validate({ params: documentIdParam }), controller.getById);

// Admin routes
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  documentUpload.single("file"),
  validate({ body: createDocumentSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  documentUpload.single("file"),
  validate({ params: documentIdParam, body: updateDocumentSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: documentIdParam }),
  controller.remove,
);

export default router;
