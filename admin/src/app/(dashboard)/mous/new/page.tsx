/**
 * @file page.tsx
 * @description New MoU form — add a memorandum of understanding with company details and optional document upload
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
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/shared/file-upload";
import { mous, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewMoUPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const docRef = useRef<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      companyName: fd.get("companyName") as string,
      purpose: fd.get("purpose") as string,
      isActive: true,
    };
    const signedDate = fd.get("signedDate") as string;
    if (signedDate) data.signedDate = signedDate;
    const validUntil = fd.get("validUntil") as string;
    if (validUntil) data.validUntil = validUntil;

    try {
      setSaving(true);
      await mous.create(data, docRef.current);
      toast.success("MoU added successfully");
      router.push("/mous");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add MoU");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add MoU" description="Record a new memorandum of understanding" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" name="companyName" required placeholder="e.g. Toyota Boshoku" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                name="purpose"
                required
                rows={4}
                placeholder="Describe the purpose of this MoU..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signedDate">Signed Date</Label>
                <Input id="signedDate" name="signedDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input id="validUntil" name="validUntil" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Document (Optional)</Label>
              <FileUpload
                accept=".pdf,.doc,.docx"
                onFilesSelected={(files) => { docRef.current = files[0] ?? null; }}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add MoU"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/mous")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
