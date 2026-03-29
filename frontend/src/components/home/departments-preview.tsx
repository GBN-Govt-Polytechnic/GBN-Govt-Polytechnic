/**
 * @file departments-preview.tsx
 * @description Departments preview section — homepage grid of engineering departments with icons and support departments
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { departments } from "@/lib/config";

export function DepartmentsPreview() {
  const engineeringDepts = departments.filter(d => d.code !== "as" && d.code !== "ws");
  const supportDepts = departments.filter(d => d.code === "as" || d.code === "ws");

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-2 text-xs">Our Departments</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Explore Our <span className="text-emerald-600">Departments</span>
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Offering diploma programs in cutting-edge engineering disciplines,
            approved by AICTE and affiliated to HSBTE.
          </p>
        </div>

        {/* All engineering departments — uniform grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {engineeringDepts.map((dept) => {
            const DeptIcon = dept.icon;
            return (
            <Link key={dept.code} href={`/departments/${dept.code}`}>
              <div className="group h-full rounded-xl bg-white border border-gray-200/80 p-4 transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${dept.color} flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                    <DeptIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-emerald-600 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {dept.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {dept.seats && (
                        <span className="text-xs font-medium text-gray-400">
                          <GraduationCap className="w-3.5 h-3.5 inline mr-1" />
                          {dept.seats} seats
                        </span>
                      )}
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            );
          })}
        </div>

        {/* Applied Science + Workshop — side by side */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supportDepts.map((dept) => {
            const DeptIcon = dept.icon;
            return (
              <Link key={dept.code} href={`/departments/${dept.code}`}>
                <div className="group h-full rounded-xl bg-white border border-gray-200/80 p-4 transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${dept.color} flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                      <DeptIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-emerald-600 transition-colors">
                        {dept.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {dept.description}
                      </p>
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <Link href="/departments" className="text-emerald-600 font-medium hover:text-emerald-700 inline-flex items-center gap-1 text-xs">
            View all departments
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
