/**
 * @file page.tsx
 * @description New placement stat form — log aggregate placement statistics per department per session
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
import { placements, departments as departmentsApi, sessions as sessionsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewPlacementStatPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [sessionList, setSessionList] = useState<Record<string, unknown>[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [departmentId, setDepartmentId] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    async function fetchRefs() {
      try {
        const [deptRes, sessRes] = await Promise.all([
          departmentsApi.list({ limit: 100 }),
          sessionsApi.list(),
        ]);
        setDeptList(deptRes.data);
        setSessionList((sessRes.data ?? []) as Record<string, unknown>[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load reference data");
      } finally {
        setLoadingRefs(false);
      }
    }
    fetchRefs();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await placements.upsertStat({
        departmentId,
        sessionId,
        studentsPlaced: Number(formData.get("studentsPlaced")),
        totalStudents: Number(formData.get("totalStudents")),
        companiesVisited: Number(formData.get("companiesVisited")),
        highestPackage: formData.get("highestPackage") ? Number(formData.get("highestPackage")) : undefined,
        averagePackage: formData.get("averagePackage") ? Number(formData.get("averagePackage")) : undefined,
      });
      toast.success("Placement stat saved");
      router.push("/placement");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save placement stat");
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Placement Stat" description="Record aggregate placement statistics for a department and session" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          {loadingRefs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select required value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department">
                        {(value: string | null) => {
                          if (!value) return null;
                          const d = deptList.find((dept) => (dept.id as string) === value);
                          return d ? `${d.code as string} — ${d.name as string}` : value;
                        }}
                      </SelectValue>
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
                  <Select required value={sessionId} onValueChange={(v) => setSessionId(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session">
                        {(value: string | null) => {
                          if (!value) return null;
                          const s = sessionList.find((sess) => (sess.id as string) === value);
                          return s ? (s.name as string) : value;
                        }}
                      </SelectValue>
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
                  <Input id="studentsPlaced" name="studentsPlaced" type="number" required min={0} placeholder="e.g. 45" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalStudents">Total Students *</Label>
                  <Input id="totalStudents" name="totalStudents" type="number" required min={0} placeholder="e.g. 60" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companiesVisited">Companies Visited *</Label>
                <Input id="companiesVisited" name="companiesVisited" type="number" required min={0} placeholder="e.g. 12" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="highestPackage">Highest Package (LPA)</Label>
                  <Input id="highestPackage" name="highestPackage" type="number" step="0.1" placeholder="e.g. 8.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="averagePackage">Average Package (LPA)</Label>
                  <Input id="averagePackage" name="averagePackage" type="number" step="0.1" placeholder="e.g. 4.2" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Stat"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/placement")}>Cancel</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
