/**
 * @file hero-slides.routes.ts
 * @description Hero slide route definitions — homepage carousel listing and admin CRUD with image upload
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./hero-slides.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { imageUpload } from "@/middleware/upload";
import {
  createHeroSlideSchema,
  updateHeroSlideSchema,
  heroSlideIdParam,
} from "./hero-slides.schema";
import { strictLimiter } from "@/middleware/rate-limit";

/** Hero slide routes — public listing and admin create, update, delete with image upload. */
const router = Router();

const mediaRoles = ["SUPER_ADMIN", "ADMIN", "MEDIA_MANAGER"] as const;

router.get("/", controller.getAll);

router.get(
  "/:id",
  authenticate,
  requireRole(...mediaRoles),
  validate({ params: heroSlideIdParam }),
  controller.getById,
);

router.post(
  "/",
  authenticate,
  requireRole(...mediaRoles),
  strictLimiter,
  imageUpload.single("image"),
  validate({ body: createHeroSlideSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole(...mediaRoles),
  strictLimiter,
  imageUpload.single("image"),
  validate({ params: heroSlideIdParam, body: updateHeroSlideSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: heroSlideIdParam }),
  controller.remove,
);

export default router;
