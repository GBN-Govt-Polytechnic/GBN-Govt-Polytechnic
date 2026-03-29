/**
 * @file page.tsx
 * @description Labs management — paginated data table with department filtering and role-based scoping
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { labs as labsApi, departments as departmentsApi, ApiError } from "@/lib/api";
import type { Lab } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function LabsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const deptSlug = searchParams.get("dept");

  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [deptMap, setDeptMap] = useState<Record<string, string>>({});
  const [filterDeptName, setFilterDeptName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const deptRes = await departmentsApi.list();
        const depts = deptRes.data;

        const map: Record<string, string> = {};
        depts.forEach((d: Record<string, unknown>) => {
          map[d.id as string] = d.code as string;
        });
        setDeptMap(map);

        let targetDeptId: string | undefined;
        if (deptSlug) {
          const dept = depts.find((d: Record<string, unknown>) => d.slug === deptSlug);
          if (dept) {
            targetDeptId = dept.id as string;
            setFilterDeptName(dept.name as string);
          }
        } else if (user?.role === "hod") {
          const dept = depts.find((d: Record<string, unknown>) => d.slug === user.departmentSlug);
          if (dept) {
            targetDeptId = dept.id as string;
          }
        }

        const params: Record<string, string | number | boolean | undefined> = {};
        if (targetDeptId) params.departmentId = targetDeptId;

        const labsRes = await labsApi.list(params);
        setData(labsRes.data);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load labs");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [deptSlug, user]);

  const columns: Column<Lab>[] = [
    { key: "name", label: "Lab Name", sortable: true },
    {
      key: "departmentId",
      label: "Department",
      render: (item) => deptMap[item.departmentId] ?? "—",
    },
    { key: "incharge", label: "In-charge" },
    { key: "description", label: "Description", render: (item) => (
      <span className="max-w-xs truncate block text-muted-foreground">{item.description ?? "—"}</span>
    )},
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={filterDeptName ? `Labs — ${filterDeptName}` : "Labs"} description={filterDeptName ? `Laboratories of ${filterDeptName}` : "Manage laboratory facilities"} action={{ label: "Add Lab", href: deptSlug ? `/labs/new?dept=${deptSlug}` : "/labs/new" }} />
      <DataTable columns={columns} data={data as unknown as Lab[]} searchKey="name" searchPlaceholder="Search labs..." onRowClick={(row) => router.push(`/labs/${row.id}`)} />
    </div>
  );
}

export default function LabsPage() {
  return <Suspense><LabsPageInner /></Suspense>;
}
