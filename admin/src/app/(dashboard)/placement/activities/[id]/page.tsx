/**
 * @file page.tsx
 * @description Placement activity editor — update or delete a placement drive, workshop, seminar, or mock interview
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { placements, sessions as sessionsApi, ApiError } from "@/lib/api";
import { PLACEMENT_ACTIVITY_TYPES } from "@/lib/constants";
import { toast } from "sonner";
import { Save, Trash2, Loader2 } from "lucide-react";

export default function EditPlacementActivityPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [activityData, setActivityData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [type, setType] = useState("DRIVE");
  const [sessionId, setSessionId] = useState("");
  const [sessionsList, setSessionsList] = useState<{ id: string; name: string }[]>([]);
  const imageRef = useRef<File | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [actRes, sessRes] = await Promise.all([
          placements.getActivity(id),
          sessionsApi.list(),
        ]);
        setActivityData(actRes.data);
        setType((actRes.data.type as string).toUpperCase());
        const list = sessRes.data as { id: string; name: string; isCurrent: boolean }[];
        setSessionsList(list);
        const current = (actRes.data.sessionId as string) || list.find((s) => s.isCurrent)?.id || "";
        setSessionId(current);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load activity");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!activityData) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Activity not found
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      type,
      date: fd.get("date") as string,
      description: fd.get("description") as string,
      sessionId,
    };

    try {
      await placements.updateActivity(id, data, imageRef.current);
      toast.success("Activity updated");
      router.push("/placement");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update activity");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await placements.deleteActivity(id);
      toast.success("Activity deleted");
      router.push("/placement");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete activity");
    } finally {
      setDeleting(false);
    }
  }

  // Format the stored date (ISO) to YYYY-MM-DD for the date input
  const defaultDate = activityData.date
    ? (activityData.date as string).slice(0, 10)
    : "";

  return (
    <div>
      <PageHeader
        title={`Edit: ${activityData.title as string}`}
        description="Update placement activity details"
      />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={activityData.title as string}
                placeholder="e.g. Campus Drive - TCS"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select required value={type} onValueChange={(v) => setType(v ?? "DRIVE")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLACEMENT_ACTIVITY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={defaultDate}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Session *</Label>
              <Select required value={sessionId} onValueChange={(v) => setSessionId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session">
                    {(value: string | null) => {
                      if (!value) return null;
                      const s = sessionsList.find((sess) => sess.id === value);
                      return s ? s.name : value;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {sessionsList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={4}
                defaultValue={activityData.description as string}
                placeholder="Activity details..."
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <FileUpload
                accept="image/*"
                onFilesSelected={(files) => { imageRef.current = files[0] ?? null; }}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/placement")}>
                Cancel
              </Button>
              <ConfirmDialog
                onConfirm={handleDelete}
                title="Delete Activity"
                description="This will permanently delete this placement activity. This action cannot be undone."
                confirmLabel="Delete"
              >
                <Button type="button" variant="destructive" className="ml-auto" disabled={deleting}>
                  {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </ConfirmDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
