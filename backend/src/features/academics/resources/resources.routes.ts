/**
 * @file resources.routes.ts
 * @description Resource route definitions — study materials, lesson plans, syllabus, and timetables with department-scoped access.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Router } from "express";
import * as controller from "./resources.controller";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { documentUpload } from "@/middleware/upload";
import {
  createStudyMaterialSchema,
  updateStudyMaterialSchema,
  createLessonPlanSchema,
  updateLessonPlanSchema,
  createSyllabusSchema,
  updateSyllabusSchema,
  createTimetableSchema,
  updateTimetableSchema,
  resourceQuerySchema,
  resourceIdParam,
} from "./resources.schema";
import { requireDepartmentScope } from "@/middleware/department-scope";
import { strictLimiter } from "@/middleware/rate-limit";

const writerRoles = ["SUPER_ADMIN", "ADMIN", "HOD"] as const;
const deleteRoles = ["SUPER_ADMIN", "ADMIN", "HOD"] as const;

// ---------------------------------------------------------------------------
// Study Materials Router
// ---------------------------------------------------------------------------

/** Study material routes — public listing and department-scoped admin CRUD with file uploads. */
export const studyMaterialsRouter = Router();

studyMaterialsRouter.get(
  "/",
  validate({ query: resourceQuerySchema }),
  controller.getAllStudyMaterials,
);
studyMaterialsRouter.get(
  "/:id",
  validate({ params: resourceIdParam }),
  controller.getStudyMaterialById,
);
studyMaterialsRouter.post(
  "/",
  authenticate,
  requireRole(...writerRoles),
  strictLimiter,
  requireDepartmentScope(),
  documentUpload.single("file"),
  validate({ body: createStudyMaterialSchema }),
  controller.createStudyMaterial,
);
studyMaterialsRouter.put(
  "/:id",
  authenticate,
  requireRole(...writerRoles),
  strictLimiter,
  requireDepartmentScope(),
  documentUpload.single("file"),
  validate({ params: resourceIdParam, body: updateStudyMaterialSchema }),
  controller.updateStudyMaterial,
);
studyMaterialsRouter.delete(
  "/:id",
  authenticate,
  requireRole(...deleteRoles),
  validate({ params: resourceIdParam }),
  controller.removeStudyMaterial,
);

// ---------------------------------------------------------------------------
// Lesson Plans Router
// ---------------------------------------------------------------------------

/** Lesson plan routes — public listing and department-scoped admin CRUD with file uploads. */
export const lessonPlansRouter = Router();

lessonPlansRouter.get(
  "/",
  validate({ query: resourceQuerySchema }),
  controller.getAllLessonPlans,
);
lessonPlansRouter.get(
  "/:id",
  validate({ params: resourceIdParam }),
  controller.getLessonPlanById,
);
lessonPlansRouter.post(
  "/",
  authenticate,
  requireRole(...writerRoles),
  strictLimiter,
  requireDepartmentScope(),
  documentUpload.single("file"),
  validate({ body: createLessonPlanSchema }),
  controller.createLessonPlan,
);
lessonPlansRouter.put(
  "/:id",
  authenticate,
  requireRole(...writerRoles),
  strictLimiter,
  requireDepartmentScope(),
  documentUpload.single("file"),
  validate({ params: resourceIdParam, body: updateLessonPlanSchema }),
  controller.updateLessonPlan,
);
lessonPlansRouter.delete(
  "/:id",
  authenticate,
  requireRole(...deleteRoles),
  validate({ params: resourceIdParam }),
  controller.removeLessonPlan,
);

// ---------------------------------------------------------------------------
// Syllabus Router
// ---------------------------------------------------------------------------

/** Syllabus routes — public listing and department-scoped admin CRUD with file uploads. */
export const syllabusRouter = Router();

syllabusRouter.get(
  "/",
  validate({ query: resourceQuerySchema }),
  controller.getAllSyllabus,
);
syllabusRouter.get(
  "/:id",
  validate({ params: resourceIdParam }),
  controller.getSyllabusById,
);
syllabusRouter.post(
  "/",
  authenticate,
  requireRole(...writerRoles),
  strictLimiter,
  requireDepartmentScope(),
  documentUpload.single("file"),
  validate({ body: createSyllabusSchema }),
  controller.createSyllabus,
);
syllabusRouter.put(
  "/:id",
  authenticate,
  requireRole(...writerRoles),
  strictLimiter,
  requireDepartmentScope(),
  documentUpload.single("file"),
  validate({ params: resourceIdParam, body: updateSyllabusSchema }),
  controller.updateSyllabus,
);
syllabusRouter.delete(
  "/:id",
  authenticate,
  requireRole(...deleteRoles),
  validate({ params: resourceIdParam }),
  controller.removeSyllabus,
);

// ---------------------------------------------------------------------------
// Timetables Router
// ---------------------------------------------------------------------------

/** Timetable routes — public listing and department-scoped admin CRUD with file uploads. */
export const timetablesRouter = Router();

timetablesRouter.get(
  "/",
  validate({ query: resourceQuerySchema }),
  controller.getAllTimetables,
);
timetablesRouter.get(
  "/:id",
  validate({ params: resourceIdParam }),
  controller.getTimetableById,
);
timetablesRouter.post(
  "/",
  authenticate,
  requireRole(...writerRoles),
  strictLimiter,
  requireDepartmentScope(),
  documentUpload.single("file"),
  validate({ body: createTimetableSchema }),
  controller.createTimetable,
);
timetablesRouter.put(
  "/:id",
  authenticate,
  requireRole(...writerRoles),
  strictLimiter,
  requireDepartmentScope(),
  documentUpload.single("file"),
  validate({ params: resourceIdParam, body: updateTimetableSchema }),
  controller.updateTimetable,
);
timetablesRouter.delete(
  "/:id",
  authenticate,
  requireRole(...deleteRoles),
  validate({ params: resourceIdParam }),
  controller.removeTimetable,
);
