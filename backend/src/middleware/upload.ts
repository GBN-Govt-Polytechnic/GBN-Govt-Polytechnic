/**
 * @file upload.ts
 * @description Multer middleware configuration — uses in-memory storage with file size limits
 *              and MIME type filtering. Provides pre-configured upload instances for images,
 *              documents, and mixed file types.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import multer from "multer";
import { FILE_LIMITS } from "@/config/constants";
import { ApiError } from "@/utils/api-error";

/** In-memory storage engine — files are held in Buffer, not written to disk. */
const storage = multer.memoryStorage();

/**
 * Creates a multer file filter that only accepts files with the given MIME types.
 * Rejects disallowed types with a 400 error. The storage service performs additional
 * magic-byte validation after the buffer is received.
 * @param allowedTypes - Array of allowed MIME type strings.
 * @returns Multer file filter callback function.
 */
function fileFilter(allowedTypes: readonly string[]) {
  return (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, `File type ${file.mimetype} is not allowed. Accepted: ${allowedTypes.join(", ")}`));
    }
  };
}

/**
 * Multer instance configured for image uploads (JPEG, PNG, WebP, GIF).
 * Maximum file size: 5 MB.
 */
export const imageUpload = multer({
  storage,
  limits: { fileSize: FILE_LIMITS.MAX_IMAGE_SIZE },
  fileFilter: fileFilter(FILE_LIMITS.ALLOWED_IMAGE_TYPES),
});

/**
 * Multer instance configured for document uploads (PDF, Word, Excel).
 * Maximum file size: 20 MB.
 */
export const documentUpload = multer({
  storage,
  limits: { fileSize: FILE_LIMITS.MAX_DOCUMENT_SIZE },
  fileFilter: fileFilter(FILE_LIMITS.ALLOWED_DOCUMENT_TYPES),
});

/**
 * Multer instance configured for media uploads (images + videos).
 * Maximum file size: 100 MB.
 */
export const mediaUpload = multer({
  storage,
  limits: { fileSize: FILE_LIMITS.MAX_VIDEO_SIZE },
  fileFilter: fileFilter(FILE_LIMITS.ALLOWED_MEDIA_TYPES),
});

/**
 * Multer instance configured for mixed uploads (images + documents).
 * Maximum file size: 20 MB.
 */
export const mixedUpload = multer({
  storage,
  limits: { fileSize: FILE_LIMITS.MAX_DOCUMENT_SIZE },
  fileFilter: fileFilter([
    ...FILE_LIMITS.ALLOWED_IMAGE_TYPES,
    ...FILE_LIMITS.ALLOWED_DOCUMENT_TYPES,
  ]),
});
