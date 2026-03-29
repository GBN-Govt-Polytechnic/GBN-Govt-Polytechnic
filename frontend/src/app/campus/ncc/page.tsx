/**
 * @file page.tsx
 * @description NCC page — National Cadet Corps unit details, activities like parades, camps, and social service with approximately 160 cadets
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Flag,
  Users,
  Mountain,
  Heart,
  Calendar,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "NCC",
  description:
    "National Cadet Corps (NCC) at GBN Govt. Polytechnic Nilokheri — operational since 1960 with approximately 160 cadets.",
};

const activities = [
  {
    icon: Flag,
    title: "Parades & Drills",
    description:
      "Regular parade practice and drill sessions to instill discipline and coordination among cadets.",
  },
  {
    icon: Mountain,
    title: "Adventure Activities",
    description:
      "Trekking, rock climbing, and other adventure sports to develop physical fitness and courage.",
  },
  {
    icon: Calendar,
    title: "Camps",
    description:
      "Annual Training Camps (ATC), Combined Annual Training Camps (CATC), and special camps throughout the year.",
  },
  {
    icon: Heart,
    title: "Social Service",
    description:
      "Blood donation drives, cleanliness campaigns, tree plantation, and community welfare programmes.",
  },
  {
    icon: Flag,
    title: "Republic Day & Independence Day",
    description:
      "Active participation in national celebrations with impressive march-past and flag hoisting ceremonies.",
  },
  {
    icon: Shield,
    title: "National Integration",
    description:
      "Cadets participate in national integration camps promoting unity in diversity across the country.",
  },
];

export default function NCCPage() {
  return (
    <>
      <PageHeader
        title="National Cadet Corps (NCC)"
        subtitle="Unity and Discipline — Serving the Nation Since 1960"
        breadcrumbs={[
          { label: "Campus Life", href: "/campus" },
          { label: "NCC" },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* NCC Logo + Highlight Stats */}
          <div className="flex flex-col items-center mb-10">
            <Image
              src="/images/ncc-logo.png"
              alt="National Cadet Corps India Logo"
              width={120}
              height={120}
              className="mb-4 drop-shadow-md"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Shield, value: "Since 1960", label: "Year Established" },
              { icon: Users, value: "160+", label: "Active Cadets" },
              { icon: Flag, value: "1 HAR Coy NCC", label: "NCC Company" },
            ].map((stat, i) => (
              <Card
                key={i}
                className="text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-5">
                  <stat.icon className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Description */}
          <Card className="mb-12">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                NCC (National Cadet Corps) at GBN Govt. Polytechnic has been
                operational since <strong>1960</strong>.{" "}
                <Badge variant="secondary" className="align-middle">
                  1 HAR Coy NCC
                </Badge>{" "}
                is functional in the institute with approximately{" "}
                <strong>160 cadets</strong> enrolled. The NCC unit aims to develop
                character, comradeship, discipline, a secular outlook, the spirit
                of adventure, and ideals of selfless service amongst young cadets.
              </p>
            </CardContent>
          </Card>

          {/* Activities */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            NCC Activities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                    <activity.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* NCC Motto */}
          <div className="mt-12 bg-linear-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white text-center">
            <Image
              src="/images/ncc-logo.png"
              alt="NCC Logo"
              width={64}
              height={64}
              className="mx-auto mb-3 opacity-90 brightness-0 invert"
            />
            <h3 className="text-2xl font-bold mb-2">NCC Motto</h3>
            <p className="text-emerald-100 text-lg">
              &ldquo;Unity and Discipline&rdquo;
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
