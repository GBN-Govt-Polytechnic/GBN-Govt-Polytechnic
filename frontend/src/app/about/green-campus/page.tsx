/**
 * @file page.tsx
 * @description Green Campus page — eco-friendly initiatives including waste management, energy conservation, water harvesting, and solar energy
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Leaf,
  Recycle,
  Droplets,
  Zap,
  TreePine,
  Trash2,
  MonitorSmartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Green Campus",
  description:
    "Green campus initiatives at GBN Govt. Polytechnic Nilokheri — sustainable waste management, energy conservation, water harvesting, and eco-friendly practices.",
};

const initiatives = [
  {
    icon: Leaf,
    title: "Green Campus Initiatives",
    color: "bg-emerald-100 text-emerald-700",
    description:
      "GBN Govt Polytechnic Nilokheri is focused on achieving sustainable and eco-friendly campus. The institute undertakes multiple initiatives to reduce its environmental footprint and promote green practices among students and staff.",
  },
  {
    icon: Trash2,
    title: "Solid Waste Management",
    color: "bg-amber-100 text-amber-700",
    description:
      "Systematic waste management: segregation into biodegradable/non-biodegradable, vermicompost pits, hazardous waste collection through authorized vendors.",
  },
  {
    icon: Droplets,
    title: "Liquid Waste Management",
    color: "bg-blue-100 text-blue-700",
    description:
      "Water recycling through STP, rain water harvesting structures, grey water reuse for gardening.",
  },
  {
    icon: MonitorSmartphone,
    title: "E-Waste Management",
    color: "bg-purple-100 text-purple-700",
    description:
      "E-waste disposed through government authorized agencies, annual audit of electronic equipment.",
  },
  {
    icon: Zap,
    title: "Energy Conservation",
    color: "bg-yellow-100 text-yellow-700",
    description:
      "LED lighting across campus, solar water heaters in hostels, solar panels (capacity: 20KW), motion sensor based corridor lighting, State Level Energy Conservation Award.",
  },
  {
    icon: Recycle,
    title: "Water Conservation",
    color: "bg-cyan-100 text-cyan-700",
    description:
      "Rain water harvesting system, drip irrigation in gardens, water recycling plant.",
  },
  {
    icon: TreePine,
    title: "Green Practices",
    color: "bg-green-100 text-green-700",
    description:
      "Tree plantation drives, use of bicycles encouraged, ban on single-use plastic, paperless administration initiatives.",
  },
];

export default function GreenCampusPage() {
  return (
    <>
      <PageHeader
        title="Green Campus"
        subtitle="Sustainable and Eco-Friendly Campus Initiatives"
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Green Campus" },
        ]}
      />

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initiatives.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2.5 ${item.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Last card centered below the grid */}
        {initiatives.length > 6 && (() => {
          const item = initiatives[6];
          const Icon = item.icon;
          return (
            <div className="mt-6 flex justify-center">
              <Card className="hover:shadow-lg transition-shadow max-w-md w-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2.5 ${item.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })()}
      </section>
    </>
  );
}
