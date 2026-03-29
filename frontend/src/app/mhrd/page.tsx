/**
 * @file page.tsx
 * @description MHRD Projects page — Ministry of Education initiatives, community development grants, and Unnat Bharat Abhiyan details
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Users, BookOpen, TreePine } from "lucide-react";

export const metadata: Metadata = {
  title: "MHRD Projects",
  description:
    "MHRD / Ministry of Education projects and grants at GBN Govt. Polytechnic Nilokheri.",
};

export default function MHRDPage() {
  return (
    <>
      <PageHeader
        title="AICTE / MHRD"
        subtitle="Ministry of Education Initiatives & AICTE Approvals"
        breadcrumbs={[{ label: "AICTE / MHRD" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Official Logos */}
          <div className="flex flex-wrap items-center justify-center gap-10 mb-12">
            <div className="text-center">
              <div className="w-24 h-24 relative mx-auto mb-2">
                <Image src="/images/aicte-logo.png" alt="AICTE" fill className="object-contain" />
              </div>
              <p className="text-xs font-medium text-gray-500">AICTE, New Delhi</p>
            </div>
            <div className="text-center">
              <div className="w-48 h-12 relative mx-auto mb-2">
                <Image src="/images/moe-logo.png" alt="Ministry of Education, Government of India" fill className="object-contain" />
              </div>
              <p className="text-xs font-medium text-gray-500">Ministry of Education</p>
            </div>
          </div>

          {/* Description */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                GBN Govt. Polytechnic is approved by <strong>AICTE, New Delhi</strong> and
                has been selected for various projects and grants under the Ministry of
                Human Resource Development (now Ministry of Education), Government of India.
              </p>
            </CardContent>
          </Card>

          {/* Key Info Cards */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Landmark className="w-5 h-5 text-emerald-600" />
                  </div>
                  MHRD Initiatives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The institute participates in the Community Development through
                  Polytechnics scheme and other MHRD initiatives aimed at
                  strengthening technical education infrastructure and outreach.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <TreePine className="w-5 h-5 text-emerald-600" />
                  </div>
                  Community Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The institute runs community development programs in nearby
                  villages, providing technical training and awareness programs
                  to rural communities.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Key Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Strengthen technical education infrastructure in the region",
                  "Provide skill development and vocational training to rural communities",
                  "Bridge the gap between industry requirements and education",
                  "Promote innovation and entrepreneurship among students",
                  "Facilitate community engagement through outreach programs",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
