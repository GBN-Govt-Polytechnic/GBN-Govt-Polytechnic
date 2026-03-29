/**
 * @file submissions.schema.ts
 * @description Zod validation schemas and inferred TypeScript types for unified form submissions and admin status updates.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";
import { INQUIRY_STATUSES } from "@/config/constants";

// ---------------------------------------------------------------------------
// Public form schema (unified — type is injected by the route layer)
// ---------------------------------------------------------------------------

/** Zod schema for a public form submission — validates name, email, subject, message, and type. */
export const createSubmissionSchema = z.object({
  type: z.enum(["CONTACT", "COMPLAINT"]),
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  email: z.string().email("Invalid email").max(254),
  phone: z.string().max(20).optional(),
  subject: z.string().min(1, "Subject is required").max(200, "Subject must be 200 characters or less"),
  message: z.string().min(1, "Message is required").max(5000, "Message must be 5000 characters or less"),
});

// ---------------------------------------------------------------------------
// Admin status update schema
// ---------------------------------------------------------------------------

/** Zod schema for inquiry status update — validates status against allowed INQUIRY_STATUSES. */
export const updateInquiryStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUSES),
});

// ---------------------------------------------------------------------------
// List query schema
// ---------------------------------------------------------------------------

/** Zod schema for submission list query — pagination plus optional type and status filters. */
export const submissionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  type: z.enum(["CONTACT", "COMPLAINT"]).optional(),
  status: z.enum(INQUIRY_STATUSES).optional(),
});

/** Zod schema for validating the submission UUID route parameter. */
export const submissionIdParam = z.object({
  id: z.string().uuid(),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

/** Inferred type for a unified submission payload. */
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
/** Inferred type for inquiry status update payload. */
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
/** Inferred type for submission list query parameters. */
export type SubmissionQuery = z.infer<typeof submissionQuerySchema>;
