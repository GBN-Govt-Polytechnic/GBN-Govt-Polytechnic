/**
 * @file page.tsx
 * @description Submissions inbox — unified table for contact inquiries and complaints with type badge and status tracking
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { submissions as submissionsApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Submission } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SubmissionsPage() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await submissionsApi.list({ limit: 100 });
      setData((res.data ?? []) as unknown as Submission[]);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: Column<Submission>[] = [
    {
      key: "type",
      label: "Type",
      render: (item) => (
        <Badge variant={item.type === "CONTACT" ? "default" : "secondary"} className="text-xs">
          {item.type === "CONTACT" ? "Contact" : "Complaint"}
        </Badge>
      ),
    },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject", sortable: true },
    {
      key: "message",
      label: "Message",
      render: (item) => (
        <span className="max-w-xs truncate block text-xs text-muted-foreground">{item.message}</span>
      ),
    },
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
        <PageHeader title="Submissions" description="Contact inquiries and complaints from the public website" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Submissions" description="Contact inquiries and complaints from the public website" />
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search by name..." />
    </div>
  );
}
