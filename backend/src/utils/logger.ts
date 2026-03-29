/**
 * @file logger.ts
 * @description Simple structured logger for request and error logging.
 *              Outputs colorized human-readable logs in development and JSON-structured
 *              logs in production.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

/** Whether the application is running in development mode. */
const isDev = process.env.NODE_ENV !== "production";

/**
 * Formats a log message based on the current environment.
 * In production, returns a JSON string; in development, returns a colorized string.
 * @param level - Log severity level (info, warn, error, debug).
 * @param message - The log message text.
 * @param meta - Optional metadata object to include in the log entry.
 * @returns Formatted log string.
 */
function formatMessage(level: string, message: string, meta?: unknown): string {
  if (!isDev) {
    return JSON.stringify({
      level,
      message,
      ...(meta ? { meta } : {}),
      timestamp: new Date().toISOString(),
    });
  }
  const colors: Record<string, string> = {
    info: "\x1b[36m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    debug: "\x1b[90m",
  };
  const reset = "\x1b[0m";
  const color = colors[level] ?? "";
  const timestamp = new Date().toLocaleTimeString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  return `${color}[${timestamp}] ${level.toUpperCase()}${reset}: ${message}${metaStr}`;
}

/**
 * Application logger providing info, warn, error, and debug methods.
 * Debug messages are suppressed in production.
 */
export const logger = {
  /**
   * Logs an informational message.
   * @param message - The log message.
   * @param meta - Optional metadata to include.
   */
  info(message: string, meta?: unknown) {
    console.log(formatMessage("info", message, meta));
  },
  /**
   * Logs a warning message.
   * @param message - The log message.
   * @param meta - Optional metadata to include.
   */
  warn(message: string, meta?: unknown) {
    console.warn(formatMessage("warn", message, meta));
  },
  /**
   * Logs an error message.
   * @param message - The log message.
   * @param meta - Optional metadata to include.
   */
  error(message: string, meta?: unknown) {
    console.error(formatMessage("error", message, meta));
  },
  /**
   * Logs a debug message. Only outputs in development mode.
   * @param message - The log message.
   * @param meta - Optional metadata to include.
   */
  debug(message: string, meta?: unknown) {
    if (isDev) console.debug(formatMessage("debug", message, meta));
  },
};
