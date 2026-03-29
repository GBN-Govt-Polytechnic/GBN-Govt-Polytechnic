/**
 * @file api-error.ts
 * @description Custom error class with HTTP status codes for consistent API error handling.
 *              Provides static factory methods for common HTTP error types (400, 401, 403, 404, 409, 429, 500).
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

/**
 * Custom error class for API responses with HTTP status codes.
 * Provides static factory methods for common HTTP error types.
 * @extends Error
 */
export class ApiError extends Error {
  /** HTTP status code to return in the response. */
  public readonly statusCode: number;
  /** Whether the error is an expected operational error (true) or a programming bug (false). */
  public readonly isOperational: boolean;
  /** Optional field-level validation errors keyed by field name. */
  public readonly errors?: Record<string, string[]>;

  /**
   * Creates a new ApiError instance.
   * @param statusCode - HTTP status code for the error response.
   * @param message - Human-readable error message.
   * @param errors - Optional field-level validation errors.
   * @param isOperational - Whether this is an expected operational error. Defaults to true.
   */
  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Creates a 400 Bad Request error.
   * @param message - Error message to send to client.
   * @param errors - Optional field-level validation errors.
   * @returns New ApiError instance with status code 400.
   */
  static badRequest(message = "Bad request", errors?: Record<string, string[]>) {
    return new ApiError(400, message, errors);
  }

  /**
   * Creates a 401 Unauthorized error.
   * @param message - Error message to send to client.
   * @returns New ApiError instance with status code 401.
   */
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  /**
   * Creates a 403 Forbidden error.
   * @param message - Error message to send to client.
   * @returns New ApiError instance with status code 403.
   */
  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  /**
   * Creates a 404 Not Found error.
   * @param message - Error message to send to client.
   * @returns New ApiError instance with status code 404.
   */
  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  /**
   * Creates a 409 Conflict error.
   * @param message - Error message to send to client.
   * @returns New ApiError instance with status code 409.
   */
  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }

  /**
   * Creates a 429 Too Many Requests error.
   * @param message - Error message to send to client.
   * @returns New ApiError instance with status code 429.
   */
  static tooManyRequests(message = "Too many requests") {
    return new ApiError(429, message);
  }

  /**
   * Creates a 500 Internal Server Error. Marked as non-operational.
   * @param message - Error message to send to client.
   * @returns New ApiError instance with status code 500 and isOperational=false.
   */
  static internal(message = "Internal server error") {
    return new ApiError(500, message, undefined, false);
  }
}
