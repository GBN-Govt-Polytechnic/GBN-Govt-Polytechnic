/**
 * @file page.tsx
 * @description New album form — create a gallery album with title, description, and publish toggle
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { gallery, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewAlbumPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      description: fd.get("description") as string || undefined,
      isPublished,
    };

    try {
      setSaving(true);
      const res = await gallery.createAlbum(data);
      toast.success("Album created — now upload images");
      router.push(`/gallery/${(res.data as Record<string, unknown>).id}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create album");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Create Album" description="Create a new photo album" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Album Title *</Label>
              <Input id="title" name="title" required placeholder="e.g. Annual Day 2026" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} placeholder="Brief description of the album..." />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} id="published" />
              <Label htmlFor="published" className="font-normal">Publish immediately</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Album"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/gallery")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
