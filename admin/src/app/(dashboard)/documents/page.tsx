/**
 * @file page.tsx
 * @description Documents list — manage institutional public documents with category, year, and download info
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { documents as documentsApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { PublicDocument } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<PublicDocument["category"], string> = {
  APPROVAL: "Approval",
  MANDATORY_DISCLOSURE: "Mandatory Disclosure",
  FEE_STRUCTURE: "Fee Structure",
  RTI: "RTI",
  ANNUAL_REPORT: "Annual Report",
  COMMITTEE: "Committee",
  GOVT_ORDER: "Govt. Order",
  OTHER: "Other",
};

const CATEGORY_COLORS: Record<PublicDocument["category"], string> = {
  APPROVAL: "bg-green-50 text-green-700 border-green-100",
  MANDATORY_DISCLOSURE: "bg-blue-50 text-blue-700 border-blue-100",
  FEE_STRUCTURE: "bg-amber-50 text-amber-700 border-amber-100",
  RTI: "bg-purple-50 text-purple-700 border-purple-100",
  ANNUAL_REPORT: "bg-teal-50 text-teal-700 border-teal-100",
  COMMITTEE: "bg-indigo-50 text-indigo-700 border-indigo-100",
  GOVT_ORDER: "bg-rose-50 text-rose-700 border-rose-100",
  OTHER: "bg-gray-50 text-gray-700 border-gray-100",
};

export default function DocumentsPage() {
  const router = useRouter();
  const [data, setData] = useState<PublicDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await documentsApi.list();
      setData((res.data ?? []) as unknown as PublicDocument[]);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<PublicDocument>[] = [
    {
      key: "category",
      label: "Category",
      render: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${CATEGORY_COLORS[item.category]}`}>
          {CATEGORY_LABELS[item.category]}
        </span>
      ),
    },
    { key: "title", label: "Title", sortable: true },
    { key: "year", label: "Year", sortable: true },
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
      key: "fileUrl",
      label: "File",
      render: (item) => (
        <a
          href={item.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          View
        </a>
      ),
    },
    {
      key: "createdAt",
      label: "Added",
      sortable: true,
      render: (item) => formatDate(item.createdAt),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title="Documents" description="Manage institutional public documents" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Manage institutional public documents"
        action={{
          label: "Add Document",
          onClick: () => router.push("/documents/new"),
        }}
      />
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Search by title..."
        onRowClick={(item) => router.push(`/documents/${item.id}`)}
      />
    </div>
  );
}
