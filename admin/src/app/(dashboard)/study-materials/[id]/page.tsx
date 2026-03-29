/**
 * @file page.tsx
 * @description Study material editor — update title, department, semester, session, and file attachment
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
import { studyMaterials, departments as departmentsApi, sessions as sessionsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import type { StudyMaterial } from "@/lib/types";

export default function EditStudyMaterialPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<StudyMaterial | null>(null);
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
        const [materialRes, deptsRes, sessionsRes] = await Promise.all([
          studyMaterials.get(id),
          departmentsApi.list({ limit: 100 }),
          sessionsApi.list(),
        ]);
        const m = materialRes.data as unknown as StudyMaterial;
        setMaterial(m);
        setDeptList(deptsRes.data);
        setSessionList(sessionsRes.data as Record<string, unknown>[]);
        setDepartmentId(m.departmentId ?? "");
        setSemester(String(m.semester ?? ""));
        setSessionId((m as unknown as Record<string, unknown>).sessionId as string ?? "");
        setStatus((m as unknown as Record<string, unknown>).status as string ?? "DRAFT");
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          toast.error(err instanceof ApiError ? err.message : "Failed to load study material");
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
        <PageHeader title="Edit Study Material" description="Loading..." />
        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (notFound || !material) {
    return (
      <div>
        <PageHeader title="Material Not Found" description="The requested study material does not exist." />
        <Button variant="outline" onClick={() => router.push("/study-materials")}>Back to Study Materials</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      setSaving(true);
      await studyMaterials.update(id, {
        title: formData.get("title") as string,
        departmentId,
        semester: Number(semester),
        sessionId,
        description: formData.get("description") as string,
        status,
      }, selectedFileRef.current);
      toast.success("Study material updated successfully");
      router.push("/study-materials");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await studyMaterials.delete(id);
      toast.success("Study material deleted");
      router.push("/study-materials");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete study material");
    }
  }

  return (
    <div>
      <PageHeader title="Edit Study Material" description={`Editing: ${material.title}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={material.title} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
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
                <Label htmlFor="semester">Semester *</Label>
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
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={material.description ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Replace File</Label>
              <FileUpload accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip" onFilesSelected={(files) => { selectedFileRef.current = files[0] ?? null; }} />
              {material.fileUrl ? (
                <p className="text-sm text-muted-foreground">Current file: {material.fileUrl.split("/").pop()}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
                <Button type="button" variant="outline" onClick={() => router.push("/study-materials")}>Cancel</Button>
              </div>
              <ConfirmDialog title="Delete Material" description={`Permanently delete "${material.title}"?`} onConfirm={handleDelete}>
                <Button type="button" variant="destructive" size="sm">Delete</Button>
              </ConfirmDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
