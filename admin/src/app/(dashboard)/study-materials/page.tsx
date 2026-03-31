/**
 * @file page.tsx
 * @description Study materials management — paginated data table with department filtering, status badges, and role-based scoping
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { studyMaterials, departments as departmentsApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { StudyMaterial } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Suspense } from "react";

function StudyMaterialsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const deptSlug = searchParams.get("dept");

  const [data, setData] = useState<StudyMaterial[]>([]);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [materialsRes, deptsRes] = await Promise.all([
          studyMaterials.list({ limit: 500, ...(deptSlug ? { dept: deptSlug } : user?.role === "hod" && user?.departmentSlug ? { dept: user.departmentSlug } : {}) }),
          departmentsApi.list({ limit: 100 }),
        ]);
        setData(materialsRes.data as unknown as StudyMaterial[]);
        setDeptList(deptsRes.data);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load study materials");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [deptSlug, user?.role, user?.departmentSlug]);

  const filterDept = deptSlug ? deptList.find((d) => d.slug === deptSlug) : null;

  const columns: Column<StudyMaterial>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "subject", label: "Subject", sortable: true },
    {
      key: "departmentId",
      label: "Department",
      render: (item) => (deptList.find((d) => d.id === item.departmentId) as Record<string, unknown>)?.code as string ?? (deptList.find((d) => d.id === item.departmentId) as Record<string, unknown>)?.name as string ?? "—",
    },
    { key: "semester", label: "Semester" },
    { key: "uploadedBy", label: "Uploaded By" },
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
        <PageHeader title={filterDept ? `Materials — ${filterDept.name as string}` : "Study Materials"} description={filterDept ? `Study materials of ${filterDept.name as string}` : "Manage study materials and resources"} action={{ label: "Upload Material", href: deptSlug ? `/study-materials/new?dept=${deptSlug}` : "/study-materials/new" }} />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={filterDept ? `Materials — ${filterDept.name as string}` : "Study Materials"} description={filterDept ? `Study materials of ${filterDept.name as string}` : "Manage study materials and resources"} action={{ label: "Upload Material", href: deptSlug ? `/study-materials/new?dept=${deptSlug}` : "/study-materials/new" }} />
      <DataTable columns={columns} data={data} searchKey="title" searchPlaceholder="Search materials..." onRowClick={(row) => router.push(`/study-materials/${row.id}`)} />
    </div>
  );
}

export default function StudyMaterialsPage() {
  return <Suspense><StudyMaterialsPageInner /></Suspense>;
}
