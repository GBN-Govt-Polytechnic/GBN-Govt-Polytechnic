/**
 * @file auth.service.ts
 * @description Auth business logic — bcrypt password verification, JWT token management
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { env } from "@/config/env";
import { ApiError } from "@/utils/api-error";
import { PrismaClient } from "@prisma/client";
import type { LoginInput, RefreshInput, ChangePasswordInput, RegisterStudentInput } from "./auth.schema";

/** Transaction client type — the base PrismaClient minus the methods banned inside transactions. */
type TxClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

/** Untyped prisma alias for models not yet in schema (Student — reserved for future portal feature). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/** Pre-computed dummy hash for constant-time login failures (prevents user enumeration via timing). */
const DUMMY_HASH = "$2a$12$LJ3m4ys3Lg2VBe6p0C5Yke0FNNKJDx3gKoF/GnZmFsnBbMGx9VbqO";

/** Maximum consecutive failed login attempts before account lockout. */
const MAX_FAILED_ATTEMPTS = 5;

/** Duration of account lockout in milliseconds (15 minutes). */
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

/** JWT token payload structure containing user identification and role data. */
interface TokenPayload {
  id: string;
  role: string;
  userType: "admin" | "student";
  departmentId?: string;
}

/** JWT signing options for access tokens. */
const ACCESS_JWT_OPTIONS = {
  issuer: "gpn-api",
  audience: "gpn-frontend",
  algorithm: "HS256" as const,
};

/** JWT signing options for refresh tokens — distinct audience prevents cross-use. */
const REFRESH_JWT_OPTIONS = {
  issuer: "gpn-api",
  audience: "gpn-refresh",
  algorithm: "HS256" as const,
};

/**
 * Produces a SHA-256 hash of a token string for secure storage.
 * @param token - The raw JWT token string.
 * @returns Hex-encoded SHA-256 hash.
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Parses a duration string (e.g. "7d", "15m", "1h") into milliseconds.
 * @param duration - Duration string with unit suffix (s, m, h, d).
 * @returns Duration in milliseconds.
 */
function parseDurationMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7d
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * (multipliers[unit] ?? 86_400_000);
}

/**
 * Generates a JWT access/refresh token pair for the given payload.
 * The refresh token is hashed and stored in the database for revocation support.
 * Supports token family tracking — pass familyId to continue an existing rotation chain.
 * @param payload - User identification and role data to embed in the tokens.
 * @param familyId - Optional family ID for refresh token rotation chain. New UUID generated if omitted.
 * @returns Object containing accessToken, refreshToken, and the familyId used.
 */
async function generateTokens(payload: TokenPayload, familyId?: string) {
  const resolvedFamilyId = familyId ?? crypto.randomUUID();

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    ...ACCESS_JWT_OPTIONS,
    subject: payload.id,
    expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"],
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    ...REFRESH_JWT_OPTIONS,
    subject: payload.id,
    expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"],
  });

  // Store hashed refresh token in DB for revocation tracking
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + parseDurationMs(env.JWT_REFRESH_EXPIRY));

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: payload.id,
      userType: payload.userType,
      familyId: resolvedFamilyId,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

/**
 * Registers a new student account and returns a JWT token pair for immediate login.
 * @param input - Student registration data including enrollment number and password.
 * @returns Object containing accessToken, refreshToken, and the created user payload.
 * @throws {ApiError} 409 if enrollment number or email is already in use.
 * @throws {ApiError} 404 if the provided departmentId does not exist.
 */
export async function registerStudent(input: RegisterStudentInput) {
  if (!env.ENABLE_STUDENT_SELF_REGISTRATION) {
    throw ApiError.forbidden("Student self-registration is disabled. Please contact administration.");
  }

  const [byEnrollment, byEmail, dept] = await Promise.all([
    db.student.findUnique({ where: { enrollmentNo: input.rollNo } }),
    db.student.findUnique({ where: { email: input.email } }),
    prisma.department.findUnique({ where: { id: input.departmentId } }),
  ]);

  if (byEnrollment) throw ApiError.conflict("An account with this enrollment number already exists");
  if (byEmail) throw ApiError.conflict("An account with this email already exists");
  if (!dept) throw ApiError.notFound("Department not found");

  const passwordHash = await bcrypt.hash(input.password, 12);

  const student = await db.student.create({
    data: {
      enrollmentNo: input.rollNo,
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
      departmentId: input.departmentId,
      semester: input.semester,
      batch: input.batch,
    },
  });

  const payload: TokenPayload = {
    id: student.id,
    role: "STUDENT",
    userType: "student",
    departmentId: student.departmentId,
  };

  const tokens = await generateTokens(payload);
  return { user: payload, ...tokens };
}

/**
 * Verifies user credentials against admin and student tables and generates JWT token pair.
 * Enforces per-account lockout after 5 consecutive failures (15-minute lockout).
 * Uses constant-time comparison to prevent timing-based user enumeration.
 * @param input - Login credentials (email and password).
 * @returns Object containing accessToken, refreshToken, and sanitized user payload.
 * @throws {ApiError} 401 if credentials don't match any active user.
 * @throws {ApiError} 401 if account is locked.
 */
export async function login(input: LoginInput) {
  // 1. Check AdminUser — fetch without isActive filter so we can handle lockout properly
  const admin = await prisma.adminUser.findFirst({
    where: { email: input.email },
  });

  if (admin) {
    // Always run bcrypt first (constant-time) to prevent timing-based enumeration
    const valid = await bcrypt.compare(input.password, admin.passwordHash);

    // Check isActive and lockout AFTER bcrypt, but use identical error message for all
    // failure reasons to prevent enumeration via distinct error messages
    if (!admin.isActive || (admin.lockedUntil && admin.lockedUntil > new Date())) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    if (!valid) {
      const attempts = admin.failedLoginAttempts + 1;
      const lockedUntil = attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null;
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          failedLoginAttempts: attempts,
          ...(lockedUntil ? { lockedUntil } : {}),
        },
      });
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Successful login — reset failure counters and record login time
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const payload: TokenPayload = {
      id: admin.id,
      role: admin.role,
      userType: "admin",
      departmentId: admin.departmentId ?? undefined,
    };

    const tokens = await generateTokens(payload);
    return { user: payload, ...tokens };
  }

  // 2. Check Student
  const student = await db.student.findFirst({
    where: { email: input.email, isActive: true },
  });

  if (student) {
    const now = new Date();
    const studentLockedUntil = student.lockedUntil ? new Date(student.lockedUntil) : null;
    const valid = await bcrypt.compare(input.password, student.passwordHash);

    if (studentLockedUntil && studentLockedUntil > now) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const hasStudentLockoutFields = "failedLoginAttempts" in student || "lockedUntil" in student;

    if (!valid) {
      if (hasStudentLockoutFields) {
        const attempts = Number(student.failedLoginAttempts ?? 0) + 1;
        const nextLockedUntil = attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null;
        await db.student.update({
          where: { id: student.id },
          data: {
            failedLoginAttempts: attempts,
            ...(nextLockedUntil ? { lockedUntil: nextLockedUntil } : {}),
          },
        });
      }
      throw ApiError.unauthorized("Invalid email or password");
    }

    if (hasStudentLockoutFields && (Number(student.failedLoginAttempts ?? 0) > 0 || student.lockedUntil)) {
      await db.student.update({
        where: { id: student.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    const payload: TokenPayload = {
      id: student.id,
      role: "STUDENT",
      userType: "student",
      departmentId: student.departmentId,
    };

    const tokens = await generateTokens(payload);
    return { user: payload, ...tokens };
  }

  // Constant-time: always run bcrypt even when no user found (prevents timing-based enumeration)
  await bcrypt.compare(input.password, DUMMY_HASH);
  throw ApiError.unauthorized("Invalid email or password");
}

/**
 * Validates a refresh token and issues a new access/refresh token pair.
 * Implements RFC 6819 §5.2.2.3 token family detection — if a revoked token is replayed,
 * the entire family is revoked to signal potential compromise.
 * Re-queries the database for fresh role and department data on every rotation.
 * @param input - Object containing the refresh token string.
 * @returns Object containing new accessToken, refreshToken, and user payload.
 * @throws {ApiError} 401 if refresh token is invalid, expired, replayed, or account is deactivated.
 */
export async function refresh(input: RefreshInput) {
  let payload: TokenPayload;
  try {
    payload = jwt.verify(input.refreshToken, env.JWT_REFRESH_SECRET, {
      algorithms: ["HS256"],
      issuer: "gpn-api",
      audience: "gpn-refresh",
    }) as TokenPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  // Verify refresh token exists in DB
  const tokenHash = hashToken(input.refreshToken);
  const storedToken = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!storedToken) {
    throw ApiError.unauthorized("Refresh token not found");
  }

  // RFC 6819 §5.2.2.3 — replay detection: if token was already used, revoke entire family
  if (storedToken.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: { familyId: storedToken.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw ApiError.unauthorized("Refresh token already used — all sessions revoked for security");
  }

  if (storedToken.expiresAt < new Date()) {
    throw ApiError.unauthorized("Refresh token has expired");
  }

  // Re-query DB for fresh role/dept data — never trust stale JWT claims
  let tokenPayload: TokenPayload;
  if (payload.userType === "admin") {
    const freshUser = await prisma.adminUser.findUnique({ where: { id: payload.id } });
    if (!freshUser || !freshUser.isActive) throw ApiError.unauthorized("Account deactivated or not found");
    tokenPayload = {
      id: freshUser.id,
      role: freshUser.role,
      userType: "admin",
      departmentId: freshUser.departmentId ?? undefined,
    };
  } else {
    const freshUser = await db.student.findUnique({ where: { id: payload.id } });
    if (!freshUser || !freshUser.isActive) throw ApiError.unauthorized("Account deactivated or not found");
    tokenPayload = {
      id: freshUser.id,
      role: "STUDENT",
      userType: "student",
      departmentId: freshUser.departmentId ?? undefined,
    };
  }

  // Atomically revoke the old token and issue new tokens to prevent TOCTOU race
  // (two concurrent requests with the same token would both pass the revokedAt check above
  // without the transaction — updateMany returning count=0 signals the race was lost)
  const { accessToken, refreshToken } = await prisma.$transaction(async (tx: TxClient) => {
    const revoked = await tx.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    if (revoked.count === 0) {
      // Another concurrent request already revoked this token — treat as replay
      await tx.refreshToken.updateMany({
        where: { familyId: storedToken.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw ApiError.unauthorized("Refresh token already used — all sessions revoked for security");
    }

    const newAccessToken = jwt.sign(tokenPayload, env.JWT_SECRET, {
      ...ACCESS_JWT_OPTIONS,
      subject: tokenPayload.id,
      expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"],
    });
    const newRefreshToken = jwt.sign(tokenPayload, env.JWT_REFRESH_SECRET, {
      ...REFRESH_JWT_OPTIONS,
      subject: tokenPayload.id,
      expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"],
    });

    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + parseDurationMs(env.JWT_REFRESH_EXPIRY));

    await tx.refreshToken.create({
      data: {
        tokenHash: newTokenHash,
        userId: tokenPayload.id,
        userType: tokenPayload.userType,
        familyId: storedToken.familyId,
        expiresAt,
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  });

  return { user: tokenPayload, accessToken, refreshToken };
}

/**
 * Revokes a specific refresh token by its raw JWT string.
 * @param refreshToken - The raw refresh token JWT to revoke.
 */
export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Revokes all active refresh tokens for a given user (e.g. on password change).
 * @param userId - The user's ID.
 * @param userType - The type of user account.
 */
export async function revokeAllUserTokens(userId: string, userType: "admin" | "student"): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, userType, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Changes a user's password after verifying the current password.
 * Supports admin and student user types.
 * @param userId - The ID of the user changing their password.
 * @param userType - The type of user account (admin or student).
 * @param input - Object containing currentPassword and newPassword.
 * @throws {ApiError} 404 if user not found.
 * @throws {ApiError} 400 if current password is incorrect.
 */
export async function changePassword(
  userId: string,
  userType: "admin" | "student",
  input: ChangePasswordInput,
) {
  let currentHash: string;

  if (userType === "admin") {
    const user = await prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("User not found");
    currentHash = user.passwordHash;
  } else {
    const user = await db.student.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("User not found");
    currentHash = user.passwordHash;
  }

  const valid = await bcrypt.compare(input.currentPassword, currentHash);
  if (!valid) throw ApiError.badRequest("Current password is incorrect");

  const newHash = await bcrypt.hash(input.newPassword, 12);

  if (userType === "admin") {
    await prisma.adminUser.update({ where: { id: userId }, data: { passwordHash: newHash } });
  } else {
    await db.student.update({ where: { id: userId }, data: { passwordHash: newHash } });
  }

  // Revoke all existing refresh tokens — forces re-login on all devices
  await revokeAllUserTokens(userId, userType);
}

/**
 * Retrieves the full profile of the authenticated user including department details.
 * @param userId - The ID of the user to retrieve.
 * @param userType - The type of user account (admin or student).
 * @returns Sanitized user profile with department info and userType discriminator.
 * @throws {ApiError} 404 if user not found.
 */
export async function getMe(userId: string, userType: "admin" | "student") {
  if (userType === "admin") {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        departmentId: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        department: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!user) throw ApiError.notFound("User not found");
    return { ...user, userType: "admin" as const };
  }

  const user = await db.student.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      enrollmentNo: true,
      phone: true,
      departmentId: true,
      semester: true,
      batch: true,
      profileImageUrl: true,
      isActive: true,
      createdAt: true,
      department: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!user) throw ApiError.notFound("User not found");
  return { ...user, userType: "student" as const, role: "STUDENT" };
}
