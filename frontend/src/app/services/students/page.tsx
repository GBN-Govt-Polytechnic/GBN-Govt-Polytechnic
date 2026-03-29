/**
 * @file page.tsx
 * @description Student E-Services page — links to PMS scholarship portal, driving licence, and other online services for students
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  GraduationCap,
  Award,
  Globe,
  Car,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Student E-Services",
  description:
    "Online portals and services available for students of GBN Govt. Polytechnic Nilokheri.",
};

const services = [
  {
    icon: GraduationCap,
    title: "PMS Portal",
    desc: "Post Matric Scholarship portal for SC/BC/EWS students",
    href: "https://hfrms.haryana.gov.in",
    external: true,
  },
  {
    icon: Award,
    title: "National Scholarship Portal",
    desc: "Central government scholarships for all categories",
    href: "https://scholarships.gov.in",
    external: true,
  },
  {
    icon: Globe,
    title: "Passport Seva",
    desc: "Apply for passport online",
    href: "https://www.passportindia.gov.in",
    external: true,
  },
  {
    icon: Car,
    title: "Driving License",
    desc: "Apply for driving license through Sarathi portal",
    href: "https://sarathi.parivahan.gov.in",
    external: true,
  },
];

export default function StudentServicesPage() {
  return (
    <>
      <PageHeader
        title="Student E-Services"
        subtitle="Online Portals & Services for Students"
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Students" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Description */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Online portals and services available for students of GBN Govt.
                Polytechnic.
              </p>
            </CardContent>
          </Card>

          {/* Service Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Card
                key={i}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <service.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                  <Link
                    href={service.href}
                    target={service.external ? "_blank" : undefined}
                    rel={service.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {service.external ? "Visit Portal" : "Go to Portal"}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
