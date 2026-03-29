/**
 * @file results.routes.ts
 * @description Result links route definitions — public listing and admin CRUD with file uploads.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./results.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { documentUpload } from "@/middleware/upload";
import {
  createResultSchema,
  updateResultSchema,
  resultQuerySchema,
  resultIdParam,
} from "./results.schema";
import { strictLimiter } from "@/middleware/rate-limit";

/** Result link routes — public read and admin CRUD with role-based access and file uploads. */
const router = Router();

// Public routes
router.get("/", validate({ query: resultQuerySchema }), controller.getAll);
router.get("/:id", validate({ params: resultIdParam }), controller.getById);

// Admin routes
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  documentUpload.single("file"),
  validate({ body: createResultSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  documentUpload.single("file"),
  validate({ params: resultIdParam, body: updateResultSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: resultIdParam }),
  controller.remove,
);

export default router;
