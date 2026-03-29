/**
 * @file page.tsx
 * @description New achievement form — add an achievement with title, description, date, and optional image
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
import { achievements, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewAchievementPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const imageRef = useRef<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
    };
    const dateVal = fd.get("date") as string;
    if (dateVal) data.date = dateVal;

    try {
      setSaving(true);
      await achievements.create(data, imageRef.current);
      toast.success("Achievement added successfully");
      router.push("/achievements");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add achievement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Achievement" description="Record a new achievement or accolade" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g. State Level Energy Conservation Award" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Describe the achievement in detail..."
              />
            </div>
            <div className="space-y-2">
              <Label>Image (Optional)</Label>
              <FileUpload
                accept=".jpg,.jpeg,.png,.webp"
                onFilesSelected={(files) => { imageRef.current = files[0] ?? null; }}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Achievement"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/achievements")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
