/**
 * @file page.tsx
 * @description New lesson plan form — create a lesson plan with title, department, semester, session, and PDF upload
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { SEMESTERS } from "@/lib/constants";
import { lessonPlans, departments as departmentsApi, sessions as sessionsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewLessonPlanPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isHod = user?.role === "hod";
  const [saving, setSaving] = useState(false);
  const [departmentId, setDepartmentId] = useState(user?.departmentId ?? "");
  const [semester, setSemester] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [sessionList, setSessionList] = useState<Record<string, unknown>[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const fileRef = useRef<File | null>(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoadingOptions(true);
        const [deptsRes, sessionsRes] = await Promise.all([
          departmentsApi.list({ limit: 100 }),
          sessionsApi.list(),
        ]);
        setDeptList(deptsRes.data);
        setSessionList(sessionsRes.data as Record<string, unknown>[]);
        if (isHod && user?.departmentId) setDepartmentId(user.departmentId);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load form options");
      } finally {
        setLoadingOptions(false);
      }
    }
    fetchOptions();
  }, [isHod, user?.departmentId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      departmentId,
      semester: Number(semester),
      sessionId,
      facultyName: fd.get("facultyName") as string,
      description: fd.get("description") as string || undefined,
      status,
    };

    try {
      setSaving(true);
      await lessonPlans.create(data, fileRef.current);
      toast.success("Lesson plan created successfully");
      router.push("/lesson-plans");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create lesson plan");
    } finally {
      setSaving(false);
    }
  }

  if (loadingOptions) {
    return (
      <div>
        <PageHeader title="Add Lesson Plan" description="Create a new lesson plan" />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Add Lesson Plan" description="Create a new lesson plan" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g. Data Structures Lesson Plan" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select required value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")} disabled={isHod}>
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
                <Label htmlFor="semester">Semester *</Label>
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
              <Label htmlFor="session">Session *</Label>
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
            <div className="space-y-2">
              <Label htmlFor="facultyName">Faculty Name *</Label>
              <Input id="facultyName" name="facultyName" required placeholder="Faculty who created this plan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description / Outline</Label>
              <Textarea id="description" name="description" rows={4} placeholder="Weekly breakdown, topics covered, learning objectives..." />
            </div>
            <div className="space-y-2">
              <Label>Upload Plan (PDF/DOC)</Label>
              <FileUpload accept=".pdf,.doc,.docx" onFilesSelected={(files) => { fileRef.current = files[0] ?? null; }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Lesson Plan"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/lesson-plans")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
