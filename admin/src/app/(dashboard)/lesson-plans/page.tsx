/**
 * @file page.tsx
 * @description Lesson plans management — paginated data table with department filtering, status badges, and role-based scoping
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { lessonPlans, departments as departmentsApi, sessions as sessionsApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { LessonPlan } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Suspense } from "react";

function LessonPlansPageInner() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const deptSlug = searchParams.get("dept");

  const [data, setData] = useState<LessonPlan[]>([]);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [sessionMap, setSessionMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [plansRes, deptsRes, sessionsRes] = await Promise.all([
          lessonPlans.list({ limit: 500 }),
          departmentsApi.list({ limit: 100 }),
          sessionsApi.list(),
        ]);
        const depts = deptsRes.data;
        const targetSlug = deptSlug ?? (user?.role === "hod" && user?.departmentSlug ? user.departmentSlug : null);
        const targetDept = targetSlug ? depts.find((d: Record<string, unknown>) => d.slug === targetSlug) : null;
        const allPlans = plansRes.data as unknown as LessonPlan[];
        setData(targetDept ? allPlans.filter((p) => p.departmentId === (targetDept as Record<string, unknown>).id) : allPlans);
        setDeptList(deptsRes.data);
        const sMap: Record<string, string> = {};
        (sessionsRes.data as Record<string, unknown>[]).forEach((s) => {
          sMap[s.id as string] = s.name as string;
        });
        setSessionMap(sMap);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load lesson plans");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [deptSlug, user?.role, user?.departmentSlug]);

  const filterDept = deptSlug ? deptList.find((d) => d.slug === deptSlug) : null;

  const columns: Column<LessonPlan>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "facultyName", label: "Faculty" },
    {
      key: "departmentId",
      label: "Department",
      render: (item) => (deptList.find((d) => d.id === item.departmentId) as Record<string, unknown>)?.code as string ?? (deptList.find((d) => d.id === item.departmentId) as Record<string, unknown>)?.name as string ?? "—",
    },
    { key: "semester", label: "Semester" },
    {
      key: "sessionId",
      label: "Session",
      render: (item) => sessionMap[(item as unknown as Record<string, unknown>).sessionId as string] ?? "—",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (item) => formatDate(item.createdAt),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title={filterDept ? `Lesson Plans — ${filterDept.name as string}` : "Lesson Plans"} description={filterDept ? `Lesson plans of ${filterDept.name as string}` : "Manage lesson plans for all subjects"} action={{ label: "Add Lesson Plan", href: deptSlug ? `/lesson-plans/new?dept=${deptSlug}` : "/lesson-plans/new" }} />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={filterDept ? `Lesson Plans — ${filterDept.name as string}` : "Lesson Plans"} description={filterDept ? `Lesson plans of ${filterDept.name as string}` : "Manage lesson plans for all subjects"} action={{ label: "Add Lesson Plan", href: deptSlug ? `/lesson-plans/new?dept=${deptSlug}` : "/lesson-plans/new" }} />
      <DataTable columns={columns} data={data} searchKey="title" searchPlaceholder="Search by subject..." />
    </div>
  );
}

export default function LessonPlansPage() {
  return <Suspense><LessonPlansPageInner /></Suspense>;
}
