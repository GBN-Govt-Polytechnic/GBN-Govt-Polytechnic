/**
 * @file page.tsx
 * @description Edit MoU form — update or delete a memorandum of understanding record
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/shared/file-upload";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Switch } from "@/components/ui/switch";
import { mous, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditMoUPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<Record<string, unknown> | null>(null);
  const [isActive, setIsActive] = useState(true);
  const docRef = useRef<File | null>(null);

  useEffect(() => {
    mous.get(id).then((res) => {
      setItem(res.data);
      setIsActive(res.data.isActive !== false);
    }).catch((err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to load MoU");
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      companyName: fd.get("companyName") as string,
      purpose: fd.get("purpose") as string,
      isActive,
    };
    const signedDate = fd.get("signedDate") as string;
    data.signedDate = signedDate || null;
    const validUntil = fd.get("validUntil") as string;
    data.validUntil = validUntil || null;

    try {
      setSaving(true);
      await mous.update(id, data, docRef.current);
      toast.success("MoU updated");
      router.push("/mous");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update MoU");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await mous.delete(id);
      toast.success("MoU deleted");
      router.push("/mous");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete MoU");
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Edit MoU" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested MoU does not exist." />
        <Button variant="outline" onClick={() => router.push("/mous")}>Back to MoUs</Button>
      </div>
    );
  }

  const signedStr = item.signedDate
    ? new Date(String(item.signedDate)).toISOString().split("T")[0]
    : "";
  const validStr = item.validUntil
    ? new Date(String(item.validUntil)).toISOString().split("T")[0]
    : "";

  return (
    <div>
      <PageHeader title="Edit MoU" description={`Editing: ${String(item.companyName)}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" name="companyName" required defaultValue={String(item.companyName ?? "")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                name="purpose"
                required
                rows={4}
                defaultValue={String(item.purpose ?? "")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signedDate">Signed Date</Label>
                <Input id="signedDate" name="signedDate" type="date" defaultValue={signedStr} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input id="validUntil" name="validUntil" type="date" defaultValue={validStr} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
            {(item.documentUrl as string) && (
              <div className="space-y-1">
                <Label>Current Document</Label>
                <a
                  href={String(item.documentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 underline block"
                >
                  {String(item.documentFileName || "View document")}
                </a>
              </div>
            )}
            <div className="space-y-2">
              <Label>Replace Document (Optional)</Label>
              <FileUpload
                accept=".pdf,.doc,.docx"
                onFilesSelected={(files) => { docRef.current = files[0] ?? null; }}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/mous")}>Cancel</Button>
              </div>
              <ConfirmDialog
                title="Delete MoU"
                description="Are you sure you want to delete this MoU? This action cannot be undone."
                onConfirm={handleDelete}
              >
                <Button type="button" variant="destructive">Delete</Button>
              </ConfirmDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
