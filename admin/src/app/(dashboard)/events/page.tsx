/**
 * @file page.tsx
 * @description Events management — paginated data table with status badges and date formatting
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { events, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EventsPage() {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await events.list({ limit: 200 });
        setData(res.data as unknown as Event[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const columns: Column<Event>[] = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (item) => formatDate(item.date),
    },
    { key: "location", label: "Location", render: (item) => item.location ?? "—" },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
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
        <PageHeader title="Events" description="Manage college events and activities" action={{ label: "Create Event", href: "/events/new" }} />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Events" description="Manage college events and activities" action={{ label: "Create Event", href: "/events/new" }} />
      <DataTable columns={columns} data={data} searchKey="title" searchPlaceholder="Search events..." />
    </div>
  );
}
