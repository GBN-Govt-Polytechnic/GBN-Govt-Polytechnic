/**
 * @file minio.ts
 * @description MinIO S3-compatible client instance for file storage.
 *              Configured with path-style access for compatibility with MinIO servers.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

/**
 * Pre-configured AWS S3Client instance pointing to the MinIO server.
 * Uses path-style addressing and credentials from environment variables.
 */
export const s3Client = new S3Client({
  endpoint: `${env.MINIO_USE_SSL ? "https" : "http"}://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

/**
 * Default S3 bucket name for file uploads, derived from the configured prefix.
 */
export const BUCKET_NAME = `${env.MINIO_BUCKET_PREFIX}-uploads`;

/**
 * Ensures the uploads bucket exists and has a public-read policy for serving
 * images/documents on the public frontend. Creates the bucket if missing.
 */
export async function ensureBucket(): Promise<void> {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
  } catch {
    logger.info(`Bucket "${BUCKET_NAME}" not found — creating...`);
    await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    logger.info(`Bucket "${BUCKET_NAME}" created.`);
  }

  // Set public-read policy so uploaded assets are accessible via direct URL
  const policy = JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
      },
    ],
  });

  await s3Client.send(
    new PutBucketPolicyCommand({ Bucket: BUCKET_NAME, Policy: policy }),
  );
  logger.info(`Bucket "${BUCKET_NAME}" public-read policy applied.`);
}
