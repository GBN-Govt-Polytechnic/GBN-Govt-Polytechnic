/**
 * @file rate-limit.ts
 * @description Rate limiter configuration — provides PostgreSQL-backed rate limiting middleware
 *              at three tiers: global (100 req/min), strict (5 req/min for form submissions),
 *              and auth (10 req/min for endpoints like refresh and logout).
 *              PostgreSQL-backed state is shared across all process instances and persists
 *              across restarts, preventing bypass via IP rotation or instance restart.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response, NextFunction } from "express";
import { RateLimiterPostgres } from "rate-limiter-flexible";
import pg from "pg";
import { env } from "@/config/env";
import { ApiError } from "@/utils/api-error";

/** Shared PostgreSQL pool for rate limiter state. */
const pgPool = new pg.Pool({ connectionString: env.DATABASE_URL });

/** Global rate limiter: 100 requests per 60 seconds per IP. */
const globalRateLimiter = new RateLimiterPostgres({
  storeClient: pgPool,
  tableName: "rate_limits_global",
  points: 100,
  duration: 60,
});

/** Strict rate limiter: 5 requests per 60 seconds per IP (for write endpoints). */
const strictRateLimiter = new RateLimiterPostgres({
  storeClient: pgPool,
  tableName: "rate_limits_strict",
  points: 5,
  duration: 60,
});

/** Auth rate limiter: 10 requests per 60 seconds per IP (for refresh/logout endpoints). */
const authRateLimiter = new RateLimiterPostgres({
  storeClient: pgPool,
  tableName: "rate_limits_auth",
  points: 10,
  duration: 60,
});

/**
 * Wraps a RateLimiterPostgres instance in an Express middleware.
 * Consumes one point per request based on the client's IP address.
 * @param limiter - The rate limiter instance to use.
 * @returns Express middleware that enforces the rate limit.
 * @throws {ApiError} 429 if the rate limit is exceeded.
 */
function createMiddleware(limiter: RateLimiterPostgres) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await limiter.consume(req.ip ?? "unknown");
      next();
    } catch {
      throw ApiError.tooManyRequests();
    }
  };
}

/** Global rate limiting middleware (100 req/min). Applied to all routes. */
export const globalLimiter = createMiddleware(globalRateLimiter);
/** Strict rate limiting middleware (5 req/min). For write/form submission endpoints. */
export const strictLimiter = createMiddleware(strictRateLimiter);
/** Auth rate limiting middleware (10 req/min). For refresh and logout endpoints. */
export const authLimiter = createMiddleware(authRateLimiter);
