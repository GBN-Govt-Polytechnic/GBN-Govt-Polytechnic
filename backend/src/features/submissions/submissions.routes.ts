/**
 * @file submissions.routes.ts
 * @description Submission route definitions — rate-limited public form POSTs and unified admin review endpoints.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router, type Request, type Response, type NextFunction } from "express";
import * as controller from "./submissions.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { strictLimiter } from "@/middleware/rate-limit";
import {
  createSubmissionSchema,
  updateInquiryStatusSchema,
  submissionQuerySchema,
  submissionIdParam,
} from "./submissions.schema";

/** Submission routes — public forms (contact, complaint) and unified admin review endpoints. */
const router = Router();

// ---------------------------------------------------------------------------
// Public routes (rate-limited) — type injected before validation
// ---------------------------------------------------------------------------

router.post(
  "/contact",
  strictLimiter,
  (req: Request, _res: Response, next: NextFunction) => { req.body.type = "CONTACT"; next(); },
  validate({ body: createSubmissionSchema }),
  controller.createSubmission,
);

router.post(
  "/complaints",
  strictLimiter,
  (req: Request, _res: Response, next: NextFunction) => { req.body.type = "COMPLAINT"; next(); },
  validate({ body: createSubmissionSchema }),
  controller.createSubmission,
);

// ---------------------------------------------------------------------------
// Admin routes — unified list and status update
// ---------------------------------------------------------------------------

router.get(
  "/submissions",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ query: submissionQuerySchema }),
  controller.listSubmissions,
);

router.patch(
  "/submissions/:id/status",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN"),
  validate({ params: submissionIdParam, body: updateInquiryStatusSchema }),
  controller.updateSubmissionStatus,
);

export default router;
