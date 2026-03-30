/**
 * @file page.tsx
 * @description Admin user management — list all admin accounts with role badges and active status (Super Admin only)
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { users as usersApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ROLE_LABELS, ROLE_COLORS } from "@/config/roles";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  departmentId?: string;
  createdAt: string;
  lastLoginAt?: string;
}

function RoleBadge({ role }: { role: string }) {
  const label = ROLE_LABELS[role as Role] ?? role;
  const color = ROLE_COLORS[role as Role] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={cn("inline-block text-xs font-semibold px-2 py-0.5 rounded-full", color)}>
      {label}
    </span>
  );
}

export default function UsersPage() {
  const [data, setData] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi.list({ limit: 100 })
      .then((res) => setData(res.data as unknown as AdminUser[]))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<AdminUser>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (item) => <RoleBadge role={item.role} />,
    },
    {
      key: "isActive",
      label: "Status",
      render: (item) => (
        <span className={cn(
          "inline-block text-xs font-medium px-2 py-0.5 rounded-full",
          item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
        )}>
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "lastLoginAt",
      label: "Last Login",
      render: (item) => item.lastLoginAt ? formatDate(item.lastLoginAt) : "Never",
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
        <PageHeader title="Users" description="Manage admin panel accounts" action={{ label: "Add User", href: "/users/new" }} />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Users" description="Manage admin panel accounts" action={{ label: "Add User", href: "/users/new" }} />
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search by name or email..." />
    </div>
  );
}
