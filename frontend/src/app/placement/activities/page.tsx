/**
 * @file page.tsx
 * @description Placement activities page — campus drives, workshops, seminars, and mock interviews fetched from the backend API
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { placements } from "@/lib/api";
import {
  Briefcase, GraduationCap, Mic2, Users, CalendarDays, Building2, ClipboardList,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Placement Activities",
  description:
    "Campus drives, workshops, seminars, and mock interviews conducted by the Placement Cell of GBN Govt. Polytechnic Nilokheri.",
};

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Briefcase; color: string }> = {
  DRIVE: { label: "Campus Drive", icon: Briefcase, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  WORKSHOP: { label: "Workshop", icon: GraduationCap, color: "bg-blue-50 text-blue-700 border-blue-200" },
  SEMINAR: { label: "Seminar", icon: Mic2, color: "bg-purple-50 text-purple-700 border-purple-200" },
  MOCK_INTERVIEW: { label: "Mock Interview", icon: ClipboardList, color: "bg-amber-50 text-amber-700 border-amber-200" },
};

export default async function PlacementActivitiesPage() {
  let activities: Record<string, unknown>[] = [];

  try {
    const res = await placements.listActivities({ limit: 50 });
    activities = res.data;
  } catch {
    activities = [];
  }

  return (
    <>
      <PageHeader
        title="Placement Activities"
        subtitle="Campus Drives, Workshops, Seminars & Mock Interviews"
        breadcrumbs={[
          { label: "Placement", href: "/placement" },
          { label: "Activities" },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {activities.length === 0 ? (
            <div className="text-center py-20">
              <CalendarDays className="h-14 w-14 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
              <p className="text-gray-500 text-lg font-medium">No activities published yet.</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon for upcoming placement events.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activities.map((activity) => {
                const type = String(activity.type ?? "DRIVE");
                const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.DRIVE;
                const Icon = config.icon;
                const company = activity.company as Record<string, unknown> | null;
                const department = activity.department as Record<string, unknown> | null;
                const session = activity.session as Record<string, unknown> | null;
                const imageUrl = activity.imageUrl as string | null;
                const participated = activity.studentsParticipated as number | null;
                const selected = activity.studentsSelected as number | null;
                const date = new Date(String(activity.date));

                return (
                  <Card key={String(activity.id)} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        {imageUrl && (
                          <div className="relative w-full sm:w-56 h-44 sm:h-auto shrink-0 bg-gray-100">
                            <Image
                              src={imageUrl}
                              alt={String(activity.title)}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 p-5 sm:p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant="outline" className={`text-xs font-semibold ${config.color}`}>
                              <Icon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                            {session && (
                              <Badge variant="secondary" className="text-xs">
                                {String(session.name)}
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {String(activity.title)}
                          </h3>

                          {activity.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {String(activity.description)}
                            </p>
                          )}

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>

                            {company && (
                              <span className="inline-flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5" />
                                {String(company.name)}
                              </span>
                            )}

                            {department && (
                              <span className="inline-flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5" />
                                {String(department.name)}
                              </span>
                            )}

                            {participated != null && participated > 0 && (
                              <span className="inline-flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" />
                                {participated} participated
                              </span>
                            )}

                            {selected != null && selected > 0 && (
                              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                                <Briefcase className="w-3.5 h-3.5" />
                                {selected} selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
