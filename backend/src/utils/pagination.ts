/**
 * @file pagination.ts
 * @description Pagination helper — parses query string parameters into Prisma-compatible
 *              skip/take values and builds pagination metadata for responses.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { PAGINATION } from "@/config/constants";

/**
 * Parses page and limit from query parameters, clamping values to configured bounds.
 * @param query - Express query object containing optional `page` and `limit` fields.
 * @returns Object with `skip`, `take`, `page`, and `limit` values ready for Prisma queries.
 */
export function parsePagination(query: Record<string, unknown>) {
  let page = Number(query.page) || PAGINATION.DEFAULT_PAGE;
  let limit = Number(query.limit) || PAGINATION.DEFAULT_LIMIT;

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  return { skip: (page - 1) * limit, take: limit, page, limit };
}

/**
 * Builds pagination metadata for inclusion in paginated API responses.
 * @param total - Total number of matching records in the database.
 * @param page - Current page number (1-based).
 * @param limit - Number of items per page.
 * @returns Pagination metadata object with page, limit, total, and totalPages.
 */
export function buildPaginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
