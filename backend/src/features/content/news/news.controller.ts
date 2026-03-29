/**
 * @file news.controller.ts
 * @description News and notices request handlers — public listing, slug lookup, and admin CRUD
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as newsService from "./news.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateNewsInput, UpdateNewsInput, NewsQuery } from "./news.schema";

/**
 * Retrieves a paginated list of news items with optional category, status, and search filters.
 * Public visitors only see published items; authenticated users see all statuses.
 * @param req - Express request with NewsQuery params (page, limit, category, status, search).
 * @param res - Express response object.
 * @returns Paginated JSON array of news records.
 */
export async function getAll(req: Request, res: Response) {
  const isPublic = !req.user;
  const { data, meta } = await newsService.list(
    req.query as unknown as NewsQuery,
    isPublic,
  );
  return apiResponse.paginated(res, data, meta);
}

/**
 * Retrieves a single published news item by its URL slug.
 * @param req - Express request with slug in params.
 * @param res - Express response object.
 * @returns JSON with news record.
 * @throws {ApiError} 404 if news item not found or not published.
 */
export async function getBySlug(req: Request, res: Response) {
  const news = await newsService.findBySlug(req.params.slug);
  return apiResponse.success(res, news);
}

/**
 * Retrieves a single news item by its UUID (admin use, includes drafts).
 * @param req - Express request with news ID in params.
 * @param res - Express response object.
 * @returns JSON with news record.
 * @throws {ApiError} 404 if news item not found.
 */
export async function getById(req: Request, res: Response) {
  const news = await newsService.findById(req.params.id);
  return apiResponse.success(res, news);
}

/**
 * Creates a new news item with optional image and attachment uploads, logs to audit trail.
 * @param req - Express request with CreateNewsInput body, optional image/attachment files, and admin context.
 * @param res - Express response object.
 * @returns JSON with the newly created news record (201).
 */
export async function create(req: Request, res: Response) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const imageFile = files?.image?.[0];
  const attachmentFile = files?.attachment?.[0];

  const news = await newsService.create(
    req.body as CreateNewsInput,
    imageFile,
    attachmentFile,
  );

  auditService.log({
    action: "CREATE",
    entityType: "NewsNotice",
    entityId: news.id,
    adminId: req.user!.id,
    after: news,
    req,
  });

  return apiResponse.created(res, news);
}

/**
 * Updates an existing news item with optional new image/attachment, logs to audit trail.
 * @param req - Express request with news ID in params, UpdateNewsInput body, and optional files.
 * @param res - Express response object.
 * @returns JSON with the updated news record.
 * @throws {ApiError} 404 if news item not found.
 */
export async function update(req: Request, res: Response) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const imageFile = files?.image?.[0];
  const attachmentFile = files?.attachment?.[0];

  const news = await newsService.update(
    req.params.id,
    req.body as UpdateNewsInput,
    imageFile,
    attachmentFile,
  );

  auditService.log({
    action: "UPDATE",
    entityType: "NewsNotice",
    entityId: news.id,
    adminId: req.user!.id,
    after: news,
    req,
  });

  return apiResponse.success(res, news);
}

/**
 * Soft-deletes a news item and logs the action to the audit trail.
 * @param req - Express request with news ID in params and authenticated admin context.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 * @throws {ApiError} 404 if news item not found.
 */
export async function remove(req: Request, res: Response) {
  await newsService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "NewsNotice",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
