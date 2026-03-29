/**
 * @file achievements.routes.ts
 * @description Achievement route definitions — public listing and admin CRUD with image uploads.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./achievements.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { imageUpload } from "@/middleware/upload";
import {
  createAchievementSchema,
  updateAchievementSchema,
  achievementIdParam,
} from "./achievements.schema";
import { strictLimiter } from "@/middleware/rate-limit";

/** Achievement management routes — public listing and admin/media-manager CRUD with image uploads. */
const router = Router();

// Public routes
router.get("/", controller.getAll);
router.get("/:id", validate({ params: achievementIdParam }), controller.getById);

// Admin routes
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "MEDIA_MANAGER"),
  strictLimiter,
  imageUpload.single("image"),
  validate({ body: createAchievementSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "MEDIA_MANAGER"),
  strictLimiter,
  imageUpload.single("image"),
  validate({ params: achievementIdParam, body: updateAchievementSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: achievementIdParam }),
  controller.remove,
);

export default router;
