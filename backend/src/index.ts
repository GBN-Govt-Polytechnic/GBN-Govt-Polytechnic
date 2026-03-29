/**
 * @file index.ts
 * @description Entry point — starts the Express server on the configured port.
 *              Registers global handlers for unhandled promise rejections and uncaught exceptions
 *              to ensure graceful shutdown.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import app from "@/app";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { ensureBucket } from "@/lib/minio";

// Ensure MinIO bucket exists with public-read policy before accepting requests
ensureBucket().catch((err) => {
  logger.warn("MinIO bucket setup failed (storage may be unavailable):", err);
});

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", error);
  server.close(() => process.exit(1));
});
