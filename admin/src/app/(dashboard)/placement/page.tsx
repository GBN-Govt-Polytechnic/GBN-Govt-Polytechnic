/**
 * @file page.tsx
 * @description Placement hub — tabbed view of companies, placement records, and activities with data tables
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { placements, departments as deptApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { PlacementCompany, PlacementRecord, PlacementActivity } from "@/lib/types";
import { Building2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PlacementPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<PlacementCompany[]>([]);
  const [records, setRecords] = useState<PlacementRecord[]>([]);
  const [activities, setActivities] = useState<PlacementActivity[]>([]);
  const [deptMap, setDeptMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [companiesRes, statsRes, activitiesRes, deptRes] = await Promise.all([
          placements.listCompanies(),
          placements.listStats(),
          placements.listActivities(),
          deptApi.list({ limit: 50 }),
        ]);
        setCompanies((companiesRes.data ?? []) as unknown as PlacementCompany[]);
        setRecords((statsRes.data ?? []) as unknown as PlacementRecord[]);
        setActivities(((activitiesRes as unknown as Record<string, unknown>).data ?? []) as unknown as PlacementActivity[]);
        const map: Record<string, string> = {};
        for (const d of (deptRes.data ?? []) as Record<string, unknown>[]) {
          map[String(d.id)] = String(d.code ?? d.name ?? d.id);
        }
        setDeptMap(map);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load placement data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const companyColumns: Column<PlacementCompany>[] = [
    {
      key: "name",
      label: "Company",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.logoUrl} alt={item.name} className="h-6 w-6 rounded object-contain" />
          ) : (
            <Building2 className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    { key: "industry", label: "Industry", render: (item) => item.industry ?? "—" },
    {
      key: "website",
      label: "Website",
      render: (item) => item.website ? (
        <a href={item.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <ExternalLink className="h-3 w-3" /> Visit
        </a>
      ) : "—",
    },
    {
      key: "createdAt",
      label: "Added",
      sortable: true,
      render: (item) => formatDate(item.createdAt),
    },
  ];

  const recordColumns: Column<PlacementRecord>[] = [
    {
      key: "departmentId",
      label: "Department",
      sortable: true,
      render: (item) => <span>{deptMap[item.departmentId] ?? ((item as unknown as Record<string, unknown>).department as Record<string, unknown> | undefined)?.name as string ?? "—"}</span>,
    },
    {
      key: "studentName",
      label: "Session",
      render: (item) => {
        const stat = item as unknown as Record<string, unknown>;
        const session = stat.session as Record<string, unknown> | undefined;
        return <span>{session ? session.name as string : "—"}</span>;
      },
    },
    {
      key: "year",
      label: "Placed / Total",
      render: (item) => {
        const stat = item as unknown as Record<string, unknown>;
        return <span>{String(stat.studentsPlaced ?? 0)} / {String(stat.totalStudents ?? 0)}</span>;
      },
    },
    {
      key: "packageLpa",
      label: "Highest Pkg",
      render: (item) => {
        const stat = item as unknown as Record<string, unknown>;
        return stat.highestPackage ? `₹${stat.highestPackage} LPA` : "—";
      },
    },
    {
      key: "companyName",
      label: "Avg Pkg",
      render: (item) => {
        const stat = item as unknown as Record<string, unknown>;
        return stat.averagePackage ? `₹${stat.averagePackage} LPA` : "—";
      },
    },
    {
      key: "designation",
      label: "Companies",
      render: (item) => {
        const stat = item as unknown as Record<string, unknown>;
        return <span>{String(stat.companiesVisited ?? 0)}</span>;
      },
    },
  ];

  const activityColumns: Column<PlacementActivity>[] = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "type",
      label: "Type",
      render: (item) => (
        <Badge variant="outline" className="capitalize">{item.type.replace("_", " ")}</Badge>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (item) => formatDate(item.date),
    },
    {
      key: "description",
      label: "Description",
      render: (item) => (
        <span className="max-w-xs truncate block text-muted-foreground text-xs">{item.description}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title="Placement" description="Manage placement companies, records, and activities" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Placement" description="Manage placement companies, records, and activities" />
      <Tabs defaultValue="companies">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="companies">Companies ({companies.length})</TabsTrigger>
            <TabsTrigger value="records">Records ({records.length})</TabsTrigger>
            <TabsTrigger value="activities">Activities ({activities.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="companies">
          <div className="flex justify-end mb-3">
            <Button size="sm" onClick={() => router.push("/placement/companies/new")}>Add Company</Button>
          </div>
          <DataTable columns={companyColumns} data={companies} searchKey="name" searchPlaceholder="Search companies..." onRowClick={(row) => router.push(`/placement/companies/${row.id}`)} />
        </TabsContent>

        <TabsContent value="records">
          <div className="flex justify-end mb-3">
            <Button size="sm" onClick={() => router.push("/placement/records/new")}>Add Record</Button>
          </div>
          <DataTable columns={recordColumns} data={records} searchKey="departmentId" searchPlaceholder="Search by department..." onRowClick={(row) => router.push(`/placement/records/${row.id}`)} />
        </TabsContent>

        <TabsContent value="activities">
          <div className="flex justify-end mb-3">
            <Button size="sm" onClick={() => router.push("/placement/activities/new")}>Add Activity</Button>
          </div>
          <DataTable columns={activityColumns} data={activities} searchKey="title" searchPlaceholder="Search activities..." onRowClick={(row) => router.push(`/placement/activities/${row.id}`)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
