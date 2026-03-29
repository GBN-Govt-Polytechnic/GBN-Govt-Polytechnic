/**
 * @file page.tsx
 * @description NEP 2020 page — National Education Policy implementation details including flexible curriculum, multi-disciplinary approach, and skill development
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Layers,
  Wrench,
  Monitor,
  Users,
  ArrowLeftRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "NEP 2020",
  description:
    "National Education Policy 2020 implementation at GBN Govt. Polytechnic Nilokheri — flexible curriculum, multi-disciplinary approach, and skill development.",
};

const keyPoints = [
  {
    icon: BookOpen,
    title: "Flexible Curriculum",
    description:
      "Redesigned curriculum framework allowing students to choose from a wider set of electives and skill-based courses aligned with industry needs.",
  },
  {
    icon: Layers,
    title: "Multi-Disciplinary Approach",
    description:
      "Encouraging cross-departmental learning and integrated programs that combine technical skills with humanities and management.",
  },
  {
    icon: Wrench,
    title: "Skill Development",
    description:
      "Focus on hands-on training, practical workshops, and industry internships to develop employable skills in every student.",
  },
  {
    icon: Monitor,
    title: "Technology Integration",
    description:
      "Adoption of digital tools, smart classrooms, online learning platforms, and ICT-enabled teaching methodologies across all departments.",
  },
];

export default function NEPPage() {
  return (
    <>
      <PageHeader
        title="NEP 2020"
        subtitle="National Education Policy Implementation"
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "NEP 2020" },
        ]}
      />

      <section className="container mx-auto px-4 py-12 space-y-12">
        {/* About NEP */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2.5">
                <BookOpen className="h-6 w-6 text-emerald-700" />
              </div>
              <CardTitle className="text-xl">
                About National Education Policy 2020
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              National Education Policy 2020 aims at making India a global
              knowledge superpower. GBN Govt. Polytechnic is actively
              implementing NEP guidelines to transform the educational experience
              and prepare students for the challenges of the 21st century.
            </p>
          </CardContent>
        </Card>

        {/* Key Points */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Key Focus Areas</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {keyPoints.map((point) => {
              const Icon = point.icon;
              return (
                <Card
                  key={point.title}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-100 p-2.5">
                        <Icon className="h-5 w-5 text-emerald-700" />
                      </div>
                      <CardTitle className="text-lg">{point.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {point.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Highlights */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="flex items-start gap-4 py-6">
              <div className="rounded-lg bg-emerald-100 p-2.5 shrink-0">
                <Users className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Faculty Development
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  All 50+ faculty members registered in NEP Professional
                  Development Program (NEP-PDP) for capacity building and
                  pedagogical training.
                </p>
                <Badge className="mt-3 bg-emerald-600">50+ Faculty Enrolled</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="flex items-start gap-4 py-6">
              <div className="rounded-lg bg-emerald-100 p-2.5 shrink-0">
                <ArrowLeftRight className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Multi-Entry Multi-Exit
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Multi-entry multi-exit framework being implemented, allowing
                  students flexibility to enter and leave programs with
                  appropriate certification at each stage.
                </p>
                <Badge className="mt-3 bg-emerald-600">Framework Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
