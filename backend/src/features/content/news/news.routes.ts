/**
 * @file news.routes.ts
 * @description News and notices route definitions — public paginated listing and CMS CRUD with file uploads
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./news.controller";
import { validate } from "@/middleware/validate";
import { authenticate, optionalAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { mixedUpload } from "@/middleware/upload";
import {
  createNewsSchema,
  updateNewsSchema,
  newsQuerySchema,
  newsIdParam,
} from "./news.schema";
import { strictLimiter } from "@/middleware/rate-limit";

/** News routes — public list/slug lookup and admin create, update, delete with image/attachment uploads. */
const router = Router();

const editorRoles = ["SUPER_ADMIN", "ADMIN", "NEWS_EDITOR", "MEDIA_MANAGER", "TPO"] as const;

const uploadFields = mixedUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "attachment", maxCount: 1 },
]);

router.get("/", optionalAuth, validate({ query: newsQuerySchema }), controller.getAll);
router.get("/slug/:slug", controller.getBySlug);
router.get("/:id", authenticate, requireRole(...editorRoles), validate({ params: newsIdParam }), controller.getById);

router.post(
  "/",
  authenticate,
  requireRole(...editorRoles),
  strictLimiter,
  uploadFields,
  validate({ body: createNewsSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole(...editorRoles),
  strictLimiter,
  uploadFields,
  validate({ params: newsIdParam, body: updateNewsSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole(...editorRoles),
  validate({ params: newsIdParam }),
  controller.remove,
);

export default router;
