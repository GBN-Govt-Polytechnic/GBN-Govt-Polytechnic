/**
 * @file page.tsx
 * @description IQAC page — Internal Quality Assurance Cell objectives, functions, and committee members
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Target,
  Star,
  GraduationCap,
  MessageSquare,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "IQAC",
  description:
    "Internal Quality Assurance Cell (IQAC) of GBN Govt. Polytechnic Nilokheri — objectives, functions, and committee members.",
};

const objectives = [
  {
    icon: Target,
    title: "Quality Enhancement",
    description:
      "Continuous improvement in academic and administrative processes to uplift the quality of education.",
  },
  {
    icon: Star,
    title: "Best Practices",
    description:
      "Identifying, documenting, and promoting best practices across all functional areas of the institution.",
  },
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    description:
      "Fostering academic excellence through curriculum development, innovative teaching methods, and research.",
  },
  {
    icon: MessageSquare,
    title: "Stakeholder Feedback",
    description:
      "Collecting and analyzing feedback from students, parents, employers, and alumni for continual improvement.",
  },
];

const committeeMembers = [
  { name: "Sh. Jwala Prasad", role: "Chairman" },
  { name: "Sh. Bajinder Sharma", role: "Member" },
  { name: "Sh. Pawan Kumar", role: "Member" },
  { name: "Sh. Sunil Dahiya", role: "Member" },
];

export default function IQACPage() {
  return (
    <>
      <PageHeader
        title="IQAC"
        subtitle="Internal Quality Assurance Cell"
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "IQAC" },
        ]}
      />

      <section className="container mx-auto px-4 py-12 space-y-12">
        {/* About IQAC */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2.5">
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
              </div>
              <CardTitle className="text-xl">About IQAC</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              The Internal Quality Assurance Cell (IQAC) is established to
              develop a quality system for conscious, consistent and catalytic
              improvement in the overall performance of the institution. It
              channelizes all efforts and measures of the institution towards
              promoting holistic academic excellence.
            </p>
          </CardContent>
        </Card>

        {/* Objectives */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Objectives</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {objectives.map((obj) => {
              const Icon = obj.icon;
              return (
                <Card key={obj.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-100 p-2.5">
                        <Icon className="h-5 w-5 text-emerald-700" />
                      </div>
                      <CardTitle className="text-lg">{obj.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {obj.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Committee Members */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Committee Members</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {committeeMembers.map((member) => (
              <Card key={member.name} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center gap-3 py-8">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <Users className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <Badge variant="secondary" className="mt-1">
                      {member.role}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
