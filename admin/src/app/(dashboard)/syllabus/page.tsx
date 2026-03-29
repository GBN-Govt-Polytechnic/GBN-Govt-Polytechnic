/**
 * @file page.tsx
 * @description Syllabus management — paginated data table with department filtering and file download links
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { syllabus as syllabusApi, departments as departmentsApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Syllabus } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";

function SyllabusPageInner() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const deptSlug = searchParams.get("dept");

  const [data, setData] = useState<Syllabus[]>([]);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [syllabusRes, deptsRes] = await Promise.all([
          syllabusApi.list({ limit: 500 }),
          departmentsApi.list({ limit: 100 }),
        ]);
        const depts = deptsRes.data;
        const targetSlug = deptSlug ?? (user?.role === "hod" && user?.departmentSlug ? user.departmentSlug : null);
        const targetDept = targetSlug ? depts.find((d: Record<string, unknown>) => d.slug === targetSlug) : null;
        const allSyllabus = syllabusRes.data as unknown as Syllabus[];
        setData(targetDept ? allSyllabus.filter((s) => s.departmentId === (targetDept as Record<string, unknown>).id) : allSyllabus);
        setDeptList(deptsRes.data);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load syllabus");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [deptSlug, user?.role, user?.departmentSlug]);

  const filterDept = deptSlug ? deptList.find((d) => d.slug === deptSlug) : null;

  const columns: Column<Syllabus>[] = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "departmentId",
      label: "Department",
      render: (item) => (deptList.find((d) => d.id === item.departmentId) as Record<string, unknown>)?.code as string ?? (deptList.find((d) => d.id === item.departmentId) as Record<string, unknown>)?.name as string ?? "—",
    },
    { key: "session", label: "Session", sortable: true },
    {
      key: "fileUrl",
      label: "File",
      render: (item) => (
        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <ExternalLink className="h-3 w-3" /> View
        </a>
      ),
    },
    {
      key: "createdAt",
      label: "Uploaded",
      sortable: true,
      render: (item) => formatDate(item.createdAt),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title={filterDept ? `Syllabus — ${filterDept.name as string}` : "Syllabus"} description={filterDept ? `Syllabi of ${filterDept.name as string}` : "Manage department syllabi"} action={{ label: "Upload Syllabus", href: deptSlug ? `/syllabus/new?dept=${deptSlug}` : "/syllabus/new" }} />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={filterDept ? `Syllabus — ${filterDept.name as string}` : "Syllabus"} description={filterDept ? `Syllabi of ${filterDept.name as string}` : "Manage department syllabi"} action={{ label: "Upload Syllabus", href: deptSlug ? `/syllabus/new?dept=${deptSlug}` : "/syllabus/new" }} />
      <DataTable columns={columns} data={data} searchKey="title" searchPlaceholder="Search syllabus..." />
    </div>
  );
}

export default function SyllabusPage() {
  return <Suspense><SyllabusPageInner /></Suspense>;
}
