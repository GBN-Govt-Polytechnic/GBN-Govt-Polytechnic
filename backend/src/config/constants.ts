/**
 * @file constants.ts
 * @description App-wide constants — roles, statuses, file upload limits, department definitions,
 *              pagination defaults, and site setting keys. Mirrors Prisma enums for use in
 *              Zod schemas and middleware without importing from the generated client.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

// ---------------------------------------------------------------------------
// Enums (mirror Prisma enums for use in Zod schemas & middleware)
// ---------------------------------------------------------------------------

/**
 * Administrative user roles mirroring the Prisma AdminRole enum.
 * Used for role-based access control throughout the application.
 */
export const AdminRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  HOD: "HOD",
  TPO: "TPO",
  MEDIA_MANAGER: "MEDIA_MANAGER",
  NEWS_EDITOR: "NEWS_EDITOR",
} as const;
/** Union type of all possible admin role string values. */
export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];

/**
 * Content publication statuses mirroring the Prisma ContentStatus enum.
 */
export const ContentStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
/** Union type of all possible content status string values. */
export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];

/**
 * News and notice category types mirroring the Prisma NewsCategory enum.
 */
export const NewsCategory = {
  NEWS: "NEWS",
  NOTICE: "NOTICE",
  CIRCULAR: "CIRCULAR",
  TENDER: "TENDER",
  EVENT: "EVENT",
} as const;
/** Union type of all possible news category string values. */
export type NewsCategory = (typeof NewsCategory)[keyof typeof NewsCategory];

/**
 * Course classification types mirroring the Prisma CourseType enum.
 */
export const CourseType = {
  THEORY: "THEORY",
  PRACTICAL: "PRACTICAL",
  ELECTIVE: "ELECTIVE",
} as const;
/** Union type of all possible course type string values. */
export type CourseType = (typeof CourseType)[keyof typeof CourseType];

/**
 * Placement activity types mirroring the Prisma PlacementActivityType enum.
 */
export const PlacementActivityType = {
  DRIVE: "DRIVE",
  WORKSHOP: "WORKSHOP",
  SEMINAR: "SEMINAR",
  MOCK_INTERVIEW: "MOCK_INTERVIEW",
} as const;
/** Union type of all possible placement activity type string values. */
export type PlacementActivityType =
  (typeof PlacementActivityType)[keyof typeof PlacementActivityType];

/**
 * Contact inquiry lifecycle statuses mirroring the Prisma InquiryStatus enum.
 */
export const InquiryStatus = {
  NEW: "NEW",
  READ: "READ",
  RESPONDED: "RESPONDED",
} as const;
/** Union type of all possible inquiry status string values. */
export type InquiryStatus = (typeof InquiryStatus)[keyof typeof InquiryStatus];

/**
 * Registration approval statuses mirroring the Prisma RegistrationStatus enum.
 */
export const RegistrationStatus = {
  NEW: "NEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
/** Union type of all possible registration status string values. */
export type RegistrationStatus =
  (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

/**
 * Audit log action types mirroring the Prisma AuditAction enum.
 */
export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
} as const;
/** Union type of all possible audit action string values. */
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

/**
 * Notification recipient types mirroring the Prisma RecipientType enum.
 */
export const RecipientType = {
  STUDENT: "STUDENT",
  ALUMNI: "ALUMNI",
  ADMIN_USER: "ADMIN_USER",
} as const;
/** Union type of all possible recipient type string values. */
export type RecipientType = (typeof RecipientType)[keyof typeof RecipientType];

/**
 * Database backup job statuses mirroring the Prisma BackupStatus enum.
 */
export const BackupStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;
/** Union type of all possible backup status string values. */
export type BackupStatus = (typeof BackupStatus)[keyof typeof BackupStatus];

// ---------------------------------------------------------------------------
// Enum value arrays (for Zod .enum())
// ---------------------------------------------------------------------------

/** Tuple of all admin role values, typed for use with Zod's `.enum()`. */
export const ADMIN_ROLES = Object.values(AdminRole) as [AdminRole, ...AdminRole[]];
/** Tuple of all content status values, typed for use with Zod's `.enum()`. */
export const CONTENT_STATUSES = Object.values(ContentStatus) as [ContentStatus, ...ContentStatus[]];
/** Tuple of all news category values, typed for use with Zod's `.enum()`. */
export const NEWS_CATEGORIES = Object.values(NewsCategory) as [NewsCategory, ...NewsCategory[]];
/** Tuple of all course type values, typed for use with Zod's `.enum()`. */
export const COURSE_TYPES = Object.values(CourseType) as [CourseType, ...CourseType[]];
/** Tuple of all placement activity type values, typed for use with Zod's `.enum()`. */
export const PLACEMENT_ACTIVITY_TYPES = Object.values(PlacementActivityType) as [PlacementActivityType, ...PlacementActivityType[]];
/** Tuple of all inquiry status values, typed for use with Zod's `.enum()`. */
export const INQUIRY_STATUSES = Object.values(InquiryStatus) as [InquiryStatus, ...InquiryStatus[]];
/** Tuple of all registration status values, typed for use with Zod's `.enum()`. */
export const REGISTRATION_STATUSES = Object.values(RegistrationStatus) as [RegistrationStatus, ...RegistrationStatus[]];
/** Tuple of all audit action values, typed for use with Zod's `.enum()`. */
export const AUDIT_ACTIONS = Object.values(AuditAction) as [AuditAction, ...AuditAction[]];
/** Tuple of all recipient type values, typed for use with Zod's `.enum()`. */
export const RECIPIENT_TYPES = Object.values(RecipientType) as [RecipientType, ...RecipientType[]];
/** Tuple of all backup status values, typed for use with Zod's `.enum()`. */
export const BACKUP_STATUSES = Object.values(BackupStatus) as [BackupStatus, ...BackupStatus[]];

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

/**
 * Static list of all departments in GBN Government Polytechnic.
 * Each entry contains the full name, URL slug, and short code.
 */
export const DEPARTMENTS = [
  { name: "Computer Science & Engineering", slug: "cse", code: "CSE" },
  { name: "Electronics & Communication Engineering", slug: "ece", code: "ECE" },
  { name: "Electrical Engineering", slug: "ee", code: "EE" },
  { name: "Civil Engineering", slug: "ce", code: "CE" },
  { name: "Mechanical Engineering", slug: "me", code: "ME" },
  { name: "Instrumentation & Control Engineering", slug: "ice", code: "ICE" },
  { name: "Applied Science", slug: "as", code: "AS" },
] as const;

// ---------------------------------------------------------------------------
// File upload limits
// ---------------------------------------------------------------------------

/**
 * File upload size and MIME type constraints.
 * Used by multer middleware to enforce upload restrictions.
 */
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10 MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100 MB
  MAX_DOCUMENT_SIZE: 20 * 1024 * 1024, // 20 MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/quicktime"],
  ALLOWED_MEDIA_TYPES: [
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/quicktime",
  ],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
} as const;

// ---------------------------------------------------------------------------
// Pagination defaults
// ---------------------------------------------------------------------------

/**
 * Default pagination configuration used across all list endpoints.
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ---------------------------------------------------------------------------
// Default site settings keys
// ---------------------------------------------------------------------------

/**
 * Keys for the key-value site settings store.
 * Used to retrieve and update site-wide configuration from the database.
 */
export const SITE_SETTING_KEYS = {
  SITE_NAME: "site_name",
  SITE_DESCRIPTION: "site_description",
  PHONE: "phone",
  EMAIL: "email",
  ADDRESS: "address",
  PRINCIPAL_NAME: "principal_name",
  PRINCIPAL_MESSAGE: "principal_message",
  FACEBOOK_URL: "facebook_url",
  TWITTER_URL: "twitter_url",
  YOUTUBE_URL: "youtube_url",
  INSTAGRAM_URL: "instagram_url",
} as const;
