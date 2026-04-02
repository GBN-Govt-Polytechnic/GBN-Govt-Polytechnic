/**
 * @file users.routes.ts
 * @description User management route definitions — SUPER_ADMIN-only CRUD for CMS admin users
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./users.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import {
	createUserSchema,
	updateUserSchema,
	resetUserPasswordSchema,
	userIdParam,
	userQuerySchema,
} from "./users.schema";
import { strictLimiter, authLimiter } from "@/middleware/rate-limit";

/** User management routes — list, get, create, update, and delete admin users (SUPER_ADMIN only). */
const router = Router();

router.use(authenticate, requireRole("SUPER_ADMIN"));

router.get("/", validate({ query: userQuerySchema }), controller.getAll);
router.get("/:id", validate({ params: userIdParam }), controller.getById);
router.post("/", strictLimiter, validate({ body: createUserSchema }), controller.create);
router.put("/:id", strictLimiter, validate({ params: userIdParam, body: updateUserSchema }), controller.update);
router.put(
	"/:id/password",
	strictLimiter,
	validate({ params: userIdParam, body: resetUserPasswordSchema }),
	controller.resetPassword,
);
router.delete("/:id", authLimiter, validate({ params: userIdParam }), controller.remove);

export default router;
