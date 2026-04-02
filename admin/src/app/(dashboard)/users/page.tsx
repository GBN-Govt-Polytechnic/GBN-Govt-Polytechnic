/**
 * @file page.tsx
 * @description Admin user management — list all admin accounts with role badges and active status (Super Admin only)
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { users as usersApi, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ROLE_LABELS, ROLE_COLORS } from "@/config/roles";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

function isAdminUser(item: unknown): item is AdminUser {
  if (typeof item !== "object" || item === null) return false;
  const user = item as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string" &&
    typeof user.isActive === "boolean" &&
    typeof user.createdAt === "string"
  );
}

function parseAdminUsers(payload: unknown): AdminUser[] {
  if (!Array.isArray(payload)) return [];
  return payload.filter((item): item is AdminUser => isAdminUser(item));
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
  const router = useRouter();
  const [data, setData] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  async function loadUsers() {
    try {
      const res = await usersApi.list({ limit: 100 });
      setData(parseAdminUsers(res.data));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load users");
    }
  }

  useEffect(() => {
    setLoading(true);
    usersApi.list({ limit: 100 })
      .then((res) => {
        setData(parseAdminUsers(res.data));
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "Failed to load users");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(user: AdminUser) {
    try {
      setDeletingUserId(user.id);
      await usersApi.delete(user.id);
      toast.success("User deleted successfully");
      await loadUsers();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleResetPassword() {
    const target = passwordTarget;
    if (!target) return;

    const trimmed = newPassword.trim();
    if (trimmed.length < 12) {
      toast.error("Password must be at least 12 characters");
      return;
    }

    try {
      setResettingPassword(true);
      await usersApi.resetPassword(target.id, trimmed);
      toast.success("Password reset successfully");
      setPasswordTarget(null);
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reset password");
    } finally {
      setResettingPassword(false);
    }
  }

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
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/users/${item.id}`);
            }}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              setPasswordTarget(item);
            }}
          >
            Change Password
          </Button>
          <ConfirmDialog
            title="Delete User"
            description={`Permanently delete the account for ${item.name}? This action cannot be undone.`}
            confirmLabel={deletingUserId === item.id ? "Deleting..." : "Delete"}
            onConfirm={() => void handleDelete(item)}
          >
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deletingUserId === item.id}
              onClick={(event) => event.stopPropagation()}
            >
              Delete
            </Button>
          </ConfirmDialog>
        </div>
      ),
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
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search by name..."
        onRowClick={(item) => router.push(`/users/${item.id}`)}
      />

      <Dialog
        open={!!passwordTarget}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPasswordTarget(null);
            setNewPassword("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Set a new password for {passwordTarget?.name}. Minimum length is 12 characters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Minimum 12 characters"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPasswordTarget(null);
                setNewPassword("");
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => void handleResetPassword()} disabled={resettingPassword}>
              {resettingPassword ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
