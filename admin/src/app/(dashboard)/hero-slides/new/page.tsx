/**
 * @file page.tsx
 * @description New hero slide form — create a homepage carousel slide with title, link, image, and active toggle
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
import { FileUpload } from "@/components/shared/file-upload";
import { heroSlides, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewHeroSlidePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const imageRef = useRef<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      subtitle: fd.get("subtitle") as string || undefined,
      badge: fd.get("badge") as string || undefined,
      isActive,
    };

    try {
      setSaving(true);
      await heroSlides.create(data, imageRef.current);
      toast.success("Hero slide created successfully");
      router.push("/hero-slides");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create slide");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Hero Slide" description="Create a new homepage carousel slide" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="Slide headline" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" name="subtitle" placeholder="Optional subtitle text" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input id="badge" name="badge" placeholder="e.g. Estd. 1959, AICTE Approved" />
              <p className="text-xs text-muted-foreground">Small tag shown above the title</p>
            </div>
            <div className="space-y-2">
              <Label>Slide Image *</Label>
              <FileUpload accept="image/*" onFilesSelected={(files) => { imageRef.current = files[0] ?? null; }} />
              <p className="text-xs text-muted-foreground">Recommended: 1920x600px or 16:5 ratio</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isActive} onCheckedChange={setIsActive} id="active" />
              <Label htmlFor="active" className="font-normal">Active (visible on site)</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Slide"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/hero-slides")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
