/**
 * @file page.tsx
 * @description Banner management — list of announcement banners with status and scheduling info
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { banners as bannersApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Banner {
  id: string;
  title: string;
  message: string;
  variant: string;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  sortOrder: number;
  createdAt: string;
}

const VARIANT_COLORS: Record<string, string> = {
  INFO: "bg-blue-100 text-blue-800",
  WARNING: "bg-amber-100 text-amber-800",
  URGENT: "bg-red-100 text-red-800",
  SUCCESS: "bg-emerald-100 text-emerald-800",
};

export default function BannersPage() {
  const router = useRouter();
  const [data, setData] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await bannersApi.list();
        setData(res.data as unknown as Banner[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load banners");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns: Column<Banner>[] = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "message",
      label: "Message",
      render: (item) => (
        <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs block">
          {item.message}
        </span>
      ),
    },
    {
      key: "variant",
      label: "Type",
      render: (item) => (
        <Badge className={VARIANT_COLORS[item.variant] ?? ""}>
          {item.variant}
        </Badge>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (item) => (
        <Badge variant={item.isActive ? "default" : "secondary"}>
          {item.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "sortOrder",
      label: "Order",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (item) => formatDate(item.createdAt),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Banners"
          description="Manage announcement banners shown on the homepage"
          action={{ label: "Add Banner", href: "/banners/new" }}
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
        title="Banners"
        description="Manage announcement banners shown on the homepage"
        action={{ label: "Add Banner", href: "/banners/new" }}
      />
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Search banners..."
        onRowClick={(item) => router.push(`/banners/${item.id}`)}
      />
    </div>
  );
}
