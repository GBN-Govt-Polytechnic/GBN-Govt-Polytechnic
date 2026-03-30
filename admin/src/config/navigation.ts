/**
 * @file navigation.ts
 * @description Sidebar navigation configuration — defines menu items, icons, routes, and role-based section mappings
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  FlaskConical,
  BookOpen,
  FileText,
  GraduationCap,
  Calendar,
  Newspaper,
  Image,
  SlidersHorizontal,
  Briefcase,
  Trophy,
  Inbox,
  ScrollText,
  Handshake,
  Megaphone,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";
import type { Section } from "./roles";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  section: Section;
  group: "main" | "academic" | "content" | "data" | "system";
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, section: "dashboard", group: "main" },
  { label: "Departments", href: "/departments", icon: Building2, section: "departments", group: "academic" },
  { label: "Faculty", href: "/faculty", icon: Users, section: "faculty", group: "academic" },
  { label: "Labs", href: "/labs", icon: FlaskConical, section: "labs", group: "academic" },
  { label: "Study Materials", href: "/study-materials", icon: BookOpen, section: "study-materials", group: "academic" },
  { label: "Lesson Plans", href: "/lesson-plans", icon: FileText, section: "lesson-plans", group: "academic" },
  { label: "Subjects", href: "/courses", icon: GraduationCap, section: "courses", group: "academic" },
  { label: "Syllabus", href: "/syllabus", icon: Calendar, section: "syllabus", group: "academic" },
  { label: "News & Notices", href: "/news", icon: Newspaper, section: "news", group: "content" },
  { label: "Gallery", href: "/gallery", icon: Image, section: "gallery", group: "content" },
  { label: "Hero Slides", href: "/hero-slides", icon: SlidersHorizontal, section: "hero-slides", group: "content" },
  { label: "Banners", href: "/banners", icon: Megaphone, section: "banners", group: "content" },
  { label: "Placement", href: "/placement", icon: Briefcase, section: "placement", group: "data" },
  { label: "Achievements", href: "/achievements", icon: Trophy, section: "achievements", group: "data" },
  { label: "MoUs", href: "/mous", icon: Handshake, section: "mous", group: "data" },
  { label: "Documents", href: "/documents", icon: FolderOpen, section: "documents", group: "data" },
  { label: "Submissions", href: "/submissions", icon: Inbox, section: "submissions", group: "data" },
  { label: "Users", href: "/users", icon: UserCog, section: "users", group: "system" },
  { label: "Audit Logs", href: "/logs", icon: ScrollText, section: "logs", group: "system" },
];
