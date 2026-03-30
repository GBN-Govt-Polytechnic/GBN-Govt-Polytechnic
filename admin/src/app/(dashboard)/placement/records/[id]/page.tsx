/**
 * @file page.tsx
 * @description Edit placement stat — update aggregate placement statistics for a department and session
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { placements, departments as departmentsApi, sessions as sessionsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export default function EditPlacementStatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [stat, setStat] = useState<Record<string, unknown> | null>(null);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [sessionList, setSessionList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [departmentId, setDepartmentId] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, deptRes, sessRes] = await Promise.all([
          placements.listStats(),
          departmentsApi.list({ limit: 100 }),
          sessionsApi.list(),
        ]);
        const found = (statsRes.data ?? []).find(
          (r: Record<string, unknown>) => r.id === id,
        ) as Record<string, unknown> | undefined;
        if (!found) throw new ApiError(404, "Placement stat not found");
        setStat(found);
        setDepartmentId(found.departmentId as string ?? "");
        setSessionId(found.sessionId as string ?? "");
        setDeptList(deptRes.data);
        setSessionList((sessRes.data ?? []) as Record<string, unknown>[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load stat");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    try {
      await placements.upsertStat({
        departmentId,
        sessionId,
        studentsPlaced: Number(fd.get("studentsPlaced")),
        totalStudents: Number(fd.get("totalStudents")),
        companiesVisited: Number(fd.get("companiesVisited")),
        highestPackage: fd.get("highestPackage") ? Number(fd.get("highestPackage")) : undefined,
        averagePackage: fd.get("averagePackage") ? Number(fd.get("averagePackage")) : undefined,
      });
      toast.success("Placement stat updated");
      router.push("/placement");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update stat");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stat) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Placement stat not found
      </div>
    );
  }

  const deptName = (stat.department as Record<string, unknown> | undefined)?.name as string | undefined;
  const sessionName = (stat.session as Record<string, unknown> | undefined)?.name as string | undefined;

  return (
    <div>
      <PageHeader
        title={`Edit Stat${deptName ? `: ${deptName}` : ""}`}
        description={sessionName ? `Session: ${sessionName}` : "Update this placement stat"}
      />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select required value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")} items={deptList.map(d => ({ value: d.id as string, label: `${d.code as string} — ${d.name as string}` }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {deptList.map((d) => (
                      <SelectItem key={d.id as string} value={d.id as string}>{d.name as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Session *</Label>
                <Select required value={sessionId} onValueChange={(v) => setSessionId(v ?? "")} items={sessionList.map(s => ({ value: s.id as string, label: s.name as string }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionList.map((s) => (
                      <SelectItem key={s.id as string} value={s.id as string}>{s.name as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentsPlaced">Students Placed *</Label>
                <Input
                  id="studentsPlaced"
                  name="studentsPlaced"
                  type="number"
                  required
                  min={0}
                  defaultValue={(stat.studentsPlaced as number) ?? 0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalStudents">Total Students *</Label>
                <Input
                  id="totalStudents"
                  name="totalStudents"
                  type="number"
                  required
                  min={0}
                  defaultValue={(stat.totalStudents as number) ?? 0}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companiesVisited">Companies Visited *</Label>
              <Input
                id="companiesVisited"
                name="companiesVisited"
                type="number"
                required
                min={0}
                defaultValue={(stat.companiesVisited as number) ?? 0}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="highestPackage">Highest Package (LPA)</Label>
                <Input
                  id="highestPackage"
                  name="highestPackage"
                  type="number"
                  step="0.1"
                  defaultValue={(stat.highestPackage as number) ?? ""}
                  placeholder="e.g. 8.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="averagePackage">Average Package (LPA)</Label>
                <Input
                  id="averagePackage"
                  name="averagePackage"
                  type="number"
                  step="0.1"
                  defaultValue={(stat.averagePackage as number) ?? ""}
                  placeholder="e.g. 4.2"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/placement")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
