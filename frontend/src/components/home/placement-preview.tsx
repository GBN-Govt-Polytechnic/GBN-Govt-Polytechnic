/**
 * @file placement-preview.tsx
 * @description Placement preview section — homepage highlight showing placement stats, top recruiter names, and link to full placement page
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import Link from "next/link";
import { ArrowRight, TrendingUp, Building2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PlacementPreview() {
  return (
    <section className="py-12 lg:py-16 bg-linear-to-b from-white to-emerald-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-2 text-xs">Placements</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Launching <span className="text-emerald-600">Careers</span> Every Year
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Our Training & Placement Cell works tirelessly to connect students with
            top recruiters across industries.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 p-6 text-center hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">150+</p>
              <p className="text-sm text-gray-500 mt-0.5">Students Placed Yearly</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 p-6 text-center hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">50+</p>
              <p className="text-sm text-gray-500 mt-0.5">Recruiting Companies</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 p-6 text-center hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-linear-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹5 LPA</p>
              <p className="text-sm text-gray-500 mt-0.5">Highest Package</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/placement">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-xl px-6">
              View Full Placement Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
