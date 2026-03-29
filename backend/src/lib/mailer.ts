/**
 * @file mailer.ts
 * @description Nodemailer SMTP transport instance configured from environment variables.
 *              Provides the shared transporter and a connection verification function.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import nodemailer from "nodemailer";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

/**
 * Pre-configured Nodemailer SMTP transporter.
 * Uses TLS on port 465, STARTTLS on other ports.
 */
export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/**
 * Verifies the SMTP connection by performing a handshake with the mail server.
 * Logs the result and returns a boolean indicating success.
 * @returns True if the SMTP connection is healthy, false otherwise.
 */
export async function verifyConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    logger.info("SMTP connection verified");
    return true;
  } catch (err) {
    logger.warn("SMTP connection failed — emails will not be sent", err);
    return false;
  }
}
