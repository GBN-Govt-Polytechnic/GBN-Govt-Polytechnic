/**
 * @file page.tsx
 * @description Online Learning Resources page — links to SWAYAM, MOOC, NPTEL, and other learning portals available to students
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, MonitorPlay, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Online Learning Resources",
  description:
    "Online learning portals and resources available for students at GBN Govt. Polytechnic Nilokheri — SWAYAM, MOOC, NPTEL.",
};

const portals: {
  name: string;
  description: string;
  detail: string;
  url: string;
  icon: LucideIcon;
  logo?: string;
}[] = [
  {
    name: "SWAYAM",
    description: "Study Webs of Active Learning for Young Aspiring Minds",
    detail:
      "Free online courses offered by UGC/AICTE covering a wide range of subjects from Class 9 to post-graduation. Courses are interactive, taught by the best teachers in India, and available free of cost.",
    url: "https://swayam.gov.in",
    icon: BookOpen,
    logo: "/images/swayam-logo.png",
  },
  {
    name: "SWAYAM PRABHA",
    description: "34 DTH TV channels for quality educational content",
    detail:
      "SWAYAM PRABHA is a group of 34 DTH channels providing high-quality educational content 24/7 using GSAT-15 satellite. Covers engineering, science, humanities, and professional courses — completely free for all students.",
    url: "https://swayamprabha.gov.in",
    icon: MonitorPlay,
  },
  {
    name: "NPTEL",
    description: "National Programme on Technology Enhanced Learning by IITs",
    detail:
      "NPTEL provides e-learning through online web and video courses in engineering, science, and humanities. It is a joint initiative of IITs and IISc, funded by MHRD, Government of India.",
    url: "https://nptel.ac.in",
    icon: GraduationCap,
    logo: "/images/nptel-logo.jpg",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        title="Online Learning Resources"
        subtitle="Empowering Students with Free Digital Learning Platforms"
        breadcrumbs={[
          { label: "Academics", href: "/academics" },
          { label: "Resources" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            GBN Govt. Polytechnic encourages students to leverage government-backed
            online learning platforms for self-paced skill development and academic
            enrichment.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {portals.map((portal) => (
              <Card
                key={portal.name}
                className="hover:shadow-lg transition-shadow group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {portal.logo ? (
                      <div className="w-12 h-12 relative mb-3">
                        <Image src={portal.logo} alt={portal.name} fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                        <portal.icon className="w-6 h-6 text-emerald-600" />
                      </div>
                    )}
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  <CardTitle className="text-xl">{portal.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium text-emerald-700">
                    {portal.description}
                  </p>
                  <p className="text-sm text-gray-600">{portal.detail}</p>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Visit Portal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
