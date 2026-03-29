/**
 * @file page.tsx
 * @description Discipline Committee page — committee members and guidelines for maintaining discipline and order in the institute
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Users, BookOpen, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Discipline Committee",
  description:
    "Discipline Committee of GBN Govt. Polytechnic Nilokheri — maintaining discipline and order in the institute.",
};

const committeeMembers = [
  { name: "Sh. Jwala Prasad", role: "Chairman" },
  { name: "Sh. Bajinder Sharma", role: "Member" },
  { name: "Sh. Sunil Dahiya", role: "Member" },
  { name: "Sh. Pawan Kumar", role: "Member" },
  { name: "Sh. Sandeep Kumar", role: "Member" },
];

export default function DisciplineCommitteePage() {
  return (
    <>
      <PageHeader
        title="Discipline Committee"
        subtitle="Maintaining Discipline & Order in the Institute"
        breadcrumbs={[
          { label: "Committees", href: "/committees" },
          { label: "Discipline" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Key Info */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: ShieldAlert,
                title: "Student Conduct",
                desc: "Addresses matters related to student misconduct and violation of rules",
              },
              {
                icon: BookOpen,
                title: "Learning Environment",
                desc: "Ensures a conducive and productive learning environment for all",
              },
              {
                icon: AlertTriangle,
                title: "Rule Enforcement",
                desc: "Enforces institute rules and takes appropriate action against violations",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="hover:shadow-lg transition-shadow text-center"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Description */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                The Discipline Committee of GBN Govt. Polytechnic is responsible
                for maintaining discipline and order in the institute. The
                committee addresses matters related to student misconduct,
                violation of rules, and ensures a conducive learning
                environment.
              </p>
            </CardContent>
          </Card>

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
