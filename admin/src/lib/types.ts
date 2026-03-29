/**
 * @file types.ts
 * @description Shared TypeScript types — User, Role, and domain model interfaces for all admin resources
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
// ─── Roles ───
export type Role = "super_admin" | "admin" | "hod" | "media_manager" | "news_editor" | "tpo";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string;   // UUID — only for HOD/TPO
  departmentSlug?: string; // slug — only for HOD/TPO
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

// ─── Departments ───
export interface Department {
  id: string;
  name: string;
  slug: string;
  code: string;
  hodName?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Faculty ───
export interface Faculty {
  id: string;
  departmentId: string;
  department?: { name: string; code: string };
  name: string;
  designation: string;
  qualification: string;
  specialization?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  experience?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Labs ───
export interface Lab {
  id: string;
  departmentId: string;
  name: string;
  description?: string;
  equipment?: string;
  incharge?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Content Status ───
export type ContentStatus = "published" | "draft" | "archived";

// ─── Study Materials / Lesson Plans ───
export interface StudyMaterial {
  id: string;
  departmentId: string;
  title: string;
  subject: string;
  semester: number;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  description?: string;
  status: ContentStatus;
  createdAt: string;
}

export interface LessonPlan {
  id: string;
  departmentId: string;
  subject: string;
  faculty: string;
  semester: number;
  session: string;
  fileUrl: string;
  uploadedBy: string;
  description?: string;
  status: ContentStatus;
  createdAt: string;
}

// ─── Courses / Syllabus / Timetables ───
export interface Course {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  semester: number;
  credits?: number;
  type?: "theory" | "practical" | "elective";
  description?: string;
  createdAt: string;
}

export interface Syllabus {
  id: string;
  departmentId: string;
  title: string;
  session: string;
  fileUrl: string;
  createdAt: string;
}

export interface Timetable {
  id: string;
  departmentId: string;
  title: string;
  semester: number;
  session: string;
  fileUrl: string;
  createdAt: string;
}

// ─── News / Events ───

export interface NewsNotice {
  id: string;
  title: string;
  content: string;
  category: "news" | "notice" | "circular" | "tender" | "event";
  status: ContentStatus;
  publishDate: string;
  attachmentUrl?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location?: string;
  imageUrl?: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Gallery ───
export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { images: number };
}

export interface GalleryImage {
  id: string;
  albumId: string;
  imageUrl: string;
  imageFileName?: string;
  imageMimeType?: string;
  caption?: string;
  order: number;
  createdAt: string;
}

// ─── Hero Slides ───
export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// ─── Placement ───
export interface PlacementCompany {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  website?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PlacementRecord {
  id: string;
  departmentId: string;
  sessionId: string;
  studentsPlaced: number;
  totalStudents: number;
  companiesVisited: number;
  highestPackage?: number;
  averagePackage?: number;
  department?: { id: string; name: string; code: string };
  session?: { id: string; name: string };
  createdAt: string;
}

export interface PlacementActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "drive" | "workshop" | "seminar" | "mock_interview";
  imageUrl?: string;
  createdAt: string;
}

// ─── Form Submissions ───
export type SubmissionType = "CONTACT" | "COMPLAINT";
export type SubmissionStatus = "NEW" | "READ" | "RESPONDED";

export interface Submission {
  id: string;
  type: SubmissionType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Audit Log ───
export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";

export interface AuditLogEntry {
  id: string;
  adminId: string;
  admin: { id: string; name: string; email: string };
  action: AuditAction;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

// ─── Public Documents ───
export type PublicDocumentCategory =
  | "APPROVAL"
  | "MANDATORY_DISCLOSURE"
  | "FEE_STRUCTURE"
  | "RTI"
  | "ANNUAL_REPORT"
  | "COMMITTEE"
  | "GOVT_ORDER"
  | "OTHER";

export interface PublicDocument {
  id: string;
  title: string;
  category: PublicDocumentCategory;
  year: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard Stats ───
export interface DashboardStats {
  departments: number;
  faculty: number;
  news: number;
  events: number;
  courses: number;
  pendingContacts: number;
  pendingComplaints: number;
  pendingSubmissions: number;
}
