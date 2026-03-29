/**
 * @file dashboard.controller.ts
 * @description Dashboard request handlers — aggregated statistics for the admin panel.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import prisma from "@/lib/prisma";
import * as apiResponse from "@/utils/api-response";

/**
 * Returns aggregated counts for all major entities and pending submissions.
 * @param _req - Express request (unused).
 * @param res - Express response object.
 * @returns JSON object with entity counts and pending submission totals.
 */
export async function getStats(_req: Request, res: Response) {
  const [
    departments,
    faculty,
    news,
    events,
    courses,
    pendingContacts,
    pendingComplaints,
  ] = await Promise.all([
    prisma.department.count({ where: { isActive: true } }),
    prisma.faculty.count({ where: { isActive: true } }),
    prisma.newsNotice.count({ where: { status: "PUBLISHED" } }),
    prisma.event.count({ where: { status: "PUBLISHED" } }),
    prisma.course.count({ where: { isActive: true } }),
    prisma.submission.count({ where: { status: "NEW", type: "CONTACT" } }),
    prisma.submission.count({ where: { status: "NEW", type: "COMPLAINT" } }),
  ]);

  return apiResponse.success(res, {
    departments,
    faculty,
    news,
    events,
    courses,
    pendingContacts,
    pendingComplaints,
    pendingSubmissions: pendingContacts + pendingComplaints,
  });
}
