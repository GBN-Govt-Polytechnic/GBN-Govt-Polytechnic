/**
 * @file page.tsx
 * @description Courses management — paginated data table with department filtering and role-based scoping
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { courses, departments as departmentsApi, ApiError } from "@/lib/api";
import type { Course } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Suspense } from "react";

function CoursesPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const deptSlug = searchParams.get("dept");

  const [data, setData] = useState<Course[]>([]);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [coursesRes, deptsRes] = await Promise.all([
          courses.list({ limit: 500, ...(deptSlug ? { dept: deptSlug } : user?.role === "hod" && user?.departmentSlug ? { dept: user.departmentSlug } : {}) }),
          departmentsApi.list({ limit: 100 }),
        ]);
        setData(coursesRes.data as unknown as Course[]);
        setDeptList(deptsRes.data);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load courses");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [deptSlug, user?.role, user?.departmentSlug]);

  const filterDept = deptSlug ? deptList.find((d) => d.slug === deptSlug) : null;

  const columns: Column<Course>[] = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Subject Name", sortable: true },
    {
      key: "departmentId",
      label: "Department",
      render: (item) => (deptList.find((d) => d.id === item.departmentId) as Record<string, unknown>)?.code as string ?? "—",
    },
    { key: "semester", label: "Semester" },
    { key: "credits", label: "Credits" },
    { key: "type", label: "Type", render: (item) => (
      <span className="capitalize">{item.type}</span>
    )},
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title={filterDept ? `Subjects — ${filterDept.name as string}` : "Subjects"} description={filterDept ? `Subjects of ${filterDept.name as string}` : "Manage subjects offered by departments"} action={{ label: "Add Subject", href: deptSlug ? `/courses/new?dept=${deptSlug}` : "/courses/new" }} />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={filterDept ? `Subjects — ${filterDept.name as string}` : "Subjects"} description={filterDept ? `Subjects of ${filterDept.name as string}` : "Manage subjects offered by departments"} action={{ label: "Add Subject", href: deptSlug ? `/courses/new?dept=${deptSlug}` : "/courses/new" }} />
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search subjects..." onRowClick={(row) => router.push(`/courses/${row.id}`)} />
    </div>
  );
}

export default function CoursesPage() {
  return <Suspense><CoursesPageInner /></Suspense>;
}
