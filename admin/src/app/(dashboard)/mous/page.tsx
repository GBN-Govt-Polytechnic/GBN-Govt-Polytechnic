/**
 * @file page.tsx
 * @description MoU management — list of memorandums of understanding with click-to-edit navigation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { mous as mousApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MoU {
  id: string;
  companyName: string;
  purpose: string;
  signedDate?: string | null;
  validUntil?: string | null;
  isActive: boolean;
  documentUrl?: string | null;
  createdAt: string;
}

export default function MoUsPage() {
  const router = useRouter();
  const [data, setData] = useState<MoU[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await mousApi.list({ limit: 200 });
        setData(res.data as unknown as MoU[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load MoUs");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns: Column<MoU>[] = [
    { key: "companyName", label: "Company", sortable: true },
    {
      key: "purpose",
      label: "Purpose",
      render: (item) => (
        <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs block">
          {item.purpose}
        </span>
      ),
    },
    {
      key: "signedDate",
      label: "Signed",
      sortable: true,
      render: (item) => (item.signedDate ? formatDate(item.signedDate) : "—"),
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
      key: "documentUrl",
      label: "Document",
      render: (item) =>
        item.documentUrl ? (
          <a
            href={item.documentUrl}
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
          title="MoU & Partnerships"
          description="Manage memorandums of understanding with industry partners"
          action={{ label: "Add MoU", href: "/mous/new" }}
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
        title="MoU & Partnerships"
        description="Manage memorandums of understanding with industry partners"
        action={{ label: "Add MoU", href: "/mous/new" }}
      />
      <DataTable
        columns={columns}
        data={data}
        searchKey="companyName"
        searchPlaceholder="Search MoUs..."
        onRowClick={(item) => router.push(`/mous/${item.id}`)}
      />
    </div>
  );
}
