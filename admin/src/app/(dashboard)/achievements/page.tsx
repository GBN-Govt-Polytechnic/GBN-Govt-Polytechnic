/**
 * @file page.tsx
 * @description Achievements management — list of achievement records with click-to-edit navigation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { achievements as achievementsApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

export default function AchievementsPage() {
  const router = useRouter();
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await achievementsApi.list({ limit: 200 });
        setData(res.data as unknown as Achievement[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load achievements");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns: Column<Achievement>[] = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "description",
      label: "Description",
      render: (item) => (
        <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs block">
          {item.description}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (item) => (item.date ? formatDate(item.date) : "—"),
    },
    {
      key: "imageUrl",
      label: "Image",
      render: (item) =>
        item.imageUrl ? (
          <a
            href={item.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 underline"
            onClick={(e) => e.stopPropagation()}
          >
            View
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        ),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Achievements"
          description="Manage college achievements and accolades"
          action={{ label: "Add Achievement", href: "/achievements/new" }}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Achievements"
        description="Manage college achievements and accolades"
        action={{ label: "Add Achievement", href: "/achievements/new" }}
      />
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Search achievements..."
        onRowClick={(item) => router.push(`/achievements/${item.id}`)}
      />
    </div>
  );
}
