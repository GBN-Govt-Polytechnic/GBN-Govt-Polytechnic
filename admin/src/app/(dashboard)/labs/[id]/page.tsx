/**
 * @file page.tsx
 * @description Lab editor — update lab name, department, description, equipment list, and photo
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
import { FileUpload } from "@/components/shared/file-upload";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { labs as labsApi, departments as departmentsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditLabPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [lab, setLab] = useState<Record<string, unknown> | null>(null);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [labRes, deptRes] = await Promise.all([
          labsApi.get(id),
          departmentsApi.list(),
        ]);
        setLab(labRes.data);
        setDeptList(deptRes.data);
        setDepartmentId(labRes.data.departmentId as string ?? "");
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setLab(null);
        } else {
          toast.error(err instanceof ApiError ? err.message : "Failed to load lab");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!lab) {
    return (
      <div>
        <PageHeader title="Lab Not Found" description="The requested lab does not exist." />
        <Button variant="outline" onClick={() => router.push("/labs")}>Back to Labs</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = e.currentTarget;
    const formDataObj = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      departmentId,
      incharge: (form.elements.namedItem("incharge") as HTMLInputElement).value || undefined,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value || undefined,
    };

    try {
      await labsApi.update(id, formDataObj, imageFile);
      toast.success("Lab updated successfully");
      router.push("/labs");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await labsApi.delete(id);
      toast.success("Lab deleted");
      router.push("/labs");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete lab");
    }
  }

  return (
    <div>
      <PageHeader title="Edit Lab" description={`Editing: ${lab.name as string}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Lab Name *</Label>
              <Input id="name" name="name" required defaultValue={lab.name as string} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")}>
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
              <Label htmlFor="incharge">In-charge</Label>
              <Input id="incharge" name="incharge" defaultValue={(lab.incharge as string) ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={(lab.description as string) ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Lab Photo</Label>
              <FileUpload accept="image/*" onFilesSelected={(files) => setImageFile(files[0] ?? null)} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/labs")}>Cancel</Button>
              </div>
              <ConfirmDialog title="Delete Lab" description={`Permanently delete "${lab.name as string}"? This cannot be undone.`} onConfirm={handleDelete}>
                <Button type="button" variant="destructive" size="sm">Delete</Button>
              </ConfirmDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
