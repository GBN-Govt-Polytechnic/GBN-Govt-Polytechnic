/**
 * @file page.tsx
 * @description Faculty management — paginated data table with department filtering and role-based scoping
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { faculty as facultyApi, departments as departmentsApi, ApiError } from "@/lib/api";
import type { Faculty } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function FacultyPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

        // Build dept id -> code map
        const map: Record<string, string> = {};
        depts.forEach((d: Record<string, unknown>) => {
          map[d.id as string] = d.code as string;
        });
        setDeptMap(map);

        // Determine department filter
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

        const facultyRes = await facultyApi.list(params);
        setData(facultyRes.data);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load faculty");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [deptSlug, user]);

  const columns: Column<Faculty>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "designation", label: "Designation", sortable: true },
    {
      key: "departmentId",
      label: "Department",
      render: (item) => item.department?.name ?? deptMap[item.departmentId] ?? "—",
    },
    { key: "qualification", label: "Qualification" },
    {
      key: "isActive",
      label: "Status",
      render: (item) => (
        <StatusBadge status={item.isActive ? "active" : "inactive"} />
      ),
    },
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
      <PageHeader
        title={filterDeptName ? `Faculty — ${filterDeptName}` : "Faculty"}
        description={filterDeptName ? `Faculty members of ${filterDeptName}` : "Manage faculty members"}
        action={{ label: "Add Faculty", href: deptSlug ? `/faculty/new?dept=${deptSlug}` : "/faculty/new" }}
      />
      <DataTable
        columns={columns}
        data={data as unknown as Faculty[]}
        searchKey="name"
        searchPlaceholder="Search faculty..."
        onRowClick={(item) => router.push(`/faculty/${item.id}`)}
      />
    </div>
  );
}

export default function FacultyPage() {
  return <Suspense><FacultyPageInner /></Suspense>;
}
