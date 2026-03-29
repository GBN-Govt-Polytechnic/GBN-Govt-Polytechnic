/**
 * @file page.tsx
 * @description Admissions page — step-by-step admission process, eligibility criteria, fee structure, and contact information
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  Users,
  FileCheck,
  CreditCard,
  GraduationCap,
  Phone,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admission process, eligibility, and contacts for GBN Govt. Polytechnic Nilokheri.",
};

const admissionSteps = [
  {
    icon: ClipboardList,
    step: 1,
    title: "Apply Online",
    desc: "Apply online at the DTE Haryana portal during the admission window",
  },
  {
    icon: Users,
    step: 2,
    title: "Merit-Based Counseling",
    desc: "Attend centralized online counseling based on merit and category",
  },
  {
    icon: FileCheck,
    step: 3,
    title: "Document Verification",
    desc: "Get your original documents verified at the allotted institute",
  },
  {
    icon: CreditCard,
    step: 4,
    title: "Fee Payment & Reporting",
    desc: "Pay the prescribed fee and report to the institute to confirm admission",
  },
];

const contacts = [
  {
    name: "Sh. Jwala Prasad",
    designation: "Principal",
    phone: "01745-246002",
  },
  {
    name: "Sh. Bajinder Sharma",
    designation: "Admission Cell In-charge",
    phone: "01745-246003",
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHeader
        title="Admissions"
        subtitle="Join GBN Govt. Polytechnic Nilokheri"
        breadcrumbs={[{ label: "Admissions" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Description */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Admissions to GBN Govt. Polytechnic Nilokheri are conducted
                through centralized online counseling by the Directorate of
                Technical Education (DTE), Haryana.
              </p>
            </CardContent>
          </Card>

          {/* Admission Process */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Admission Process
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {admissionSteps.map((item) => (
              <Card
                key={item.step}
                className="hover:shadow-lg transition-shadow text-center relative"
              >
                <CardContent className="p-6">
                  <Badge className="absolute top-3 right-3 bg-emerald-600">
                    Step {item.step}
                  </Badge>
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

          {/* Eligibility */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                10th pass with minimum 35% marks (aggregate) from a recognized
                board.
              </p>
            </CardContent>
          </Card>

          {/* DTE Haryana Portal */}
          <Card className="mb-12 border-emerald-200">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  DTE Haryana Portal
                </h3>
                <p className="text-sm text-gray-600">
                  Visit the official Directorate of Technical Education, Haryana
                  website for online applications and counseling schedule.
                </p>
              </div>
              <Link
                href="https://dtechhry.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Portal
              </Link>
            </CardContent>
          </Card>

          {/* Important Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-600" />
                Important Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Designation
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {contact.name}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{contact.designation}</Badge>
                      </td>
                      <td className="p-4 text-emerald-600 font-medium">
                        {contact.phone}
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
