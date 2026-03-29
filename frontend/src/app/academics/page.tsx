/**
 * @file page.tsx
 * @description Academics overview page — six diploma programmes, course highlights, academic calendar, and links to syllabus, results, and resources
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { departments } from "@/lib/config";
import { Clock, GraduationCap, Users, ArrowRight, BookOpen, Award, Calendar, FileText, FlaskConical } from "lucide-react";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Explore 6 diploma programmes offered at GBN Govt. Polytechnic Nilokheri with a total intake of 600 students.",
};

const courseHighlights = [
  { icon: Clock, label: "Duration", value: "3 Years (6 Semesters)" },
  { icon: GraduationCap, label: "Qualification", value: "Diploma in Engineering" },
  { icon: Users, label: "Affiliation", value: "HSBTE, Panchkula" },
  { icon: Award, label: "Approval", value: "AICTE, New Delhi" },
];

const academicResources = [
  {
    icon: BookOpen,
    title: "Syllabus",
    description: "Access the latest HSBTE syllabus for all programmes",
    href: "/academics/syllabus",
  },
  {
    icon: Calendar,
    title: "Academic Calendar",
    description: "View the current session academic calendar",
    href: "/academics/calendar",
  },
  {
    icon: Award,
    title: "Results",
    description: "Check HSBTE examination results",
    href: "/academics/results",
  },
  {
    icon: FileText,
    title: "Scholarships",
    description: "Explore scholarship opportunities for students",
    href: "/academics/scholarships",
  },
];

export default function AcademicsPage() {
  const engineeringDepts = departments.filter((d) => d.seats !== null);
  const totalSeats = engineeringDepts.reduce((sum, d) => sum + (d.seats ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Academics"
        subtitle="Six Diploma Programmes — 600 Seats — Three Years of Excellence"
        breadcrumbs={[{ label: "Academics" }]}
      />

      {/* Course Highlights */}
      <section className="py-10 -mt-6 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {courseHighlights.map((item, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <item.icon className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                  <div className="text-sm font-bold text-gray-900">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Offered */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-3">
            Courses <span className="text-emerald-600">Offered</span>
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            All programmes are 3-year diploma courses affiliated to HSBTE, Panchkula 
            and approved by AICTE, New Delhi.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {engineeringDepts.map((dept) => (
              <Link key={dept.code} href={`/departments/${dept.code}`}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className={`h-2 bg-linear-to-r ${dept.color}`} />
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${dept.color} flex items-center justify-center mb-3`}>
                      <dept.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                      {dept.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {dept.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="font-mono">
                        {dept.seats} Seats
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Total */}
          <div className="mt-8 text-center">
            <Card className="inline-block">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-left">
                  <div className="text-sm text-gray-500">Total Sanctioned Intake</div>
                  <div className="text-2xl font-bold text-emerald-600">{totalSeats} Students</div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  6 Programmes
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Academic Resources */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Academic <span className="text-emerald-600">Resources</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {academicResources.map((item, i) => (
              <Link key={i} href={item.href}>
                <Card className="group h-full hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors">
                      <item.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Applied Science Note */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/50">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Applied Science Department</h3>
                <p className="text-sm text-gray-600">
                  The Applied Science department provides the foundational education in 
                  Mathematics, Physics, Chemistry, and Communication Skills for all 
                  first-year diploma students across all branches.
                </p>
                <Link
                  href="/departments/as"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium mt-2 hover:text-indigo-800"
                >
                  Learn more about Applied Science
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
