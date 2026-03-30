/**
 * @file page.tsx
 * @description Faculty editor — update faculty profile, department assignment, photo upload, and active status toggle
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/shared/file-upload";
import { faculty as facultyApi, departments as departmentsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Save, Trash2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [facultyData, setFacultyData] = useState<Record<string, unknown> | null>(null);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [fRes, dRes] = await Promise.all([
          facultyApi.get(id),
          departmentsApi.list(),
        ]);
        setFacultyData(fRes.data);
        setDeptList(dRes.data);
        setIsActive(fRes.data.isActive as boolean ?? true);
        setDepartmentId(fRes.data.departmentId as string ?? "");
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load faculty");
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

  if (!facultyData) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Faculty not found</div>;
  }

  const dept = deptList.find((d) => d.id === facultyData.departmentId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = e.currentTarget;
    const formDataObj = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      departmentId,
      designation: (form.elements.namedItem("designation") as HTMLInputElement).value,
      qualification: (form.elements.namedItem("qualification") as HTMLInputElement).value,
      experience: (form.elements.namedItem("experience") as HTMLInputElement).value || undefined,
      specialization: (form.elements.namedItem("specialization") as HTMLInputElement).value || undefined,
      email: (form.elements.namedItem("email") as HTMLInputElement).value || undefined,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value || undefined,
      isActive,
    };

    try {
      await facultyApi.update(id, formDataObj, photoFile);
      toast.success("Faculty updated");
      router.push("/faculty");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await facultyApi.delete(id);
      toast.success("Faculty deleted");
      router.push("/faculty");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete faculty");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader title={`Edit: ${facultyData.name as string}`} description={`${(dept?.code as string) ?? ""} Department`} />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input name="name" defaultValue={facultyData.name as string} />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")} items={deptList.map(d => ({ value: d.id as string, label: `${d.code as string} — ${d.name as string}` }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {deptList.map((d) => (
                      <SelectItem key={d.id as string} value={d.id as string}>{d.code as string} — {d.name as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input name="designation" defaultValue={facultyData.designation as string} />
              </div>
              <div className="space-y-2">
                <Label>Qualification</Label>
                <Input name="qualification" defaultValue={facultyData.qualification as string} />
              </div>
              <div className="space-y-2">
                <Label>Experience</Label>
                <Input name="experience" defaultValue={(facultyData.experience as string) ?? ""} placeholder="10 Years" />
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input name="specialization" defaultValue={(facultyData.specialization as string) ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" defaultValue={(facultyData.email as string) ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" defaultValue={(facultyData.phone as string) ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Photo</Label>
              <FileUpload accept="image/*" maxSize={5} onFilesSelected={(files) => setPhotoFile(files[0] ?? null)} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Active</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Updating..." : "Update"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="button" variant="destructive" className="ml-auto" disabled={deleting} onClick={handleDelete}>
                {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
