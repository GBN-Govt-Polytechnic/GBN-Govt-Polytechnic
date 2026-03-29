/**
 * @file dashboard.routes.ts
 * @description Dashboard route definitions — admin statistics endpoint.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./dashboard.controller";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

/** Dashboard routes — admin-only statistics endpoint accessible by SUPER_ADMIN, ADMIN, HOD, and TPO roles. */
const router = Router();

router.get(
  "/stats",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "HOD", "TPO"),
  controller.getStats,
);

export default router;
