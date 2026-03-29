/**
 * @file placements.routes.ts
 * @description Placement route definitions — companies, stats, and activities with TPO role access.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./placements.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { imageUpload } from "@/middleware/upload";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createCompanySchema,
  updateCompanySchema,
  companyIdParam,
  upsertStatSchema,
  statQuerySchema,
  createActivitySchema,
  updateActivitySchema,
  activityQuerySchema,
  activityIdParam,
} from "./placements.schema";

/** Placement management routes — companies, stats, and activities with role-based admin/TPO access. */
const router = Router();

const adminRoles = ["SUPER_ADMIN", "ADMIN", "TPO"] as const;

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

router.get("/companies", controller.getAllCompanies);

router.post(
  "/companies",
  authenticate,
  requireRole(...adminRoles),
  strictLimiter,
  validate({ body: createCompanySchema }),
  controller.createCompany,
);

router.put(
  "/companies/:id",
  authenticate,
  requireRole(...adminRoles),
  strictLimiter,
  validate({ params: companyIdParam, body: updateCompanySchema }),
  controller.updateCompany,
);

router.delete(
  "/companies/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: companyIdParam }),
  controller.removeCompany,
);

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

router.get(
  "/stats",
  validate({ query: statQuerySchema }),
  controller.getAllStats,
);

router.put(
  "/stats",
  authenticate,
  requireRole(...adminRoles),
  strictLimiter,
  validate({ body: upsertStatSchema }),
  controller.upsertStat,
);

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

router.get(
  "/activities",
  validate({ query: activityQuerySchema }),
  controller.getAllActivities,
);

router.get(
  "/activities/:id",
  validate({ params: activityIdParam }),
  controller.getActivityById,
);

router.post(
  "/activities",
  authenticate,
  requireRole(...adminRoles),
  strictLimiter,
  imageUpload.single("image"),
  validate({ body: createActivitySchema }),
  controller.createActivity,
);

router.put(
  "/activities/:id",
  authenticate,
  requireRole(...adminRoles),
  strictLimiter,
  imageUpload.single("image"),
  validate({ params: activityIdParam, body: updateActivitySchema }),
  controller.updateActivity,
);

router.delete(
  "/activities/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: activityIdParam }),
  controller.removeActivity,
);

export default router;
