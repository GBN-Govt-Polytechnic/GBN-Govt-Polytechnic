/**
 * @file page.tsx
 * @description Hero slide editor — update slide title, link, image, and active status
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/shared/file-upload";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { heroSlides, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditHeroSlidePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [slide, setSlide] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const imageFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (isNew) return;
    async function fetchSlide() {
      try {
        setLoading(true);
        const res = await heroSlides.get(id);
        setSlide(res.data);
        setIsActive((res.data.isActive as boolean) ?? true);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load slide");
      } finally {
        setLoading(false);
      }
    }
    fetchSlide();
  }, [id, isNew]);

  if (loading) {
    return (
      <div>
        <PageHeader title={isNew ? "Add Slide" : "Edit Hero Slide"} description="Loading..." />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isNew && !slide) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested slide does not exist." />
        <Button variant="outline" onClick={() => router.push("/hero-slides")}>Back to Hero Slides</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string || undefined,
      badge: formData.get("badge") as string || undefined,
      isActive,
    };

    try {
      setSaving(true);
      if (isNew) {
        await heroSlides.create(data, imageFileRef.current);
        toast.success("Slide created");
      } else {
        await heroSlides.update(id, data, imageFileRef.current);
        toast.success("Slide updated");
      }
      router.push("/hero-slides");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save slide");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await heroSlides.delete(id);
      toast.success("Slide deleted");
      router.push("/hero-slides");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete slide");
    }
  }

  return (
    <div>
      <PageHeader title={isNew ? "Add Hero Slide" : "Edit Hero Slide"} description={isNew ? "Create a new hero slide" : `Editing: ${slide?.title as string}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={(slide?.title as string) ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" name="subtitle" defaultValue={(slide?.subtitle as string) ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input id="badge" name="badge" defaultValue={(slide?.badge as string) ?? ""} placeholder="e.g. Estd. 1959, AICTE Approved" />
              <p className="text-xs text-muted-foreground">Small tag shown above the title</p>
            </div>
            <div className="space-y-2">
              <Label>{isNew ? "Image *" : "Replace Image"}</Label>
              <FileUpload accept="image/*" onFilesSelected={(files) => { imageFileRef.current = files[0] ?? null; }} />
              {slide?.imageUrl ? (
                <div className="mt-2 rounded-lg overflow-hidden border max-w-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.imageUrl as string} alt={slide.title as string} className="w-full h-auto" />
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isActive} onCheckedChange={setIsActive} id="active" />
              <Label htmlFor="active" className="font-normal">Active (visible on site)</Label>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : isNew ? "Create Slide" : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/hero-slides")}>Cancel</Button>
              </div>
              {!isNew && (
                <ConfirmDialog title="Delete Slide" description={`Permanently delete "${slide?.title as string}"?`} onConfirm={handleDelete}>
                  <Button type="button" variant="destructive" size="sm">Delete</Button>
                </ConfirmDialog>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
