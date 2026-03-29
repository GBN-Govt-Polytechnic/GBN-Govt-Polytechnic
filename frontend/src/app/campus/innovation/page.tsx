/**
 * @file page.tsx
 * @description Innovation Club & IIC page — Institution's Innovation Council members, activities, hackathons, and entrepreneurship initiatives
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Rocket,
  Users,
  Code,
  Trophy,
  Presentation,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Innovation Club & IIC",
  description:
    "Innovation Club and Institution's Innovation Council (IIC) at GBN Govt. Polytechnic Nilokheri — fostering creativity and entrepreneurship.",
};

const iicMembers = [
  { name: "Sh. Jwala Prasad", role: "President" },
  { name: "Sh. Bajinder Sharma", role: "Vice President" },
  { name: "Sh. Sunil Dahiya", role: "Convener" },
  { name: "Sh. Pawan Kumar", role: "Innovation Activity Coordinator" },
  { name: "Sh. Sandeep Kumar", role: "Start-up Activity Coordinator" },
  { name: "Sh. Rajesh Kumar", role: "IPR Activity Coordinator" },
  { name: "Smt. Sushma", role: "Social Media Coordinator" },
  { name: "Sh. Ravinder Kumar", role: "Internship Activity Coordinator" },
  { name: "Sh. Sanjeev Kumar", role: "Member" },
  { name: "Sh. Naresh Kumar", role: "Member" },
  { name: "Sh. Manoj Kumar", role: "Member" },
  { name: "Sh. Vijay Kumar", role: "Member" },
  { name: "Sh. Anil Kumar", role: "External Member (MSME)" },
  { name: "Sh. Sudhir Sharma", role: "External Member (Alumni)" },
  { name: "Sh. Ashok (Student)", role: "Member" },
  { name: "Sh. Ravi (Student)", role: "Member" },
  { name: "Smt. Pooja (Student)", role: "Member" },
];

const highlights = [
  {
    icon: Code,
    title: "Hackathons",
    description:
      "Regular coding challenges and hackathons to promote problem-solving skills.",
  },
  {
    icon: Presentation,
    title: "Workshops",
    description:
      "Hands-on workshops on emerging technologies, entrepreneurship, and innovation.",
  },
  {
    icon: Trophy,
    title: "Project Exhibitions",
    description:
      "Annual exhibitions showcasing innovative student projects and prototypes.",
  },
  {
    icon: Rocket,
    title: "Start-up Culture",
    description:
      "Mentoring and support for students aspiring to launch their own ventures.",
  },
];

export default function InnovationPage() {
  return (
    <>
      <PageHeader
        title="Innovation Club & IIC"
        subtitle="Fostering Creativity, Entrepreneurship & Problem-Solving"
        breadcrumbs={[
          { label: "Campus Life", href: "/campus" },
          { label: "Innovation Club" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Innovation Club Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Innovation Club
              </h2>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6 sm:p-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  The Innovation Club at GBN Govt. Polytechnic promotes creative
                  thinking, problem-solving, and entrepreneurial spirit among
                  students. Regular hackathons, workshops, and project exhibitions
                  are organized.
                </p>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {highlights.map((h, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                      <h.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {h.title}
                    </h3>
                    <p className="text-sm text-gray-600">{h.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* IIC Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Institution&apos;s Innovation Council (IIC)
              </h2>
            </div>

            <Card className="border-emerald-200 bg-emerald-50/50 mb-8">
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  IIC is established under the guidelines of MHRD&apos;s Innovation
                  Cell to systematically foster the culture of innovation in
                  educational institutions. The council organizes various
                  innovation and entrepreneurship-related activities prescribed by
                  the Central MIC.
                </p>
              </CardContent>
            </Card>

            {/* IIC Members Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  IIC Members
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-4 font-semibold text-gray-700 w-12">
                        #
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Designation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {iicMembers.map((member, i) => (
                      <tr
                        key={i}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-500">{i + 1}</td>
                        <td className="p-4 font-medium text-gray-900">
                          {member.name}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              member.role.includes("President") ||
                              member.role === "Convener"
                                ? "default"
                                : member.role.includes("Coordinator")
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {member.role}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
