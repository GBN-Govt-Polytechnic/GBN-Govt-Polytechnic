/**
 * @file page.tsx
 * @description Anti-Ragging Committee page — zero-tolerance policy, committee members, and UGC helpline contact details
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  ExternalLink,
  AlertTriangle,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Anti-Ragging Committee",
  description:
    "Anti-Ragging Committee at GBN Govt. Polytechnic Nilokheri — zero tolerance for ragging as per Supreme Court and UGC regulations.",
};

const committeeMembers = [
  { name: "Sh. Jwala Prasad", role: "Chairman" },
  { name: "Sh. Bajinder Sharma", role: "Member" },
  { name: "Sh. Pawan Kumar", role: "Member" },
  { name: "Sh. Sunil Dahiya", role: "Member" },
];

export default function AntiRaggingPage() {
  return (
    <>
      <PageHeader
        title="Anti-Ragging Committee"
        subtitle="Zero Tolerance for Ragging — Safe Campus for All"
        breadcrumbs={[
          { label: "Committees", href: "/committees" },
          { label: "Anti-Ragging" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8 mb-12 flex gap-4 items-start">
            <AlertTriangle className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-red-800 mb-1">
                Strict Warning
              </h2>
              <p className="text-red-700 font-medium">
                Ragging in any form is a criminal offence as per the orders of The
                Supreme Court of India, AICTE &amp; UGC.
              </p>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                GBN Govt. Polytechnic maintains zero tolerance for ragging. The
                institute has constituted an Anti-Ragging Committee and an
                Anti-Ragging Squad as per UGC Regulations on Curbing the Menace of
                Ragging in Higher Educational Institutions, 2009.
              </p>
            </CardContent>
          </Card>

          {/* How to Report / Helpline */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How to Report
          </h2>
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  UGC Helpline
                </h3>
                <p className="text-emerald-600 font-bold text-lg">
                  1800-180-5522
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Toll-free, 24 &times; 7
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <a
                  href="mailto:helpline@antiragging.in"
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  helpline@antiragging.in
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <ExternalLink className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Online Portal
                </h3>
                <a
                  href="https://www.antiragging.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm inline-flex items-center gap-1"
                >
                  www.antiragging.in
                  <ExternalLink className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Committee Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Anti-Ragging Committee Members
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
