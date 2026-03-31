/**
 * @file gallery.routes.ts
 * @description Gallery route definitions — album CRUD, batch image upload, and image ordering
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import { z } from "zod";
import * as controller from "./gallery.controller";
import { validate } from "@/middleware/validate";
import { authenticate, optionalAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { imageUpload } from "@/middleware/upload";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createAlbumSchema,
  updateAlbumSchema,
  albumIdParam,
  imageIdParam,
  albumIdForImagesParam,
  updateImageOrderSchema,
} from "./gallery.schema";

/** Gallery routes — public album listing, admin album CRUD, batch image upload, and image ordering. */
const router = Router();

const mediaRoles = ["SUPER_ADMIN", "ADMIN", "MEDIA_MANAGER", "TPO"] as const;

// Album routes
router.get("/", optionalAuth, controller.getAlbums);
router.get("/:id", validate({ params: albumIdParam }), controller.getAlbumById);

router.post(
  "/",
  authenticate,
  requireRole(...mediaRoles),
  strictLimiter,
  validate({ body: createAlbumSchema }),
  controller.createAlbum,
);

router.put(
  "/:id",
  authenticate,
  requireRole(...mediaRoles),
  strictLimiter,
  validate({ params: albumIdParam, body: updateAlbumSchema }),
  controller.updateAlbum,
);

router.delete(
  "/:id",
  authenticate,
  requireRole(...mediaRoles),
  validate({ params: albumIdParam }),
  controller.deleteAlbum,
);

// Cover route
router.put(
  "/:albumId/cover",
  authenticate,
  requireRole(...mediaRoles),
  strictLimiter,
  validate({ params: albumIdForImagesParam, body: z.object({ imageId: z.string().uuid() }) }),
  controller.setCover,
);

// Image routes
router.post(
  "/:albumId/images",
  authenticate,
  requireRole(...mediaRoles),
  strictLimiter,
  imageUpload.array("images", 20),
  validate({ params: albumIdForImagesParam }),
  controller.addImages,
);

router.delete(
  "/images/:imageId",
  authenticate,
  requireRole(...mediaRoles),
  validate({ params: imageIdParam }),
  controller.deleteImage,
);

router.put(
  "/images/:imageId/order",
  authenticate,
  requireRole(...mediaRoles),
  strictLimiter,
  validate({ params: imageIdParam, body: updateImageOrderSchema }),
  controller.updateImageOrder,
);

export default router;
