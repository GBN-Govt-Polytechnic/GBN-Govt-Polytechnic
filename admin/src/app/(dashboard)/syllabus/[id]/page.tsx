/**
 * @file page.tsx
 * @description Syllabus editor — update syllabus title, department, semester, session, and PDF file attachment
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SEMESTERS } from "@/lib/constants";
import { syllabus as syllabusApi, departments as departmentsApi, sessions as sessionsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import type { Syllabus } from "@/lib/types";

export default function EditSyllabusPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [syllabusItem, setSyllabusItem] = useState<Syllabus | null>(null);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [sessionList, setSessionList] = useState<Record<string, unknown>[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [semester, setSemester] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const selectedFileRef = useRef<File | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [syllabusRes, deptsRes, sessionsRes] = await Promise.all([
          syllabusApi.get(id),
          departmentsApi.list({ limit: 100 }),
          sessionsApi.list(),
        ]);
        const s = syllabusRes.data as unknown as Syllabus;
        setSyllabusItem(s);
        setDeptList(deptsRes.data);
        setSessionList(sessionsRes.data as Record<string, unknown>[]);
        setDepartmentId(s.departmentId ?? "");
        setSemester(String((s as unknown as Record<string, unknown>).semester ?? ""));
        setSessionId((s as unknown as Record<string, unknown>).sessionId as string ?? "");
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          toast.error(err instanceof ApiError ? err.message : "Failed to load syllabus");
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
        <PageHeader title="Edit Syllabus" description="Loading..." />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (notFound || !syllabusItem) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested syllabus does not exist." />
        <Button variant="outline" onClick={() => router.push("/syllabus")}>Back to Syllabus</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      setSaving(true);
      await syllabusApi.update(id, {
        title: formData.get("title") as string,
        departmentId,
        semester: Number(semester),
        sessionId,
      }, selectedFileRef.current);
      toast.success("Syllabus updated successfully");
      router.push("/syllabus");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await syllabusApi.delete(id);
      toast.success("Syllabus deleted");
      router.push("/syllabus");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete syllabus");
    }
  }

  return (
    <div>
      <PageHeader title="Edit Syllabus" description={`Editing: ${syllabusItem.title}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={syllabusItem.title} />
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
              <Label>Replace File (PDF)</Label>
              <FileUpload accept=".pdf" onFilesSelected={(files) => { selectedFileRef.current = files[0] ?? null; }} />
              <p className="text-sm text-muted-foreground">Current: {syllabusItem.fileUrl.split("/").pop()}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/syllabus")}>Cancel</Button>
              </div>
              <ConfirmDialog title="Delete Syllabus" description={`Permanently delete "${syllabusItem.title}"?`} onConfirm={handleDelete}>
                <Button type="button" variant="destructive" size="sm">Delete</Button>
              </ConfirmDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
