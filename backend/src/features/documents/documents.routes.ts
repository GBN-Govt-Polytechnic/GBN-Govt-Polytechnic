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
import { strictLimiter, authLimiter } from "@/middleware/rate-limit";

/** Public document routes — public listing and admin CRUD with PDF uploads. */
const router = Router();
const documentManagerRoles = ["SUPER_ADMIN", "ADMIN", "MEDIA_MANAGER", "NEWS_EDITOR"] as const;

// Public routes
router.get("/", controller.getAll);
router.get("/admin/all", authenticate, requireRole(...documentManagerRoles), controller.getAllAdmin);
router.get("/admin/:id", authenticate, requireRole(...documentManagerRoles), validate({ params: documentIdParam }), controller.getByIdAdmin);
router.get("/:id", validate({ params: documentIdParam }), controller.getById);

// Admin routes
router.post(
  "/",
  authenticate,
  requireRole(...documentManagerRoles),
  strictLimiter,
  documentUpload.single("file"),
  validate({ body: createDocumentSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole(...documentManagerRoles),
  strictLimiter,
  documentUpload.single("file"),
  validate({ params: documentIdParam, body: updateDocumentSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole(...documentManagerRoles),
  authLimiter,
  validate({ params: documentIdParam }),
  controller.remove,
);

export default router;
