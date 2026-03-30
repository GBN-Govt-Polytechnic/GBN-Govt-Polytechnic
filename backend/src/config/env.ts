/**
 * @file env.ts
 * @description Zod-validated environment variables — parses and validates all required
 *              configuration from process.env at startup. Exits the process if validation fails.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { z } from "zod";

const isProd = process.env.NODE_ENV === "production";

/**
 * Zod schema defining the shape and validation rules for all environment variables.
 * Includes defaults for optional values and security refinements for secrets.
 */
const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32).refine(
    (s) => !/^your-/.test(s) && !/secret-here/.test(s) && !/^replace-this/.test(s) && !/^changeme/.test(s),
    "JWT_SECRET must not be a placeholder value — generate with: openssl rand -base64 48",
  ),
  JWT_REFRESH_SECRET: z.string().min(32).refine(
    (s) => !/^your-/.test(s) && !/secret-here/.test(s) && !/^replace-this/.test(s) && !/^changeme/.test(s),
    "JWT_REFRESH_SECRET must not be a placeholder value — generate with: openssl rand -base64 48",
  ),
  JWT_ACCESS_EXPIRY: z.string()
    .regex(/^\d+[smhd]$/, "JWT_ACCESS_EXPIRY must be a duration like 15m, 1h, 7d")
    .default("15m"),
  JWT_REFRESH_EXPIRY: z.string()
    .regex(/^\d+[smhd]$/, "JWT_REFRESH_EXPIRY must be a duration like 15m, 1h, 7d")
    .default("7d"),

  MINIO_ENDPOINT: z.string().default("localhost"),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string().min(8).refine(
    (s) => s !== "minioadmin",
    "MINIO_ACCESS_KEY must not use default MinIO credentials",
  ),
  MINIO_SECRET_KEY: z.string().min(8).refine(
    (s) => s !== "minioadmin",
    "MINIO_SECRET_KEY must not use default MinIO credentials",
  ),
  MINIO_USE_SSL: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  MINIO_BUCKET_PREFIX: z.string().default("gpn"),

  // Public URL for serving uploaded files — in production, set to your CDN/R2 domain
  // e.g. https://files.gpnilokheri.ac.in  or  https://<id>.r2.cloudflarestorage.com
  // Falls back to MinIO direct URL if not set
  STORAGE_PUBLIC_URL: z.string().optional(),

  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  ADMIN_URL: z.string().url().default("http://localhost:3001"),

  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default("dev@example.com").refine(
    (s) => !isProd || s.trim().length > 0,
    "SMTP_USER is required in production",
  ),
  SMTP_PASS: z.string().default("dev-password").refine(
    (s) => !isProd || (!/^your-/.test(s) && !/^changeme/.test(s) && !/^replace/.test(s) && s !== "password"),
    "SMTP_PASS must not be a placeholder value in production",
  ),
  SMTP_FROM: z.string().default("GBN Polytechnic <noreply@gpnilokheri.ac.in>"),
  ADMIN_EMAIL: z.string().email().default("admin@gpnilokheri.ac.in"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

/**
 * Validated and typed environment configuration object.
 * Guaranteed to conform to the envSchema at runtime.
 */
export const env = parsed.data;
