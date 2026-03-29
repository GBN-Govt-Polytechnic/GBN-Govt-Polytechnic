/**
 * @file page.tsx
 * @description Sitemap page — visual, human-readable overview of all site pages organized by section
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { departments } from "@/lib/config";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Complete sitemap of GBN Govt. Polytechnic Nilokheri website — browse all pages organized by section.",
};

type SitemapSection = {
  title: string;
  links: { label: string; href: string }[];
};

const sections: SitemapSection[] = [
  {
    title: "Main Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Academics", href: "/academics" },
      { label: "Departments", href: "/departments" },
      { label: "Placement", href: "/placement" },
      { label: "Gallery", href: "/gallery" },
      { label: "News & Notices", href: "/news" },
      { label: "Contact Us", href: "/contact" },
      { label: "Admissions", href: "/admissions" },
    ],
  },
  {
    title: "About the Institute",
    links: [
      { label: "History & Vision", href: "/about" },
      { label: "Principal's Desk", href: "/about/principal" },
      { label: "Infrastructure", href: "/about/infrastructure" },
      { label: "Green Campus", href: "/about/green-campus" },
      { label: "Location & Map", href: "/about/location" },
      { label: "Mandatory Disclosure", href: "/about/mandatory-disclosure" },
      { label: "AICTE / MHRD", href: "/mhrd" },
      { label: "IQAC", href: "/about/iqac" },
      { label: "NEP 2020", href: "/about/nep" },
      { label: "Achievements", href: "/about/achievements" },
      { label: "MoU with Industries", href: "/about/mou" },
    ],
  },
  {
    title: "Academics",
    links: [
      { label: "Courses Offered", href: "/academics/courses" },
      { label: "Admissions", href: "/admissions" },
      { label: "Scholarships", href: "/academics/scholarships" },
      { label: "Results", href: "/academics/results" },
      { label: "Online Resources", href: "/academics/resources" },
    ],
  },
  {
    title: "Departments",
    links: departments.map((dept) => ({
      label: `${dept.name} (${dept.shortName})`,
      href: `/departments/${dept.code}`,
    })),
  },
  {
    title: "Placement & Career",
    links: [
      { label: "Placement Overview", href: "/placement" },
      { label: "Apprenticeship", href: "/placement/apprenticeship" },
    ],
  },
  {
    title: "Campus Life & Committees",
    links: [
      { label: "Gallery", href: "/gallery" },
      { label: "NCC", href: "/campus/ncc" },
      { label: "Innovation Club", href: "/campus/innovation" },
      { label: "Anti-Ragging Committee", href: "/committees/anti-ragging" },
      { label: "Grievance Cell", href: "/committees/grievance" },
      { label: "SC/ST Committee", href: "/committees/sc-st" },
      { label: "Discipline Committee", href: "/committees/discipline" },
      { label: "Internal Complaints Committee", href: "/committees/icc" },
      { label: "Code of Conduct", href: "/rules/code-of-conduct" },
    ],
  },
  {
    title: "Services & Support",
    links: [
      { label: "Helpline", href: "/contact/helpline" },
      { label: "Faculty E-Services", href: "/services/faculty" },
      { label: "Student E-Services", href: "/services/students" },
      { label: "Feedback", href: "/feedback" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <PageHeader
        title="Sitemap"
        subtitle="Browse all pages on the GBN Polytechnic website"
        breadcrumbs={[{ label: "Sitemap" }]}
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
