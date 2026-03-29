/**
 * @file page.tsx
 * @description New document form — upload an institutional PDF document with title, category, and year
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { documents as documentsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "APPROVAL", label: "Approvals (AICTE, SBTE)" },
  { value: "MANDATORY_DISCLOSURE", label: "Mandatory Disclosure" },
  { value: "FEE_STRUCTURE", label: "Fee Structure / Fee Fixation" },
  { value: "RTI", label: "RTI (Right to Information)" },
  { value: "ANNUAL_REPORT", label: "Annual Reports" },
  { value: "COMMITTEE", label: "Committee Documents" },
  { value: "GOVT_ORDER", label: "Government Orders / Circulars" },
  { value: "OTHER", label: "Other" },
] as const;

export default function NewDocumentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const fileRef = useRef<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!category) { toast.error("Please select a category"); return; }
    if (!fileRef.current) { toast.error("Please upload a PDF file"); return; }

    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      category,
      year: fd.get("year") as string,
      sortOrder: fd.get("sortOrder") as string || "0",
      isActive: String(isActive),
    };

    try {
      setSaving(true);
      await documentsApi.create(data, fileRef.current);
      toast.success("Document uploaded successfully");
      router.push("/documents");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to upload document");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Document" description="Upload a new institutional document" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g. AICTE Approval Letter 2025-26" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select required value={category} onValueChange={(v) => setCategory(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category">
                      {(value: string | null) => {
                        if (!value) return null;
                        return CATEGORIES.find((c) => c.value === value)?.label ?? value;
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  required
                  min={2000}
                  max={2100}
                  defaultValue={new Date().getFullYear()}
                  placeholder="2025"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Display Order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} min={0} />
            </div>
            <div className="space-y-2">
              <Label>PDF File *</Label>
              <FileUpload
                accept=".pdf"
                maxSize={20}
                onFilesSelected={(files) => { fileRef.current = files[0] ?? null; }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Visible on public website</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Uploading..." : "Upload Document"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/documents")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
