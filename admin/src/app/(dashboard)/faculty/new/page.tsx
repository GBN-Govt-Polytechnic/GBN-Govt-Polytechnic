/**
 * @file page.tsx
 * @description New faculty form — add a faculty member with personal details, department, photo, and active status
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
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/shared/file-upload";
import { departments as departmentsApi, faculty as facultyApi, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export default function NewFacultyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await departmentsApi.list();
        let data = res.data;
        if (user?.role === "hod") {
          data = data.filter((d: Record<string, unknown>) => d.slug === user.departmentSlug);
        }
        setDeptList(data);
        if (data.length > 0) setDepartmentId(data[0].id as string);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load departments");
      } finally {
        setLoadingDepts(false);
      }
    }
    load();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      departmentId,
      designation: (form.elements.namedItem("designation") as HTMLInputElement).value,
      qualification: (form.elements.namedItem("qualification") as HTMLInputElement).value,
      specialization: (form.elements.namedItem("specialization") as HTMLInputElement).value || undefined,
      email: (form.elements.namedItem("email") as HTMLInputElement).value || undefined,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value || undefined,
      experience: (form.elements.namedItem("experience") as HTMLInputElement).value || undefined,
      isActive,
    };

    try {
      await facultyApi.create(formData, photoFile);
      toast.success("Faculty member created successfully");
      router.push("/faculty");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loadingDepts) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Add Faculty" description="Add a new faculty member" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" placeholder="Dr. John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {deptList.map((d) => (
                      <SelectItem key={d.id as string} value={d.id as string}>
                        {d.code as string} — {d.name as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input id="designation" placeholder="Associate Professor" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification *</Label>
                <Input id="qualification" placeholder="Ph.D. (CSE)" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" placeholder="Machine Learning" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="faculty@gpnilokheri.ac.in" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="9876543210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input id="experience" placeholder="10 Years" />
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
                {saving ? "Saving..." : "Save Faculty"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
