/**
 * @file storage.service.ts
 * @author Gurkirat Singh
 * @description MinIO file storage logic — upload with magic byte validation, delete, get URL
 */

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { fileTypeFromBuffer } from "file-type";
import { s3Client, BUCKET_NAME } from "@/lib/minio";
import { env } from "@/config/env";
import { ApiError } from "@/utils/api-error";
import { FILE_LIMITS } from "@/config/constants";
import crypto from "crypto";

interface UploadResult {
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/** All MIME types allowed by the application */
const ALL_ALLOWED_TYPES: Set<string> = new Set([
  ...FILE_LIMITS.ALLOWED_IMAGE_TYPES,
  ...FILE_LIMITS.ALLOWED_VIDEO_TYPES,
  ...FILE_LIMITS.ALLOWED_DOCUMENT_TYPES,
]);

/** Map detected MIME type to safe file extension */
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

export async function upload(
  file: Express.Multer.File,
  folder: string,
): Promise<UploadResult> {
  // Validate file content via magic bytes (not just client-reported MIME type)
  const detected = await fileTypeFromBuffer(file.buffer);
  const detectedMime = detected?.mime ?? file.mimetype;

  if (!ALL_ALLOWED_TYPES.has(detectedMime)) {
    throw ApiError.badRequest(`File content type ${detectedMime} is not allowed`);
  }

  // Use extension from detected type, not from user-supplied filename — reject unknown types
  const ext = MIME_TO_EXT[detectedMime];
  if (!ext) {
    throw ApiError.badRequest(`No known file extension for type ${detectedMime}`);
  }
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: detectedMime,
      // Images/videos display inline; documents force download
      ContentDisposition: detectedMime.startsWith("image/") || detectedMime.startsWith("video/")
        ? "inline"
        : "attachment",
    }),
  );

  return {
    key,
    url: getPublicUrl(key),
    fileName: file.originalname.replace(/[\r\n\t\0]/g, "").replace(/[^\w\s.\-()]/g, "_").slice(0, 255),
    fileSize: file.size,
    mimeType: detectedMime,
  };
}

export async function deleteFile(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );
}

/**
 * Builds the public URL for a stored file. Uses STORAGE_PUBLIC_URL if set (production),
 * otherwise falls back to direct MinIO URL (development).
 * @param key - The S3 object key (e.g. "news/images/abc123.png").
 * @returns Full public URL for the file.
 */
export function getPublicUrl(key: string): string {
  if (env.STORAGE_PUBLIC_URL) {
    // Production: use CDN/proxy URL — the reverse proxy maps /uploads/* to the bucket
    return `${env.STORAGE_PUBLIC_URL}/${BUCKET_NAME}/${key}`;
  }
  // Development: direct MinIO URL
  const protocol = env.MINIO_USE_SSL ? "https" : "http";
  return `${protocol}://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${BUCKET_NAME}/${key}`;
}
