/**
 * @file page.tsx
 * @description Create admin user form — name, email, password, role, and optional department for HOD accounts
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { users as usersApi, departments as departmentsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";

const ROLES = [
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

export default function NewUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState("ADMIN");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    departmentsApi.list({ limit: 20 })
      .then((res) => setDepartments(res.data as unknown as Department[]))
      .catch(() => {});
  }, []);

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
      password: fd.get("password") as string,
      role,
    };
    if (role === "HOD") payload.departmentId = departmentId;

    try {
      setSaving(true);
      await usersApi.create(payload);
      toast.success("User created successfully");
      router.push("/users");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add User" description="Create a new admin panel account" />
      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" required placeholder="e.g. Rajesh Kumar" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="e.g. hod.cse@gpnilokheri.ac.in" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" name="password" type="password" required minLength={12} placeholder="Min. 12 characters" />
            </div>

            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={role} onValueChange={(v) => { if (v) setRole(v); setDepartmentId(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {role === "HOD" && (
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")} items={departments.map(d => ({ value: d.id, label: `${d.code} — ${d.name}` }))}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.code} — {d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create User"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/users")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
