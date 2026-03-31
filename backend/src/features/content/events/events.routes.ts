/**
 * @file events.routes.ts
 * @description Event route definitions — public listing and CMS CRUD with image upload
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./events.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { imageUpload } from "@/middleware/upload";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
  eventIdParam,
} from "./events.schema";

/** Event routes — public list/slug lookup and admin create, update, delete with image upload. */
const router = Router();

const editorRoles = ["SUPER_ADMIN", "ADMIN", "NEWS_EDITOR", "MEDIA_MANAGER", "TPO"] as const;

router.get("/", validate({ query: eventQuerySchema }), controller.getAll);
router.get("/slug/:slug", controller.getBySlug);
router.get("/:id", authenticate, requireRole(...editorRoles), validate({ params: eventIdParam }), controller.getById);

router.post(
  "/",
  authenticate,
  requireRole(...editorRoles),
  strictLimiter,
  imageUpload.single("image"),
  validate({ body: createEventSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole(...editorRoles),
  strictLimiter,
  imageUpload.single("image"),
  validate({ params: eventIdParam, body: updateEventSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole(...editorRoles),
  validate({ params: eventIdParam }),
  controller.remove,
);

export default router;
