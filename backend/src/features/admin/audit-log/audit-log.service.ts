/**
 * @file audit-log.service.ts
 * @description Audit log business logic — paginated query and filtering of activity log entries.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import prisma from "@/lib/prisma";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";

/** Query parameters for filtering audit log entries. */
interface AuditLogQuery {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
  adminId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Retrieves a paginated list of audit log entries with optional filtering.
 * @param query - Query filters including action, entityType, adminId, date range, and pagination.
 * @returns Object with data array (including admin details) and pagination meta.
 */
export async function list(query: AuditLogQuery) {
  const { skip, take, page, limit } = parsePagination(query as Record<string, unknown>);
  const where: Record<string, unknown> = {};

  if (query.action) where.action = query.action;
  if (query.entityType) where.entityType = query.entityType;
  if (query.adminId) where.adminId = query.adminId;

  if (query.startDate || query.endDate) {
    const createdAt: Record<string, Date> = {};
    if (query.startDate) createdAt.gte = new Date(query.startDate);
    if (query.endDate) createdAt.lte = new Date(query.endDate);
    where.createdAt = createdAt;
  }

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(total, page, limit) };
}
