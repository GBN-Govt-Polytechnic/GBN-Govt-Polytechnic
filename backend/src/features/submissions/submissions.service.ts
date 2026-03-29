/**
 * @file submissions.service.ts
 * @description Submission business logic — save contact and grievance/complaint form data, send email notifications, and admin status updates.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import * as emailService from "@/services/email.service";
import type {
  CreateSubmissionInput,
  UpdateInquiryStatusInput,
  SubmissionQuery,
} from "./submissions.schema";

/**
 * Creates a submission record. Sends a fire-and-forget email notification for CONTACT type.
 * @param input - Validated submission data including type, name, email, subject, message.
 * @returns The newly created submission record.
 */
export async function createSubmission(input: CreateSubmissionInput) {
  const submission = await prisma.submission.create({ data: input });

  // Send email notification for contact inquiries only (fire-and-forget)
  if (input.type === "CONTACT") {
    emailService.sendContactNotification({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
    });
  }

  return submission;
}

/**
 * Retrieves a paginated list of submissions with optional type and status filters.
 * @param query - Pagination query with optional type and status filters.
 * @returns Object with data array and pagination meta.
 */
export async function listSubmissions(query: SubmissionQuery) {
  const { skip, take, page, limit } = parsePagination(query);

  const where = {
    ...(query.type && { type: query.type }),
    ...(query.status && { status: query.status }),
  };

  const [data, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}

/**
 * Updates the status of a submission.
 * @param id - The submission UUID.
 * @param input - New status value.
 * @returns The updated submission record.
 * @throws {ApiError} 404 if submission not found.
 */
export async function updateSubmissionStatus(id: string, input: UpdateInquiryStatusInput) {
  const existing = await prisma.submission.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Submission not found");

  return prisma.submission.update({
    where: { id },
    data: { status: input.status },
  });
}
