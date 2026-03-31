/**
 * @file sessions.routes.ts
 * @description Academic session route definitions — admin CRUD with current-session toggle support.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./sessions.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createSessionSchema,
  updateSessionSchema,
  sessionIdParam,
} from "./sessions.schema";

/** Academic session routes — admin-only CRUD restricted to SUPER_ADMIN. */
const router = Router();

router.get(
  "/",
  controller.getAll,
);

router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN"),
  strictLimiter,
  validate({ body: createSessionSchema }),
  controller.create,
);

router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN"),
  strictLimiter,
  validate({ params: sessionIdParam, body: updateSessionSchema }),
  controller.update,
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN"),
  validate({ params: sessionIdParam }),
  controller.remove,
);

export default router;
