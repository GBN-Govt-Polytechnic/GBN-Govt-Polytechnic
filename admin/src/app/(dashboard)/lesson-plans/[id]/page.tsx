/**
 * @file page.tsx
 * @description Lesson plan editor — update lesson plan details, department, semester, session, and file upload
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SEMESTERS } from "@/lib/constants";
import { lessonPlans, departments as departmentsApi, sessions as sessionsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import type { LessonPlan } from "@/lib/types";

export default function EditLessonPlanPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [sessionList, setSessionList] = useState<Record<string, unknown>[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [semester, setSemester] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const selectedFileRef = useRef<File | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [planRes, deptsRes, sessionsRes] = await Promise.all([
          lessonPlans.get(id),
          departmentsApi.list({ limit: 100 }),
          sessionsApi.list(),
        ]);
        const p = planRes.data as unknown as LessonPlan;
        setPlan(p);
        setDeptList(deptsRes.data);
        setSessionList(sessionsRes.data as Record<string, unknown>[]);
        setDepartmentId(p.departmentId ?? "");
        setSemester(String(p.semester ?? ""));
        setSessionId((p as unknown as Record<string, unknown>).sessionId as string ?? "");
        setStatus((p as unknown as Record<string, unknown>).status as string ?? "DRAFT");
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          toast.error(err instanceof ApiError ? err.message : "Failed to load lesson plan");
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
        <PageHeader title="Edit Lesson Plan" description="Loading..." />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (notFound || !plan) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested lesson plan does not exist." />
        <Button variant="outline" onClick={() => router.push("/lesson-plans")}>Back to Lesson Plans</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      setSaving(true);
      await lessonPlans.update(id, {
        title: formData.get("title") as string,
        departmentId,
        semester: Number(semester),
        sessionId,
        facultyName: formData.get("facultyName") as string,
        description: formData.get("description") as string,
        status,
      }, selectedFileRef.current);
      toast.success("Lesson plan updated successfully");
      router.push("/lesson-plans");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await lessonPlans.delete(id);
      toast.success("Lesson plan deleted");
      router.push("/lesson-plans");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete lesson plan");
    }
  }

  const planTitle = (plan as unknown as Record<string, unknown>).title as string | undefined;
  const planFacultyName = (plan as unknown as Record<string, unknown>).facultyName as string | undefined ?? plan.faculty;

  return (
    <div>
      <PageHeader title="Edit Lesson Plan" description={`Editing: ${planTitle ?? plan.subject}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={planTitle ?? plan.subject} />
            </div>
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
                <Label>Semester *</Label>
                <Select required value={semester} onValueChange={(v) => setSemester(v ?? "")}>
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
            <div className="space-y-2">
              <Label htmlFor="facultyName">Faculty Name *</Label>
              <Input id="facultyName" name="facultyName" required defaultValue={planFacultyName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description / Outline</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={plan.description ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Replace File</Label>
              <FileUpload accept=".pdf,.doc,.docx" onFilesSelected={(files) => { selectedFileRef.current = files[0] ?? null; }} />
              {plan.fileUrl ? (
                <p className="text-sm text-muted-foreground">Current file: {plan.fileUrl.split("/").pop()}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/lesson-plans")}>Cancel</Button>
              </div>
              <ConfirmDialog title="Delete Lesson Plan" description={`Permanently delete this lesson plan?`} onConfirm={handleDelete}>
                <Button type="button" variant="destructive" size="sm">Delete</Button>
              </ConfirmDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
