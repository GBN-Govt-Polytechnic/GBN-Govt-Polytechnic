/**
 * @file documents.controller.ts
 * @description Public document request handlers — delegates to documents.service and logs audit events.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import type { Request, Response } from "express";
import * as documentsService from "./documents.service";
import * as apiResponse from "@/utils/api-response";
import * as auditService from "@/services/audit.service";
import type { CreateDocumentInput, UpdateDocumentInput } from "./documents.schema";

/**
 * Lists all active public documents (public route).
 * @param _req - Express request (unused).
 * @param res - Express response object.
 * @returns JSON array of public document records.
 */
export async function getAll(_req: Request, res: Response) {
  const docs = await documentsService.list();
  return apiResponse.success(res, docs);
}

/**
 * Lists all public documents including inactive (admin route).
 * @param _req - Express request (unused).
 * @param res - Express response object.
 * @returns JSON array of all document records.
 */
export async function getAllAdmin(_req: Request, res: Response) {
  const docs = await documentsService.listAll();
  return apiResponse.success(res, docs);
}

/**
 * Retrieves a single document by its UUID.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns JSON document record.
 */
export async function getById(req: Request, res: Response) {
  const doc = await documentsService.findById(req.params.id);
  return apiResponse.success(res, doc);
}

/**
 * Creates a new public document with PDF upload and logs the audit event.
 * @param req - Express request with CreateDocumentInput body and required PDF file.
 * @param res - Express response object.
 * @returns 201 JSON with the newly created document record.
 */
export async function create(req: Request, res: Response) {
  const doc = await documentsService.create(req.body as CreateDocumentInput, req.file);

  auditService.log({
    action: "CREATE",
    entityType: "PublicDocument",
    entityId: doc.id,
    adminId: req.user!.id,
    after: doc,
    req,
  });

  return apiResponse.created(res, doc);
}

/**
 * Updates an existing public document with optional file replacement and logs the audit event.
 * @param req - Express request with id param, UpdateDocumentInput body, and optional PDF.
 * @param res - Express response object.
 * @returns JSON with the updated document record.
 */
export async function update(req: Request, res: Response) {
  const doc = await documentsService.update(req.params.id, req.body as UpdateDocumentInput, req.file);

  auditService.log({
    action: "UPDATE",
    entityType: "PublicDocument",
    entityId: doc.id,
    adminId: req.user!.id,
    after: doc,
    req,
  });

  return apiResponse.success(res, doc);
}

/**
 * Permanently deletes a public document and logs the audit event.
 * @param req - Express request with id route param.
 * @param res - Express response object.
 * @returns 204 No Content on success.
 */
export async function remove(req: Request, res: Response) {
  await documentsService.remove(req.params.id);

  auditService.log({
    action: "DELETE",
    entityType: "PublicDocument",
    entityId: req.params.id,
    adminId: req.user!.id,
    req,
  });

  return apiResponse.noContent(res);
}
