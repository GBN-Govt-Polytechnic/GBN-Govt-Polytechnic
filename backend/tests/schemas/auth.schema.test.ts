import { describe, expect, test } from "bun:test";
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
  changePasswordSchema,
} from "@/features/auth/auth.schema";

describe("loginSchema", () => {
  test("accepts valid input", () => {
    const result = loginSchema.safeParse({
      email: "admin@gpnilokheri.ac.in",
      password: "securepass123",
    });
    expect(result.success).toBe(true);
  });

  test("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
  });

  test("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "admin@gpnilokheri.ac.in",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  test("rejects password over 128 chars", () => {
    const result = loginSchema.safeParse({
      email: "admin@gpnilokheri.ac.in",
      password: "a".repeat(129),
    });
    expect(result.success).toBe(false);
  });

  test("rejects missing fields", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
    expect(loginSchema.safeParse({ password: "test" }).success).toBe(false);
  });
});

describe("refreshSchema", () => {
  test("accepts valid token", () => {
    const result = refreshSchema.safeParse({ refreshToken: "some-jwt-token" });
    expect(result.success).toBe(true);
  });

  test("rejects empty token", () => {
    const result = refreshSchema.safeParse({ refreshToken: "" });
    expect(result.success).toBe(false);
  });
});

describe("logoutSchema", () => {
  test("accepts valid token", () => {
    const result = logoutSchema.safeParse({ refreshToken: "some-jwt-token" });
    expect(result.success).toBe(true);
  });

  test("rejects missing token", () => {
    const result = logoutSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  test("accepts valid passwords", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword12",
      newPassword: "newpassword12",
    });
    expect(result.success).toBe(true);
  });

  test("rejects new password under 12 chars", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword12",
      newPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  test("rejects new password over 128 chars", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword12",
      newPassword: "a".repeat(129),
    });
    expect(result.success).toBe(false);
  });
});
