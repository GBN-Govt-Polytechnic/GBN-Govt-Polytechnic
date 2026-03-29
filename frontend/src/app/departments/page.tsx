/**
 * @file page.tsx
 * @description Departments listing page — grid of all seven departments with icons, intake numbers, and links to individual department pages
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { departments } from "@/lib/config";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Departments",
  description: "Explore the seven departments at GBN Govt. Polytechnic Nilokheri.",
};

export default function DepartmentsPage() {
  return (
    <>
      <PageHeader
        title="Departments"
        subtitle="Seven Departments Delivering Comprehensive Technical Education"
        breadcrumbs={[{ label: "Departments" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <Link key={dept.code} href={`/departments/${dept.code}`}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className={`h-32 bg-linear-to-br ${dept.color} flex items-center justify-center`}>
                    <dept.icon className="w-12 h-12 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {dept.name}
                      </h3>
                      <Badge variant="outline" className="shrink-0 ml-2">{dept.shortName}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{dept.description}</p>
                    <div className="flex items-center justify-between">
                      {dept.seats ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          {dept.seats} Seats
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Foundation Dept.</Badge>
                      )}
                      <span className="text-sm text-emerald-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
