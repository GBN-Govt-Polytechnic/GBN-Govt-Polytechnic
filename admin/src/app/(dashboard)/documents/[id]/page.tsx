/**
 * @file page.tsx
 * @description Document editor — update document title, category, year, visibility, and optionally replace the PDF
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { documents as documentsApi, ApiError } from "@/lib/api";
import { toSafeUrl } from "@/lib/safe-url";
import type { PublicDocument } from "@/lib/types";
import { toast } from "sonner";
import { Save, Trash2, Loader2, ExternalLink } from "lucide-react";

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

export default function EditDocumentPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [doc, setDoc] = useState<PublicDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const fileRef = useRef<File | null>(null);

  useEffect(() => {
    documentsApi.get(id).then((res) => {
      const d = res.data as unknown as PublicDocument;
      setDoc(d);
      setCategory(d.category);
      setIsActive(d.isActive);
    }).catch((err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to load document");
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      title: fd.get("title") as string,
      category,
      year: fd.get("year") as string,
      sortOrder: fd.get("sortOrder") as string,
      isActive: String(isActive),
    };

    try {
      await documentsApi.update(id, data, fileRef.current);
      toast.success("Document updated successfully");
      router.push("/documents");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await documentsApi.delete(id);
      toast.success("Document deleted");
      router.push("/documents");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete document");
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested document does not exist." />
        <Button variant="outline" onClick={() => router.push("/documents")}>Back to Documents</Button>
      </div>
    );
  }

  const safeFileUrl = toSafeUrl(doc.fileUrl);

  return (
    <div>
      <PageHeader title="Edit Document" description={`Editing: ${doc.title}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={doc.title} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select required value={category} onValueChange={(v) => setCategory(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue>
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
                <Input id="year" name="year" type="number" required min={2000} max={2100} defaultValue={doc.year} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Display Order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={doc.sortOrder} min={0} />
            </div>
            <div className="space-y-2">
              <Label>Replace PDF (optional)</Label>
              <FileUpload
                accept=".pdf"
                maxSize={20}
                onFilesSelected={(files) => { fileRef.current = files[0] ?? null; }}
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Current: {doc.fileName}</span>
                {safeFileUrl && (
                  <a href={safeFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> View
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Visible on public website</Label>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/documents")}>Cancel</Button>
              </div>
              <ConfirmDialog
                title="Delete Document"
                description={`Permanently delete "${doc.title}"? This cannot be undone.`}
                onConfirm={handleDelete}
              >
                <Button type="button" variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </ConfirmDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
