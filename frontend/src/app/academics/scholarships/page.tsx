/**
 * @file page.tsx
 * @description Scholarships page — available scholarship schemes for SC, BC, EWS, and merit students with portal links
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Scholarships",
  description: "Scholarship opportunities available for students at GBN Govt. Polytechnic Nilokheri.",
};

const scholarships = [
  {
    name: "Post Matric Scholarship for SC Students",
    provider: "Govt. of Haryana",
    eligibility: "SC category students",
    benefits: "Full tuition fee waiver + maintenance allowance",
    portal: "https://haryana.gov.in",
  },
  {
    name: "Post Matric Scholarship for BC Students",
    provider: "Govt. of Haryana",
    eligibility: "BC-A / BC-B category students with family income below ₹2.5L",
    benefits: "Tuition fee reimbursement",
    portal: "https://haryana.gov.in",
  },
  {
    name: "Merit-cum-Means Scholarship",
    provider: "AICTE",
    eligibility: "Students with family income < ₹8L per annum",
    benefits: "₹10,000/year for general degree",
    portal: "https://www.aicte-india.org",
  },
  {
    name: "Pragati Scholarship for Girls",
    provider: "AICTE",
    eligibility: "Girl students in technical education (1 per family, max 2 per institution)",
    benefits: "₹50,000/year (tuition + incidentals)",
    portal: "https://www.aicte-india.org",
  },
  {
    name: "Saksham Scholarship",
    provider: "AICTE",
    eligibility: "Differently-abled students (>40% disability)",
    benefits: "₹50,000/year",
    portal: "https://www.aicte-india.org",
  },
  {
    name: "National Scholarship Portal (NSP)",
    provider: "Govt. of India",
    eligibility: "Various categories — SC/ST/OBC/Minority/Merit-based",
    benefits: "Varies by scheme",
    portal: "https://scholarships.gov.in",
  },
];

export default function ScholarshipsPage() {
  return (
    <>
      <PageHeader
        title="Scholarships"
        subtitle="Financial Support to Make Quality Education Accessible"
        breadcrumbs={[
          { label: "Academics", href: "/academics" },
          { label: "Scholarships" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-linear-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white mb-12 text-center">
            <h2 className="text-3xl font-bold mb-2">₹40 Lakhs+</h2>
            <p className="text-emerald-100">Total scholarships disbursed annually to GBN students</p>
          </div>

          <Card className="mb-8 border-l-4 border-l-blue-500 bg-blue-50/50">
            <CardContent className="p-5">
              <h4 className="font-bold text-gray-900 mb-1">How to Apply</h4>
              <p className="text-sm text-gray-600">
                Students should apply through the respective scholarship portals. For assistance,
                contact the college office or the concerned department HOD.
                Ensure all documents are submitted before the deadline.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-5">
            {scholarships.map((s, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{s.name}</h3>
                      <Badge variant="secondary" className="mb-3">{s.provider}</Badge>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400 text-xs uppercase tracking-wider">Eligibility</span>
                          <p className="text-gray-600 mt-0.5">{s.eligibility}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs uppercase tracking-wider">Benefits</span>
                          <p className="text-gray-600 mt-0.5">{s.benefits}</p>
                        </div>
                      </div>
                    </div>
                    <a
                      href={s.portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Apply <ExternalLink className="w-3.5 h-3.5" />
                    </a>
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
