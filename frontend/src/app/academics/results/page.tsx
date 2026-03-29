/**
 * @file page.tsx
 * @description Results page — link to HSBTE examination results portal for students
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Results",
  description: "Check HSBTE examination results for GBN Govt. Polytechnic Nilokheri students.",
};

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        title="Examination Results"
        subtitle="Check Your HSBTE Examination Results"
        breadcrumbs={[
          { label: "Academics", href: "/academics" },
          { label: "Results" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-10">
              <div className="rounded-full bg-emerald-100 p-4 mx-auto w-fit mb-4">
                <FileText className="h-10 w-10 text-emerald-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                HSBTE Result Portal
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                All examination results are published on the official HSBTE (Haryana State 
                Board of Technical Education) portal. Click below to check your results.
              </p>
              <a
                href="https://www.hsbte.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors"
              >
                Visit HSBTE Portal
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-1">Exam Branch Contact</h3>
                <a
                  href="mailto:exam.gpnlk@gmail.com"
                  className="text-sm text-emerald-600 hover:underline"
                >
                  exam.gpnlk@gmail.com
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-1">Office Contact</h3>
                <a
                  href="tel:+911745246002"
                  className="text-sm text-emerald-600 hover:underline"
                >
                  01745-246002
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
