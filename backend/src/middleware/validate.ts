/**
 * @file validate.ts
 * @description Generic Zod validation middleware — validates request body, params, and/or query
 *              against provided Zod schemas. Parsed values replace the originals on the request,
 *              ensuring downstream handlers receive typed, validated data.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

/**
 * Configuration object specifying which parts of the request to validate.
 * @interface ValidationSchemas
 */
interface ValidationSchemas {
  /** Zod schema to validate `req.body`. */
  body?: ZodSchema;
  /** Zod schema to validate `req.params`. */
  params?: ZodSchema;
  /** Zod schema to validate `req.query`. */
  query?: ZodSchema;
}

/**
 * Creates an Express middleware that validates request data against Zod schemas.
 * Replaces `req.body`, `req.params`, and/or `req.query` with the parsed (and potentially
 * transformed) values from the schemas.
 * @param schemas - Object containing optional Zod schemas for body, params, and query.
 * @returns Express middleware function.
 * @throws {ZodError} If validation fails, which is caught by the global error handler.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.params) {
      // req.params is readonly in Express 5 — mutate in place instead of replacing
      const parsed = schemas.params.parse(req.params) as Record<string, string>;
      Object.assign(req.params, parsed);
    }
    if (schemas.query) {
      // req.query is readonly in Express 5 — mutate in place instead of replacing
      const parsed = schemas.query.parse(req.query) as Record<string, unknown>;
      Object.assign(req.query, parsed);
    }
    next();
  };
}
