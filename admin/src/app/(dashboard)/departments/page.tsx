/**
 * @file page.tsx
 * @description Departments overview — card grid listing all departments with faculty count and quick navigation
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { departments as departmentsApi, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Building2, Users, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DepartmentsPage() {
  const { user } = useAuth();
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await departmentsApi.list();
        let data = res.data;
        if (user?.role === "hod") {
          data = data.filter((d: Record<string, unknown>) => d.slug === user.departmentSlug);
        }
        setDeptList(data);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load departments");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage academic departments"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deptList.map((dept: Record<string, unknown>) => (
          <Link key={dept.id as string} href={`/departments/${dept.slug}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f5eb]">
                      <Building2 className="h-5 w-5 text-[#3d4f42]" />
                    </div>
                    <div>
                      <p className="font-semibold">{dept.code as string}</p>
                      <p className="text-xs text-muted-foreground">
                        {dept.name as string}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {(dept.hodName as string) ?? "—"}
                  </span>
                  <Badge
                    variant={dept.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {dept.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
