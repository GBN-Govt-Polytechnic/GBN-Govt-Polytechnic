/**
 * @file page.tsx
 * @description Grievance Redressal Committee page — committee members, grievance process, and contact details for academic and administrative complaints
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Mail,
  Users,
  ClipboardList,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Grievance Redressal Committee",
  description:
    "Grievance Redressal Committee at GBN Govt. Polytechnic Nilokheri — timely resolution of academic, administrative, and other grievances.",
};

const committeeMembers = [
  { name: "Sh. Jwala Prasad", role: "Chairman" },
  { name: "Sh. Bajinder Sharma", role: "Member" },
  { name: "Sh. Pawan Kumar", role: "Member" },
  { name: "Sh. Sunil Dahiya", role: "Member" },
  { name: "Sh. Sandeep Kumar", role: "Member" },
];

const processSteps = [
  {
    icon: FileText,
    title: "Submit Grievance",
    description:
      "Write an application or email to the committee chairman with details of your grievance.",
  },
  {
    icon: ClipboardList,
    title: "Review & Acknowledge",
    description:
      "The committee reviews the complaint and acknowledges receipt within a reasonable time.",
  },
  {
    icon: MessageSquare,
    title: "Investigation",
    description:
      "The committee investigates the matter, hearing all parties involved.",
  },
  {
    icon: CheckCircle,
    title: "Resolution",
    description:
      "Appropriate action is taken and the complainant is informed of the resolution.",
  },
];

export default function GrievancePage() {
  return (
    <>
      <PageHeader
        title="Grievance Redressal Committee"
        subtitle="Ensuring Timely Resolution of Grievances"
        breadcrumbs={[
          { label: "Committees", href: "/committees" },
          { label: "Grievance" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Description */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                The Grievance Redressal Committee addresses the grievances of
                students, faculty, and staff at GBN Govt. Polytechnic. The
                committee ensures timely resolution of issues related to academic,
                administrative, and other matters.
              </p>
            </CardContent>
          </Card>

          {/* How to File */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How to File a Grievance
          </h2>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Via Email
                  </h3>
                  <p className="text-sm text-gray-600">
                    Send a detailed email describing your grievance to the
                    committee chairman.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Written Application
                  </h3>
                  <p className="text-sm text-gray-600">
                    Submit a written application addressed to the committee
                    chairman through the institute office.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {processSteps.map((step, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5 text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Committee Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Committee Members
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
                  {committeeMembers.map((member, i) => (
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
                            member.role === "Chairman" ? "default" : "outline"
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
      </section>
    </>
  );
}
