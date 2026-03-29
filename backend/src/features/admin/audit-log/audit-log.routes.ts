/**
 * @file audit-log.routes.ts
 * @description Audit log route definitions — SUPER_ADMIN-only paginated log viewer.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./audit-log.controller";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

/** Audit log routes — SUPER_ADMIN-only paginated log viewer. */
const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN"),
  controller.getAll,
);

export default router;
