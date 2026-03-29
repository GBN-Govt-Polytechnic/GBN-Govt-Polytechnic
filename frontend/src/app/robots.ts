/**
 * @file robots.ts
 * @description Robots.txt configuration — controls search engine crawling behavior
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/developer", "/site-map"],
      },
    ],
    sitemap: `${siteConfig.website}/sitemap.xml`,
  };
}
