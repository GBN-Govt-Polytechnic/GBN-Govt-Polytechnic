/**
 * @file page.tsx
 * @description New course form — create a course with code, name, credits, department, semester, and type
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEMESTERS } from "@/lib/constants";
import { courses, departments as deptApi, ApiError } from "@/lib/api";
import { toast } from "sonner";

interface Dept { id: string; name: string; code: string }

export default function NewCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [semester, setSemester] = useState("");
  const [type, setType] = useState("THEORY");
  const [depts, setDepts] = useState<Dept[]>([]);

  useEffect(() => {
    deptApi
      .list({ limit: 100 })
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        setDepts(
          items.map((item) => ({
            id: String(item.id ?? ""),
            name: String(item.name ?? ""),
            code: String(item.code ?? ""),
          })),
        );
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!departmentId) {
      toast.error("Please select a department");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const data = {
      code: fd.get("code") as string,
      name: fd.get("name") as string,
      credits: Number(fd.get("credits")),
      departmentId,
      semester: Number(semester),
      type,
      description: fd.get("description") as string || undefined,
    };

    try {
      setSaving(true);
      await courses.create(data);
      toast.success("Course created successfully");
      router.push("/courses");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create course");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Course" description="Create a new course entry" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input id="code" name="code" required placeholder="e.g. CS-301" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits *</Label>
                <Input id="credits" name="credits" type="number" required min={1} max={10} placeholder="4" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input id="name" name="name" required placeholder="e.g. Data Structures & Algorithms" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select required value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department">
                      {(value: string | null) => {
                        if (!value) return null;
                        const d = depts.find((dept) => dept.id === value);
                        return d ? `${d.code} — ${d.name}` : value;
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {depts.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester *</Label>
                <Select required value={semester} onValueChange={(v) => setSemester(v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select required value={type} onValueChange={(v) => setType(v ?? "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="THEORY">Theory</SelectItem>
                  <SelectItem value="PRACTICAL">Practical</SelectItem>
                  <SelectItem value="ELECTIVE">Elective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} placeholder="Course description and objectives..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Course"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/courses")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
