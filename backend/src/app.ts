/**
 * @file app.ts
 * @description Express application setup — middleware stack configuration.
 *              Configures security headers, CORS, body parsing, rate limiting,
 *              request logging, health check endpoint, API routes, and global error handling.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env } from "@/config/env";
import { globalLimiter } from "@/middleware/rate-limit";
import { errorHandler } from "@/middleware/error-handler";
import routes from "@/routes";

/**
 * Configured Express application instance with the full middleware stack.
 * @remarks Middleware order: trust proxy -> helmet -> CORS -> morgan -> body parsers -> rate limiter -> routes -> error handler.
 */
const app = express();

// Trust first proxy (nginx/load balancer) so req.ip is correct
app.set("trust proxy", 1);

// Security headers with Content-Security-Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", ...(env.STORAGE_PUBLIC_URL ? [env.STORAGE_PUBLIC_URL] : [])],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }),
);

// CORS
app.use(
  cors({
    origin: [env.FRONTEND_URL, env.ADMIN_URL],
    credentials: true,
  }),
);

// Request logging — "short" format in production omits headers to prevent token leakage in logs
app.use(morgan(env.NODE_ENV === "production" ? "short" : "dev"));

// Body parsing — small limit for JSON; file uploads go through multer separately
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));

// Global rate limiter
app.use(globalLimiter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api", routes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
