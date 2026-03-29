/**
 * @file page.tsx
 * @description Courses Offered page — detailed list of six engineering diploma branches with intake, duration, and affiliation info
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HardHat,
  Monitor,
  Zap,
  Radio,
  Cog,
  Gauge,
  GraduationCap,
  Clock,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Courses Offered",
  description:
    "Diploma courses offered at GBN Govt. Polytechnic Nilokheri — 6 engineering branches with 600 total seats, affiliated to HSBTE.",
};

const courses = [
  {
    icon: HardHat,
    name: "Civil Engineering",
    seats: 120,
    color: "bg-orange-100 text-orange-700",
  },
  {
    icon: Monitor,
    name: "Computer Science & Engineering",
    seats: 120,
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Zap,
    name: "Electrical Engineering",
    seats: 60,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: Radio,
    name: "Electronics & Communication Engineering",
    seats: 120,
    color: "bg-purple-100 text-purple-700",
  },
  {
    icon: Cog,
    name: "Mechanical Engineering",
    seats: 120,
    color: "bg-red-100 text-red-700",
  },
  {
    icon: Gauge,
    name: "Instrumentation & Control Engineering",
    seats: 60,
    color: "bg-teal-100 text-teal-700",
  },
];

const totalSeats = courses.reduce((sum, c) => sum + c.seats, 0);

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        title="Courses Offered"
        subtitle="Diploma Programs in Engineering & Technology"
        breadcrumbs={[
          { label: "Academics", href: "/academics" },
          { label: "Courses Offered" },
        ]}
      />

      <section className="container mx-auto px-4 py-12 space-y-10">
        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="text-center border-emerald-200 bg-emerald-50/50">
            <CardContent className="flex flex-col items-center gap-2 py-6">
              <GraduationCap className="h-8 w-8 text-emerald-700" />
              <p className="text-3xl font-bold text-emerald-700">
                {totalSeats}
              </p>
              <p className="text-sm text-muted-foreground">Total Seats</p>
            </CardContent>
          </Card>
          <Card className="text-center border-emerald-200 bg-emerald-50/50">
            <CardContent className="flex flex-col items-center gap-2 py-6">
              <Clock className="h-8 w-8 text-emerald-700" />
              <p className="text-3xl font-bold text-emerald-700">3 Years</p>
              <p className="text-sm text-muted-foreground">
                Duration (6 Semesters)
              </p>
            </CardContent>
          </Card>
          <Card className="text-center border-emerald-200 bg-emerald-50/50">
            <CardContent className="flex flex-col items-center gap-2 py-6">
              <Award className="h-8 w-8 text-emerald-700" />
              <p className="text-lg font-bold text-emerald-700">HSBTE</p>
              <p className="text-sm text-muted-foreground">
                Haryana State Board of Technical Education
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Diploma Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-muted-foreground text-sm">
                    <th className="pb-3 pr-4">S.No.</th>
                    <th className="pb-3 pr-4">Course</th>
                    <th className="pb-3 pr-4 text-center">Intake</th>
                    <th className="pb-3 text-center">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, idx) => {
                    const Icon = course.icon;
                    return (
                      <tr
                        key={course.name}
                        className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 pr-4 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-lg p-2 ${course.color} shrink-0`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{course.name}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-center">
                          <Badge variant="secondary">
                            {course.seats} seats
                          </Badge>
                        </td>
                        <td className="py-4 text-center text-muted-foreground">
                          3 Years
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t font-semibold">
                    <td className="pt-4 pr-4" />
                    <td className="pt-4 pr-4">Total</td>
                    <td className="pt-4 pr-4 text-center">
                      <Badge className="bg-emerald-600">
                        {totalSeats} seats
                      </Badge>
                    </td>
                    <td className="pt-4" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
