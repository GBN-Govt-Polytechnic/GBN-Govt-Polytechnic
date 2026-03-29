/**
 * @file constants.ts
 * @description Application constants — department list, semester values, news categories, and placement activity types
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
export const APP_NAME = "GBN Admin";
export const APP_DESCRIPTION = "CMS Admin Panel — GBN Govt. Polytechnic, Nilokheri";

export const DEPARTMENTS = [
  { name: "Computer Science & Engineering", slug: "cse", code: "CSE" },
  { name: "Electronics & Communication Engineering", slug: "ece", code: "ECE" },
  { name: "Electrical Engineering", slug: "ee", code: "EE" },
  { name: "Civil Engineering", slug: "ce", code: "CE" },
  { name: "Mechanical Engineering", slug: "me", code: "ME" },
  { name: "Instrumentation & Control Engineering", slug: "ice", code: "ICE" },
  { name: "Applied Science", slug: "as", code: "AS" },
] as const;

export const SEMESTERS = ["1", "2", "3", "4", "5", "6"] as const;

/** Backend Prisma enum values — must be UPPERCASE to match NewsCategory enum */
export const NEWS_CATEGORIES = [
  { label: "News", value: "NEWS" },
  { label: "Notice", value: "NOTICE" },
  { label: "Circular", value: "CIRCULAR" },
  { label: "Tender", value: "TENDER" },
  { label: "Event", value: "EVENT" },
] as const;

/** Backend Prisma enum values — must be UPPERCASE to match PlacementActivityType enum */
export const PLACEMENT_ACTIVITY_TYPES = [
  { label: "Placement Drive", value: "DRIVE" },
  { label: "Workshop", value: "WORKSHOP" },
  { label: "Seminar", value: "SEMINAR" },
  { label: "Mock Interview", value: "MOCK_INTERVIEW" },
] as const;

/** Backend Prisma enum values — must be UPPERCASE to match ContentStatus enum */
export const CONTENT_STATUSES = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
] as const;

/** Backend Prisma enum values — must be UPPERCASE to match InquiryStatus enum */
export const SUBMISSION_STATUSES = [
  { label: "New", value: "NEW" },
  { label: "Read", value: "READ" },
  { label: "Responded", value: "RESPONDED" },
] as const;
