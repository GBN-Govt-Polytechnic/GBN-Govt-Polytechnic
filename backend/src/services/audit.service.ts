/**
 * @file audit.service.ts
 * @description Audit logging logic — fire-and-forget recording of CMS write operations to the audit_log table.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request } from "express";
import prisma from "@/lib/prisma";
import { logger } from "@/utils/logger";
import type { AuditAction } from "@prisma/client";

const SENSITIVE_FIELDS = new Set(["passwordHash", "password", "refreshToken", "accessToken"]);

/**
 * Recursively strips sensitive fields (passwords, tokens) before persisting to the audit log.
 * @param data - The data object to sanitize.
 * @returns A sanitized copy with sensitive fields removed.
 */
function sanitize(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(sanitize);

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_FIELDS.has(key)) continue;
    result[key] = value;
  }
  return result;
}

/** Parameters for creating an audit log entry. */
interface AuditLogParams {
  action: AuditAction;
  entityType: string;
  entityId?: string;
  adminId?: string;
  before?: unknown;
  after?: unknown;
  req?: Request;
}

/**
 * Persists an audit log entry in a fire-and-forget manner. Sanitizes before/after data
 * and captures IP address and user-agent from the request.
 * @param params - Audit log parameters including action, entity info, admin ID, and optional before/after snapshots.
 */
export function log(params: AuditLogParams): void {
  prisma.auditLog
    .create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        adminId: params.adminId,
        before: sanitize(params.before) as any,
        after: sanitize(params.after) as any,
        ipAddress: params.req?.ip,
        userAgent: params.req?.headers["user-agent"],
      },
    })
    .catch((err: unknown) => logger.error("Audit log failed", err));
}
