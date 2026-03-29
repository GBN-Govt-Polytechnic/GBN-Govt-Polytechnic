/**
 * @file page.tsx
 * @description New syllabus form — upload a syllabus PDF with title, department, semester, and session selection
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { SEMESTERS } from "@/lib/constants";
import { syllabus, departments as departmentsApi, sessions as sessionsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewSyllabusPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isHod = user?.role === "hod";
  const [saving, setSaving] = useState(false);
  const [departmentId, setDepartmentId] = useState(user?.departmentId ?? "");
  const [semester, setSemester] = useState("");
  const [sessionId, setSessionId] = useState("");
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
    };

    try {
      setSaving(true);
      await syllabus.create(data, fileRef.current);
      toast.success("Syllabus uploaded successfully");
      router.push("/syllabus");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to upload syllabus");
    } finally {
      setSaving(false);
    }
  }

  if (loadingOptions) {
    return (
      <div>
        <PageHeader title="Upload Syllabus" description="Add a new syllabus document" />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Upload Syllabus" description="Add a new syllabus document" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g. CSE Syllabus 2025-26" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
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
            <div className="space-y-2">
              <Label>Upload File (PDF) *</Label>
              <FileUpload accept=".pdf" onFilesSelected={(files) => { fileRef.current = files[0] ?? null; }} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Uploading..." : "Upload Syllabus"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/syllabus")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
