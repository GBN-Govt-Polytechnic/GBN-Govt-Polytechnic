/**
 * @file page.tsx
 * @description Course editor — update course details including code, name, credits, department, and semester
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SEMESTERS } from "@/lib/constants";
import { courses, departments as departmentsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import type { Course } from "@/lib/types";

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [courseRes, deptsRes] = await Promise.all([
          courses.get(id),
          departmentsApi.list({ limit: 100 }),
        ]);
        setCourse(courseRes.data as unknown as Course);
        setDeptList(deptsRes.data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          toast.error(err instanceof ApiError ? err.message : "Failed to load course");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Edit Course" description="Loading..." />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested course does not exist." />
        <Button variant="outline" onClick={() => router.push("/courses")}>Back to Courses</Button>
      </div>
    );
  }

  const dept = deptList.find((d) => d.id === course.departmentId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const departmentId = formData.get("department") as string;
    if (!departmentId) {
      toast.error("Please select a department");
      return;
    }
    try {
      setSaving(true);
      await courses.update(id, {
        code: formData.get("code") as string,
        name: formData.get("name") as string,
        credits: Number(formData.get("credits")),
        departmentId,
        semester: Number(formData.get("semester")),
        type: formData.get("type") as string,
        description: (formData.get("description") as string) || undefined,
      });
      toast.success("Course updated successfully");
      router.push("/courses");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await courses.delete(id);
      toast.success("Course deleted");
      router.push("/courses");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete course");
    }
  }

  return (
    <div>
      <PageHeader title="Edit Course" description={`Editing: ${course.code} — ${course.name}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input id="code" name="code" required defaultValue={course.code} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits *</Label>
                <Input id="credits" name="credits" type="number" required min={1} max={10} defaultValue={course.credits} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input id="name" name="name" required defaultValue={course.name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select name="department" defaultValue={course.departmentId} items={deptList.map(d => ({ value: d.id as string, label: `${d.code as string} — ${d.name as string}` }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {deptList.map((d) => (
                      <SelectItem key={String(d.id)} value={String(d.id)}>{String(d.code)} — {String(d.name)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester *</Label>
                <Select name="semester" defaultValue={String(course.semester)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Select name="type" defaultValue={course.type}>
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
              <Textarea id="description" name="description" rows={3} defaultValue={course.description ?? ""} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/courses")}>Cancel</Button>
              </div>
              <ConfirmDialog title="Delete Course" description={`Permanently delete "${course.code} — ${course.name}"?`} onConfirm={handleDelete}>
                <Button type="button" variant="destructive" size="sm">Delete</Button>
              </ConfirmDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
