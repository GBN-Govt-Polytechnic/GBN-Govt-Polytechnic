/**
 * @file sitemap.ts
 * @description SEO sitemap generator — produces /sitemap.xml with all public routes and department pages
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import type { MetadataRoute } from "next";
import { departments, siteConfig } from "@/lib/config";

const BASE = siteConfig.website;

/** All static routes with their SEO priority and change frequency */
const staticRoutes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  // Homepage
  { path: "/", changeFrequency: "daily", priority: 1.0 },

  // Top-level destinations
  { path: "/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/academics", changeFrequency: "monthly", priority: 0.9 },
  { path: "/departments", changeFrequency: "monthly", priority: 0.9 },
  { path: "/placement", changeFrequency: "monthly", priority: 0.9 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.9 },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/admissions", changeFrequency: "monthly", priority: 0.9 },

  // About sub-pages
  { path: "/about/principal", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/infrastructure", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/green-campus", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/location", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/mandatory-disclosure", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/iqac", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/nep", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/achievements", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/mou", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mhrd", changeFrequency: "monthly", priority: 0.7 },

  // Academics sub-pages
  { path: "/academics/courses", changeFrequency: "monthly", priority: 0.7 },
  { path: "/academics/scholarships", changeFrequency: "monthly", priority: 0.7 },
  { path: "/academics/results", changeFrequency: "weekly", priority: 0.7 },
  { path: "/academics/resources", changeFrequency: "monthly", priority: 0.7 },

  // Placement sub-pages
  { path: "/placement/apprenticeship", changeFrequency: "monthly", priority: 0.7 },

  // Campus & committees
  { path: "/campus/ncc", changeFrequency: "monthly", priority: 0.5 },
  { path: "/campus/innovation", changeFrequency: "monthly", priority: 0.5 },
  { path: "/committees/anti-ragging", changeFrequency: "monthly", priority: 0.5 },
  { path: "/committees/grievance", changeFrequency: "monthly", priority: 0.5 },
  { path: "/committees/sc-st", changeFrequency: "monthly", priority: 0.5 },
  { path: "/committees/discipline", changeFrequency: "monthly", priority: 0.5 },
  { path: "/committees/icc", changeFrequency: "monthly", priority: 0.5 },
  { path: "/rules/code-of-conduct", changeFrequency: "monthly", priority: 0.5 },

  // Services & utility
  { path: "/contact/helpline", changeFrequency: "monthly", priority: 0.5 },
  { path: "/services/faculty", changeFrequency: "monthly", priority: 0.5 },
  { path: "/services/students", changeFrequency: "monthly", priority: 0.5 },
  { path: "/feedback", changeFrequency: "monthly", priority: 0.5 },
  { path: "/site-map", changeFrequency: "monthly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Set to current build/request time; update to per-record timestamps when API integration is available
  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Department pages (generated from config)
  const departmentPages: MetadataRoute.Sitemap = departments.map((dept) => ({
    url: `${BASE}/departments/${dept.code}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...pages, ...departmentPages];
}
