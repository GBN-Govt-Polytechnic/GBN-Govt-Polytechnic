/**
 * @file page.tsx
 * @description SC/ST Cell page — welfare committee for SC/ST students and employees with member details and objectives
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  HandHeart,
  GraduationCap,
  Megaphone,
  Landmark,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SC/ST Cell",
  description:
    "SC/ST Cell at GBN Govt. Polytechnic Nilokheri — welfare of SC/ST students and employees.",
};

const committeeMembers = [
  { name: "Sh. Jwala Prasad", role: "Chairman" },
  { name: "Sh. Bajinder Sharma", role: "Member" },
  { name: "Sh. Pawan Kumar", role: "Member" },
  { name: "Sh. Sunil Dahiya", role: "Member" },
];

const functions = [
  {
    icon: GraduationCap,
    title: "Scholarship Assistance",
    desc: "Facilitates scholarship applications and ensures timely disbursement for SC/ST students",
  },
  {
    icon: HandHeart,
    title: "Redressal of Grievances",
    desc: "Addresses complaints and grievances related to discrimination or harassment",
  },
  {
    icon: Megaphone,
    title: "Awareness Programs",
    desc: "Conducts awareness campaigns about rights, schemes, and benefits for SC/ST community",
  },
  {
    icon: Landmark,
    title: "Liaison with Govt. Agencies",
    desc: "Coordinates with government agencies for implementation of welfare schemes",
  },
];

export default function SCSTPage() {
  return (
    <>
      <PageHeader
        title="SC/ST Cell"
        subtitle="Welfare & Support for SC/ST Students and Employees"
        breadcrumbs={[
          { label: "Committees", href: "/committees" },
          { label: "SC/ST Cell" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Description */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                The SC/ST Cell is constituted to look after the welfare of
                students and employees belonging to Scheduled Castes and
                Scheduled Tribes. The cell ensures that they receive all the
                benefits and facilities as per government norms and that there is
                no discrimination.
              </p>
            </CardContent>
          </Card>

          {/* Functions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {functions.map((item, i) => (
              <Card
                key={i}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
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
