/**
 * @file email.service.ts
 * @description Email sending service — provides functions for sending contact notifications
 *              and password reset links via SMTP.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { transporter } from "@/lib/mailer";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

/**
 * Options for sending an email via the transporter.
 * @interface MailOptions
 */
interface MailOptions {
  /** Recipient email address. */
  to: string;
  /** Email subject line. */
  subject: string;
  /** HTML body content of the email. */
  html: string;
}

/**
 * Escapes HTML special characters to prevent XSS in email templates.
 * @param str - The raw string to escape.
 * @returns HTML-safe string with special characters replaced by entities.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends an email using the configured SMTP transporter.
 * Logs an error on failure but does not throw, allowing the caller to continue.
 * @param options - Mail options including recipient, subject, and HTML body.
 */
export async function sendMail(options: MailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (err) {
    logger.error("Failed to send email", { to: options.to, subject: options.subject, error: err });
  }
}

/**
 * Sends a contact inquiry notification email to the configured admin address.
 * @param inquiry - Object containing the contact form submission fields.
 * @param inquiry.name - Name of the person submitting the inquiry.
 * @param inquiry.email - Email address of the person submitting the inquiry.
 * @param inquiry.subject - Subject of the inquiry.
 * @param inquiry.message - Body text of the inquiry.
 */
export async function sendContactNotification(inquiry: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  await sendMail({
    to: env.ADMIN_EMAIL,
    subject: `New Contact Inquiry: ${escapeHtml(inquiry.subject)}`,
    html: `
      <h2>New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(inquiry.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(inquiry.message)}</p>
    `,
  });
}

/**
 * Sends a password reset email containing a time-limited reset link.
 * @param to - Recipient email address.
 * @param token - Password reset token to include in the reset URL.
 */
export async function sendPasswordReset(to: string, token: string): Promise<void> {
  const resetUrl = `${env.ADMIN_URL}/reset-password?token=${encodeURIComponent(token)}`;
  await sendMail({
    to,
    subject: "Password Reset Request - GBN Polytechnic",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below:</p>
      <p><a href="${escapeHtml(resetUrl)}">${escapeHtml(resetUrl)}</a></p>
      <p>This link expires in 15 minutes. If you didn't request this, please ignore.</p>
    `,
  });
}

