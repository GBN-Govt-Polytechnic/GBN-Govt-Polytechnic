/**
 * @file notifications.routes.ts
 * @description Notification route definitions — admin create, list, detail, and delete.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./notifications.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createNotificationSchema,
  notificationQuerySchema,
  notificationIdParam,
} from "./notifications.schema";

/** Notification management routes — admin-only CRUD with role-based access. */
const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ query: notificationQuerySchema }),
  controller.getAll,
);

router.get(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: notificationIdParam }),
  controller.getById,
);

router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  strictLimiter,
  validate({ body: createNotificationSchema }),
  controller.create,
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN"),
  validate({ params: notificationIdParam }),
  controller.remove,
);

export default router;
