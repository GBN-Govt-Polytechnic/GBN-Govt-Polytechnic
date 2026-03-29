/**
 * @file routes.ts
 * @description Central route registry — mounts all feature routers under their respective
 *              path prefixes. Organized by domain: core, content, academics, placements,
 *              submissions, admin, and additional features.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";

// Feature routers
import authRoutes from "@/features/auth/auth.routes";
import departmentRoutes from "@/features/departments/departments.routes";
import facultyRoutes from "@/features/faculty/faculty.routes";
import userRoutes from "@/features/users/users.routes";
import newsRoutes from "@/features/content/news/news.routes";
import eventRoutes from "@/features/content/events/events.routes";
import galleryRoutes from "@/features/content/gallery/gallery.routes";
import heroSlideRoutes from "@/features/content/hero-slides/hero-slides.routes";
import courseRoutes from "@/features/academics/courses/courses.routes";
import labRoutes from "@/features/academics/labs/labs.routes";
import {
  studyMaterialsRouter,
  lessonPlansRouter,
  syllabusRouter,
  timetablesRouter,
} from "@/features/academics/resources/resources.routes";
import placementRoutes from "@/features/placements/placements.routes";
import submissionRoutes from "@/features/submissions/submissions.routes";
import auditLogRoutes from "@/features/admin/audit-log/audit-log.routes";

import resultRoutes from "@/features/results/results.routes";
import mouRoutes from "@/features/mous/mous.routes";
import achievementRoutes from "@/features/achievements/achievements.routes";
import notificationRoutes from "@/features/notifications/notifications.routes";
import bannerRoutes from "@/features/banners/banners.routes";
import dashboardRoutes from "@/features/dashboard/dashboard.routes";
import sessionRoutes from "@/features/sessions/sessions.routes";
import documentRoutes from "@/features/documents/documents.routes";

/**
 * Central Express router that aggregates all feature-specific routers.
 * Mounted at `/api` in the main application.
 */
const router = Router();

// Core
router.use("/auth", authRoutes);
router.use("/departments", departmentRoutes);
router.use("/faculty", facultyRoutes);
router.use("/users", userRoutes);

// Content
router.use("/news", newsRoutes);
router.use("/events", eventRoutes);
router.use("/gallery", galleryRoutes);
router.use("/hero-slides", heroSlideRoutes);

// Academics
router.use("/courses", courseRoutes);
router.use("/labs", labRoutes);
router.use("/study-materials", studyMaterialsRouter);
router.use("/lesson-plans", lessonPlansRouter);
router.use("/syllabus", syllabusRouter);
router.use("/timetables", timetablesRouter);

// Placements
router.use("/placements", placementRoutes);

// Submissions (public + admin)
router.use("/", submissionRoutes);

// Admin
router.use("/audit-logs", auditLogRoutes);

// New features

router.use("/results", resultRoutes);
router.use("/mous", mouRoutes);
router.use("/achievements", achievementRoutes);
router.use("/notifications", notificationRoutes);
router.use("/banners", bannerRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/sessions", sessionRoutes);
router.use("/documents", documentRoutes);

export default router;
