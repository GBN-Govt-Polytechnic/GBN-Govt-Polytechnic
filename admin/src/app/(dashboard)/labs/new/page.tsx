/**
 * @file page.tsx
 * @description New lab form — create a lab with name, department, description, equipment, and photo upload
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { labs, departments as departmentsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewLabPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [deptList, setDeptList] = useState<Record<string, unknown>[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const imageRef = useRef<File | null>(null);

  useEffect(() => {
    async function fetchDepts() {
      try {
        const res = await departmentsApi.list({ limit: 100 });
        setDeptList(res.data);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load departments");
      } finally {
        setLoadingDepts(false);
      }
    }
    fetchDepts();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      departmentId,
      incharge: fd.get("incharge") as string || undefined,
      description: fd.get("description") as string || undefined,
    };

    try {
      setSaving(true);
      await labs.create(data, imageRef.current);
      toast.success("Lab created successfully");
      router.push("/labs");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create lab");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Lab" description="Create a new laboratory entry" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Lab Name *</Label>
              <Input id="name" name="name" required placeholder="e.g. Computer Networks Lab" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              {loadingDepts ? (
                <div className="flex items-center gap-2 h-10 px-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                </div>
              ) : (
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
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="incharge">In-charge</Label>
              <Input id="incharge" name="incharge" placeholder="Faculty name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} placeholder="Lab description and available equipment..." />
            </div>
            <div className="space-y-2">
              <Label>Lab Photo</Label>
              <FileUpload accept="image/*" onFilesSelected={(files) => { imageRef.current = files[0] ?? null; }} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Lab"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/labs")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
