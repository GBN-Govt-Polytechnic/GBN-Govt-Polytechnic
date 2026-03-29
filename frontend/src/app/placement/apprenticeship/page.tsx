/**
 * @file page.tsx
 * @description Apprenticeship page — National Apprenticeship Promotion Scheme (NAPS) benefits, eligibility, and registration details
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  IndianRupee,
  GraduationCap,
  Wrench,
  ExternalLink,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Apprenticeship",
  description:
    "National Apprenticeship Promotion Scheme (NAPS) at GBN Govt. Polytechnic Nilokheri — hands-on industry training for diploma students.",
};

const benefits = [
  {
    icon: Briefcase,
    title: "Industry Training",
    description:
      "Students gain practical, hands-on experience by working directly with industry professionals in real workplaces.",
  },
  {
    icon: IndianRupee,
    title: "Monthly Stipend",
    description:
      "Apprentices receive a monthly stipend as per government norms throughout the training period.",
  },
  {
    icon: GraduationCap,
    title: "Employment Opportunities",
    description:
      "Apprenticeship experience significantly improves job prospects and opens doors to permanent employment.",
  },
  {
    icon: Wrench,
    title: "Skill Development",
    description:
      "Bridge the gap between theoretical knowledge and practical skills required by the industry.",
  },
];

export default function ApprenticeshipPage() {
  return (
    <>
      <PageHeader
        title="Apprenticeship"
        subtitle="National Apprenticeship Promotion Scheme (NAPS)"
        breadcrumbs={[
          { label: "Placement", href: "/placement" },
          { label: "Apprenticeship" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Description */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-gray-600 text-lg leading-relaxed">
              GBN Govt. Polytechnic participates in the National Apprenticeship
              Promotion Scheme (NAPS) to provide students with hands-on industry
              training during and after their diploma.
            </p>
          </div>

          {/* Key Info Card */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 flex gap-4 items-start">
              <Info className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">
                  Students are enrolled as apprentices at industries and receive a
                  monthly stipend as per government norms.
                </p>
                <p className="text-gray-600 text-sm">
                  Register at{" "}
                  <a
                    href="https://www.apprenticeshipindia.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                  >
                    www.apprenticeshipindia.gov.in
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Benefits of Apprenticeship
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <b.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {b.title}
                    </h3>
                    <p className="text-sm text-gray-600">{b.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Portal Link */}
          <div className="mt-12 text-center">
            <a
              href="https://www.apprenticeshipindia.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Register on Apprenticeship Portal
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
