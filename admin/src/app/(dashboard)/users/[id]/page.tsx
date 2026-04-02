/**
 * @file page.tsx
 * @description Edit admin user form — update name, email, role, active status, and department
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { users as usersApi, departments as departmentsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useAuth } from "@/hooks/use-auth";

const ROLES = [
    { value: "SUPER_ADMIN", label: "Super Admin" },
    { value: "ADMIN", label: "Admin" },
    { value: "HOD", label: "Head of Department" },
    { value: "TPO", label: "TPO" },
    { value: "MEDIA_MANAGER", label: "Media Manager" },
    { value: "NEWS_EDITOR", label: "News Editor" },
];

interface Department {
    id: string;
    name: string;
    code: string;
}

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    departmentId?: string;
}

export default function EditUserPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    const isSuperAdmin = currentUser?.role === "super_admin";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [role, setRole] = useState("ADMIN");
    const [departmentId, setDepartmentId] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [newPassword, setNewPassword] = useState("");
    const [resettingPassword, setResettingPassword] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [userRes, deptsRes] = await Promise.all([
                    usersApi.get(id),
                    departmentsApi.list({ limit: 100 })
                ]);

                const userData = userRes.data as unknown as AdminUser;
                setUser(userData);
                setRole(userData.role);
                setDepartmentId(userData.departmentId ?? "");
                setIsActive(userData.isActive);
                setDepartments(deptsRes.data as unknown as Department[]);
            } catch (err) {
                toast.error(err instanceof ApiError ? err.message : "Failed to load user data");
                router.push("/users");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, router]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        if (role === "HOD" && !departmentId) {
            toast.error("Department is required for HOD accounts");
            return;
        }

        const payload: Record<string, unknown> = {
            name: fd.get("name") as string,
            email: fd.get("email") as string,
            role,
            isActive,
        };
        payload.departmentId = role === "HOD" ? departmentId : null;

        try {
            setSaving(true);
            await usersApi.update(id, payload);
            toast.success("User updated successfully");
            router.push("/users");
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Failed to update user");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        try {
            await usersApi.delete(id);
            toast.success("User deleted successfully");
            router.push("/users");
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Failed to delete user");
        }
    }

    async function handleResetPassword() {
        const trimmed = newPassword.trim();
        if (trimmed.length < 12) {
            toast.error("Password must be at least 12 characters");
            return;
        }

        try {
            setResettingPassword(true);
            await usersApi.resetPassword(id, trimmed);
            setNewPassword("");
            toast.success("Password reset successfully");
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Failed to reset password");
        } finally {
            setResettingPassword(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <PageHeader title="Edit User" description="Loading..." />
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Edit User" description={`Manage account for ${user?.name}`} />
            <Card className="max-w-lg">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" required defaultValue={user?.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" name="email" type="email" required defaultValue={user?.email} />
                        </div>

                        <div className="space-y-2">
                            <Label>Role *</Label>
                            <Select value={role} onValueChange={(v) => { if (v) setRole(v); }}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {ROLES.filter(r => r.value !== "SUPER_ADMIN" || isSuperAdmin).map((r) => (
                                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {role === "HOD" && (
                            <div className="space-y-2">
                                <Label>Department *</Label>
                                <Select value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")}>
                                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d) => (
                                            <SelectItem key={d.id} value={d.id}>{d.code} — {d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="flex items-center gap-3 py-2">
                            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                            <Label htmlFor="isActive" className="cursor-pointer">Account Active</Label>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-3">
                                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                                <Button type="button" variant="outline" onClick={() => router.push("/users")}>Cancel</Button>
                            </div>
                            <ConfirmDialog
                                title="Delete User"
                                description={`Permanently delete the account for ${user?.name}? This action cannot be undone.`}
                                onConfirm={handleDelete}
                            >
                                <Button type="button" variant="destructive" size="sm">Delete</Button>
                            </ConfirmDialog>
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <Label htmlFor="newPassword">Set New Password</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Minimum 12 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleResetPassword}
                                    disabled={resettingPassword}
                                >
                                    {resettingPassword ? "Resetting..." : "Reset Password"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
