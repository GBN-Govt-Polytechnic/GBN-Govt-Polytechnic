/**
 * @file page.tsx
 * @description Edit achievement form — update or delete an achievement record
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
import { achievements, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditAchievementPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<Record<string, unknown> | null>(null);
  const imageRef = useRef<File | null>(null);

  useEffect(() => {
    achievements.get(id).then((res) => {
      setItem(res.data);
    }).catch((err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to load achievement");
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
    };
    const dateVal = fd.get("date") as string;
    data.date = dateVal || null;

    try {
      setSaving(true);
      await achievements.update(id, data, imageRef.current);
      toast.success("Achievement updated");
      router.push("/achievements");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update achievement");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await achievements.delete(id);
      toast.success("Achievement deleted");
      router.push("/achievements");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete achievement");
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Edit Achievement" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested achievement does not exist." />
        <Button variant="outline" onClick={() => router.push("/achievements")}>Back to Achievements</Button>
      </div>
    );
  }

  const dateStr = item.date
    ? new Date(String(item.date)).toISOString().split("T")[0]
    : "";

  return (
    <div>
      <PageHeader title="Edit Achievement" description="Update achievement details" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={String(item.title ?? "")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={dateStr} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={5}
                defaultValue={String(item.description ?? "")}
              />
            </div>
            {(item.imageUrl as string) && (
              <div className="space-y-1">
                <Label>Current Image</Label>
                <a
                  href={String(item.imageUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 underline block"
                >
                  View current image
                </a>
              </div>
            )}
            <div className="space-y-2">
              <Label>Replace Image (Optional)</Label>
              <FileUpload
                accept=".jpg,.jpeg,.png,.webp"
                onFilesSelected={(files) => { imageRef.current = files[0] ?? null; }}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/achievements")}>Cancel</Button>
              </div>
              <ConfirmDialog
                title="Delete Achievement"
                description="Are you sure you want to delete this achievement? This action cannot be undone."
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
