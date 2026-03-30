/**
 * @file page.tsx
 * @description Submissions inbox — unified table for contact inquiries and complaints with type badge, status tracking, and full-message modal
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function SubmissionsPage() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);

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
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search by name..."
        onRowClick={(item) => setSelected(item)}
      />

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selected?.type === "CONTACT" ? (
                <Mail className="h-5 w-5 text-primary" />
              ) : (
                <MessageSquare className="h-5 w-5 text-orange-500" />
              )}
              {selected?.subject}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">From: </span>
                  <span className="font-medium">{selected.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
                    {selected.email}
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground">Date: </span>
                  <span>{formatDate(selected.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Type: </span>
                  <Badge variant={selected.type === "CONTACT" ? "default" : "secondary"} className="text-xs">
                    {selected.type === "CONTACT" ? "Contact" : "Complaint"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Status: </span>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
