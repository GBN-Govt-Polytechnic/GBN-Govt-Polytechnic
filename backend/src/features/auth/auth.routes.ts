/**
 * @file auth.routes.ts
 * @description Auth route definitions — login, refresh, logout, password change, and profile retrieval
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./auth.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { strictLimiter, authLimiter } from "@/middleware/rate-limit";
import { loginSchema, refreshSchema, logoutSchema, changePasswordSchema, registerStudentSchema } from "./auth.schema";

/** Auth routes — login, refresh, logout, password change, profile retrieval, and public registration. */
const router = Router();

router.post("/login", strictLimiter, validate({ body: loginSchema }), controller.login);
router.post("/refresh", authLimiter, validate({ body: refreshSchema }), controller.refreshToken);
router.post("/logout", authLimiter, authenticate, validate({ body: logoutSchema }), controller.logout);
router.put("/change-password", strictLimiter, authenticate, validate({ body: changePasswordSchema }), controller.changePassword);
router.get("/me", authenticate, controller.getMe);

// Public self-registration (rate-limited)
router.post("/register/student", strictLimiter, validate({ body: registerStudentSchema }), controller.registerStudent);
export default router;
