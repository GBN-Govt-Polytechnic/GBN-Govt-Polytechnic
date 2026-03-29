/**
 * @file page.tsx
 * @description Alumni page — information about the alumni association, its history, and how to get involved
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Calendar, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Alumni Association",
  description:
    "Alumni Association of GBN Govt. Polytechnic Nilokheri — connecting generations of polytechnic graduates.",
};

export default function AlumniPage() {
  return (
    <>
      <PageHeader
        title="Alumni Association"
        subtitle="Connecting Generations of Polytechnic Graduates"
        breadcrumbs={[{ label: "Alumni" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          {/* About */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2.5">
                  <Users className="h-6 w-6 text-emerald-700" />
                </div>
                <CardTitle className="text-xl">About the Alumni Association</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Alumni Association of GBN Govt. Polytechnic, Nilokheri was formed
                to connect the institute with its graduates who have remarkably excelled
                in their respective areas of profession. Alumni from across India and
                abroad hold an emotional bond with their alma mater and take keen
                interest in expanding and elevating this association.
              </p>
              <p>
                Two Mega Alumni Meets were organized in 2007 and 2009 respectively,
                wherein alumni gathered from India and abroad. The institute is proud
                of its achievers and invites all former students to associate in this
                venture.
              </p>
            </CardContent>
          </Card>

          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Calendar, value: "Est. 2007", label: "Association Founded" },
              { icon: Users, value: "1000+", label: "Registered Alumni" },
              { icon: Heart, value: "2", label: "Mega Alumni Meets Held" },
            ].map((stat, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How to connect */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How to Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                All graduates of GBN Govt. Polytechnic (formerly Govt. Polytechnic /
                Haryana Polytechnic / Punjab Polytechnic / Govt. School of Engineering,
                Nilokheri) are welcome to register with the Alumni Association.
              </p>
              <p>
                If you are an alumnus, please reach out to the Alumni Coordinator
                through the contact details below. You can also help by sharing the
                contact details of your batchmates and acquaintances.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a href="mailto:gpaboratory@gmail.com" className="text-sm text-emerald-600 hover:underline">
                      gpaboratory@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a href="tel:+911745246002" className="text-sm text-emerald-600 hover:underline">
                      +91-1745-246002
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">
                      Alumni Coordinator, GBN Govt. Polytechnic, GT Road, Nilokheri,
                      Karnal, Haryana - 132117
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              Online alumni registration portal coming soon
            </Badge>
          </div>
        </div>
      </section>
    </>
  );
}
