/**
 * @file page.tsx
 * @description Faculty E-Services page — external portal links for NITTTR, HIPA, and other faculty development resources
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, GraduationCap, Landmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Faculty E-Services",
  description:
    "Online portals and resources for faculty members of GBN Govt. Polytechnic Nilokheri.",
};

const services = [
  {
    icon: GraduationCap,
    title: "NITTTR",
    desc: "National Institute of Technical Teachers Training and Research — Faculty development programs and training",
    href: "https://www.nitttrchd.ac.in",
  },
  {
    icon: Landmark,
    title: "HIPA",
    desc: "Haryana Institute of Public Administration — Government training programs for state employees",
    href: "https://hipa.gov.in",
  },
];

export default function FacultyServicesPage() {
  return (
    <>
      <PageHeader
        title="Faculty E-Services"
        subtitle="Online Portals & Resources for Faculty Members"
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Faculty" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Description */}
          <Card className="border-emerald-200 bg-emerald-50/50 mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Online portals and resources for faculty members of GBN Govt.
                Polytechnic.
              </p>
            </CardContent>
          </Card>

          {/* Service Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <Card
                key={i}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <service.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.desc}</p>
                  <Link
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Portal
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
