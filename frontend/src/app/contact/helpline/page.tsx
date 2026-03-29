/**
 * @file page.tsx
 * @description Helpline page — emergency contact numbers, email addresses, and office hours for the institute
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Shield, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Helpline",
  description:
    "Contact helpline numbers, email, and office hours for GBN Govt. Polytechnic Nilokheri.",
};

const helplineItems = [
  {
    icon: Mail,
    title: "Email",
    value: "gbnpnilokheri@gmail.com",
    href: "mailto:gbnpnilokheri@gmail.com",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "01745-246002",
    href: "tel:01745246002",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Shield,
    title: "Anti-Ragging Helpline",
    value: "1800-180-5522",
    href: "tel:18001805522",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: MapPin,
    title: "Address",
    value:
      "GBN Govt. Polytechnic, Nilokheri, Karnal, Haryana — 132117",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Clock,
    title: "Office Hours",
    value: "Monday to Saturday, 9:00 AM — 5:00 PM",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function HelplinePage() {
  return (
    <>
      <PageHeader
        title="Helpline"
        subtitle="Get in Touch with GBN Govt. Polytechnic Nilokheri"
        breadcrumbs={[
          { label: "Contact", href: "/contact" },
          { label: "Helpline" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {helplineItems.map((item, i) => (
              <Card
                key={i}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 text-sm">{item.value}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
