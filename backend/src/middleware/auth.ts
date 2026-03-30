/**
 * @file auth.ts
 * @description JWT verification middleware — extracts and validates the Bearer token from
 *              the Authorization header and attaches the decoded user payload to `req.user`.
 *              Performs a live isActive check (2-minute cache) to detect deactivated accounts
 *              without a DB hit on every single request.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { env } from "@/config/env";
import { ApiError } from "@/utils/api-error";

/**
 * JWT token payload structure extracted after verification.
 * @interface TokenPayload
 */
interface TokenPayload {
  /** Unique identifier of the authenticated user. */
  id: string;
  /** Role string (e.g., SUPER_ADMIN, HOD) of the authenticated user. */
  role: string;
  /** Type of user account. */
  userType: "admin" | "student";
  /** Department ID the user is bound to, if any. */
  departmentId?: string;
}

/** Cached isActive status per userId with a 2-minute TTL to limit DB round-trips. */
interface CacheEntry {
  isActive: boolean;
  cachedAt: number;
}

const activeCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/** Sweep expired entries every 10 minutes to prevent unbounded map growth. */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of activeCache.entries()) {
    if (now - entry.cachedAt > CACHE_TTL_MS) {
      activeCache.delete(key);
    }
  }
}, 10 * 60 * 1000).unref(); // .unref() prevents this timer from keeping the process alive

/**
 * Proactively invalidates the isActive cache for a user.
 * Call this whenever a user's isActive status is changed (e.g. admin deactivates account)
 * so the change takes effect immediately rather than waiting for the TTL to expire.
 * @param userId - The user ID whose cache entry should be removed.
 */
export function invalidateUserCache(userId: string): void {
  activeCache.delete(userId);
}

/**
 * Checks whether a user is currently active, using a 2-minute in-memory cache.
 * Falls through to a DB query when the cache is stale or missing.
 * @param id - The user ID.
 * @param userType - "admin" or "student".
 * @returns true if the account is active.
 */
async function checkIsActive(id: string, userType: "admin" | "student"): Promise<boolean> {
  const cached = activeCache.get(id);
  const now = Date.now();

  if (cached && now - cached.cachedAt <= CACHE_TTL_MS) {
    return cached.isActive;
  }

  // Evict stale entry before re-querying to keep map size bounded
  if (cached) activeCache.delete(id);

  let isActive: boolean;
  if (userType === "admin") {
    const record = await prisma.adminUser.findUnique({ where: { id }, select: { isActive: true } });
    isActive = record?.isActive ?? false;
  } else {
    // Student model not yet in schema — student tokens are not supported on this platform
    isActive = false;
  }

  activeCache.set(id, { isActive, cachedAt: now });
  return isActive;
}

/**
 * Express middleware that requires a valid JWT Bearer token.
 * Extracts the token from the Authorization header, verifies it, and
 * attaches the decoded payload to `req.user`. Also performs a live isActive
 * check (with 2-minute cache) to reject deactivated accounts promptly.
 * @param req - Express request object.
 * @param _res - Express response object (unused).
 * @param next - Express next function.
 * @throws {ApiError} 401 if the token is missing, malformed, invalid, or account is deactivated.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing or invalid authorization header");
  }

  const token = header.slice(7);
  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "gpn-api",
      audience: "gpn-frontend",
    }) as TokenPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  const isActive = await checkIsActive(payload.id, payload.userType);
  if (!isActive) {
    throw ApiError.unauthorized("Account has been deactivated");
  }

  req.user = {
    id: payload.id,
    role: payload.role,
    userType: payload.userType,
    departmentId: payload.departmentId,
  };
  next();
}

/**
 * Express middleware that optionally decodes a JWT Bearer token if present.
 * Unlike `authenticate`, this does not throw if the token is missing or invalid —
 * it simply proceeds without setting `req.user`.
 * @param req - Express request object.
 * @param _res - Express response object (unused).
 * @param next - Express next function.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "gpn-api",
      audience: "gpn-frontend",
    }) as TokenPayload;
    req.user = {
      id: payload.id,
      role: payload.role,
      userType: payload.userType,
      departmentId: payload.departmentId,
    };
  } catch {
    // Ignore invalid tokens in optional auth
  }
  next();
}
