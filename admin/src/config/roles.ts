/**
 * @file roles.ts
 * @description Role-based access control configuration — role labels, colors, section permissions, and access helpers
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import type { Role } from "@/lib/types";

export type Section =
  | "dashboard"
  | "departments"
  | "faculty"
  | "labs"
  | "study-materials"
  | "lesson-plans"
  | "courses"
  | "syllabus"
  | "news"
  | "events"
  | "gallery"
  | "hero-slides"
  | "placement"
  | "achievements"
  | "submissions"
  | "logs"
  | "backup"
  | "mous"
  | "banners"
  | "documents"
  | "users";

const PERMISSIONS: Record<Role, Section[]> = {
  super_admin: [
    "dashboard", "departments", "faculty", "labs", "study-materials",
    "lesson-plans", "courses", "syllabus",
    "news", "events", "gallery", "hero-slides",
    "placement", "achievements", "submissions",
    "logs", "backup", "mous", "banners", "documents", "users",
  ],
  admin: [
    "dashboard", "departments", "faculty", "labs", "study-materials",
    "lesson-plans", "courses", "syllabus",
    "news", "events", "gallery", "hero-slides",
    "placement", "achievements", "submissions",
    "logs", "backup", "mous", "banners", "documents",
  ],
  hod: [
    "dashboard", "departments", "faculty", "labs", "study-materials",
    "lesson-plans", "courses", "syllabus",
  ],
  tpo: [
    "dashboard", "placement", "achievements", "gallery", "events", "news", "banners",
  ],
  media_manager: [
    "dashboard", "gallery", "hero-slides", "news", "banners", "documents",
  ],
  news_editor: [
    "dashboard", "news", "events", "banners", "documents",
  ],
};

export function hasAccess(role: Role, section: Section): boolean {
  return PERMISSIONS[role]?.includes(section) ?? false;
}

export function getAllowedSections(role: Role): Section[] {
  return PERMISSIONS[role] ?? [];
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  hod: "Head of Department",
  tpo: "TPO",
  media_manager: "Media Manager",
  news_editor: "News Editor",
};

export const ROLE_COLORS: Record<Role, string> = {
  super_admin: "bg-rose-600 text-white",
  admin: "bg-emerald-700 text-white",
  hod: "bg-teal-100 text-teal-800",
  tpo: "bg-emerald-100 text-emerald-800",
  media_manager: "bg-purple-100 text-purple-800",
  news_editor: "bg-amber-100 text-amber-800",
};
