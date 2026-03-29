/**
 * @file banners.routes.ts
 * @description Banner route definitions — public active listing and admin CRUD.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./banners.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createBannerSchema,
  updateBannerSchema,
  bannerIdParam,
} from "./banners.schema";

/** Banner routes — public active listing, admin CRUD with rate limiting. */
const router = Router();

// Public routes
router.get("/active", controller.getActive);

// Admin routes
router.get(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  controller.getAll,
);

router.get(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: bannerIdParam }),
  controller.getById,
);

router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  validate({ body: createBannerSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  validate({ params: bannerIdParam, body: updateBannerSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  validate({ params: bannerIdParam }),
  controller.remove,
);

export default router;
