/**
 * @file api-response.ts
 * @description Standardized API response builders — provides consistent JSON response
 *              shapes for success, created, paginated, and no-content responses.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Response } from "express";

/**
 * Pagination metadata included in paginated list responses.
 * @interface PaginationMeta
 */
interface PaginationMeta {
  /** Current page number (1-based). */
  page: number;
  /** Number of items per page. */
  limit: number;
  /** Total number of matching items across all pages. */
  total: number;
  /** Total number of pages. */
  totalPages: number;
}

/**
 * Sends a standardized success JSON response.
 * @param res - Express response object.
 * @param data - Response payload data.
 * @param statusCode - HTTP status code. Defaults to 200.
 * @returns Express response with `{ success: true, data }` body.
 */
export function success(res: Response, data: unknown, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

/**
 * Sends a 201 Created JSON response.
 * @param res - Express response object.
 * @param data - The newly created resource data.
 * @returns Express response with `{ success: true, data }` body and 201 status.
 */
export function created(res: Response, data: unknown) {
  return res.status(201).json({ success: true, data });
}

/**
 * Sends a paginated JSON response with data and pagination metadata.
 * @param res - Express response object.
 * @param data - Array of items for the current page.
 * @param meta - Pagination metadata (page, limit, total, totalPages).
 * @returns Express response with `{ success: true, data, meta }` body.
 */
export function paginated(res: Response, data: unknown, meta: PaginationMeta) {
  return res.status(200).json({ success: true, data, meta });
}

/**
 * Sends a 204 No Content response with an empty body.
 * Typically used after successful DELETE operations.
 * @param res - Express response object.
 * @returns Express response with 204 status and no body.
 */
export function noContent(res: Response) {
  return res.status(204).send();
}
