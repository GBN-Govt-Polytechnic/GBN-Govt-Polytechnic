/**
 * @file page.tsx
 * @description Code of Conduct page — detailed student conduct rules covering attendance, dress code, lab safety, hostel, and mobile usage with PDF download
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PdfViewerModal } from "@/components/ui/pdf-viewer-modal";
import {
  FileText,
  Download,
  Eye,
  CalendarCheck,
  Shirt,
  FlaskConical,
  BedDouble,
  Smartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Code of Conduct",
  description:
    "Student code of conduct and rules at GBN Govt. Polytechnic Nilokheri.",
};

const rules = [
  {
    icon: CalendarCheck,
    title: "Attendance Requirements",
    desc: "Students must maintain a minimum of 75% attendance in each subject to be eligible for appearing in examinations.",
  },
  {
    icon: Shirt,
    title: "Dress Code",
    desc: "Students are required to follow the prescribed dress code while on campus. Proper and decent attire is mandatory.",
  },
  {
    icon: FlaskConical,
    title: "Lab Discipline",
    desc: "Safety protocols must be followed in all laboratories. Proper lab attire and equipment handling is compulsory.",
  },
  {
    icon: BedDouble,
    title: "Hostel Rules",
    desc: "Hostel residents must adhere to the hostel timings, maintain cleanliness, and follow all hostel regulations.",
  },
  {
    icon: Smartphone,
    title: "Use of Mobile Phones",
    desc: "Mobile phones must be switched off or kept on silent mode during classes, labs, and library sessions.",
  },
];

export default function CodeOfConductPage() {
  return (
    <>
      <PageHeader
        title="Code of Conduct"
        subtitle="Rules & Guidelines for Students"
        breadcrumbs={[
          { label: "Rules", href: "/rules" },
          { label: "Code of Conduct" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Description */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Every student admitted to GBN Govt. Polytechnic is expected to
                follow the code of conduct as prescribed by the institute. The
                rules are designed to ensure a disciplined, safe, and productive
                learning environment.
              </p>
            </CardContent>
          </Card>

          {/* Rules */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Rules</h2>
          <div className="space-y-4 mb-12">
            {rules.map((rule, i) => (
              <Card
                key={i}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <rule.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {rule.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        Rule {i + 1}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rule.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Download CTA */}
          <Card className="border-emerald-200 bg-emerald-50/30 text-center">
            <CardContent className="p-6 sm:p-8">
              <FileText className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Complete Code of Conduct
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Download or view the complete code of conduct document with all rules,
                regulations, and guidelines for students.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <PdfViewerModal
                  url="/documents/studentconduct.pdf"
                  title="Student Code of Conduct — GBN Govt. Polytechnic"
                  trigger={
                    <span className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                      <Eye className="w-4 h-4" />
                      View Document
                    </span>
                  }
                />
                <a
                  href="/documents/studentconduct.pdf"
                  download
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
