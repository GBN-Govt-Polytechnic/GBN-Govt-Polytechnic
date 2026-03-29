/**
 * @file page.tsx
 * @description Audit logs viewer — searchable table of CRUD actions with user, resource, timestamp, and detail modal
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auditLogs, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { AuditLogEntry, AuditAction } from "@/lib/types";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ACTION_COLORS: Record<AuditAction, string> = {
  CREATE: "bg-green-100 text-green-700 border-green-200",
  UPDATE: "bg-blue-100 text-blue-700 border-blue-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
  LOGIN: "bg-purple-100 text-purple-700 border-purple-200",
  LOGOUT: "bg-secondary text-secondary-foreground border-secondary",
};

function DiffViewer({ before, after }: { before?: Record<string, unknown>; after?: Record<string, unknown> }) {
  if (!before && !after) return <p className="text-sm text-muted-foreground">No data changes recorded.</p>;

  const allKeys = Array.from(new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]));

  return (
    <div className="space-y-2">
      {allKeys.map((key) => {
        const oldVal = before?.[key];
        const newVal = after?.[key];
        const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal);
        return (
          <div key={key} className={`rounded-md border p-2 text-xs ${changed ? "border-amber-200 bg-amber-50" : "border-border bg-secondary/50"}`}>
            <span className="font-medium text-muted-foreground">{key}: </span>
            {before && (
              <span className={changed ? "line-through text-red-500 mr-2" : "text-foreground"}>
                {JSON.stringify(oldVal ?? null)}
              </span>
            )}
            {changed && after && (
              <span className="text-green-600 font-medium">{JSON.stringify(newVal ?? null)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await auditLogs.list();
        setLogs((res.data ?? []) as unknown as AuditLogEntry[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const columns: Column<AuditLogEntry>[] = [
    {
      key: "createdAt",
      label: "Time",
      sortable: true,
      render: (item) => (
        <span className="text-xs whitespace-nowrap">{formatDateTime(item.createdAt)}</span>
      ),
    },
    {
      key: "adminId",
      label: "User",
      render: (item) => (
        <div>
          <p className="font-medium text-sm">{item.admin?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{item.admin?.email ?? ""}</p>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <Badge variant="outline" className={`capitalize ${ACTION_COLORS[item.action]}`}>
          {item.action.toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "entityType",
      label: "Entity",
      render: (item) => <span className="capitalize">{item.entityType}</span>,
    },
    {
      key: "entityId",
      label: "ID",
      render: (item) => <span className="text-xs font-mono text-muted-foreground">{item.entityId}</span>,
    },
    {
      key: "ipAddress",
      label: "IP",
      render: (item) => <span className="text-xs font-mono">{item.ipAddress ?? "—"}</span>,
    },
    {
      key: "id",
      label: "",
      render: (item) =>
        item.before || item.after ? (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedLog(item)}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
        ) : null,
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title="Audit Logs" description="Complete activity trail for all admin actions" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Audit Logs" description="Complete activity trail for all admin actions" />
      <DataTable columns={columns} data={logs} searchKey="userName" searchPlaceholder="Search by user..." />

      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">
              {selectedLog && `Changes: ${selectedLog.action} ${selectedLog.entityType} — ${selectedLog.entityId}`}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            {selectedLog && <DiffViewer before={selectedLog.before} after={selectedLog.after} />}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
