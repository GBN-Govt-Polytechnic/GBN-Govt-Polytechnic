/**
 * @file page.tsx
 * @description Event editor — update event details, date, location, status, and image upload
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
import { events, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [event, setEvent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const imageFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (isNew) return;
    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await events.get(id);
        setEvent(res.data);
        setStatus((res.data.status as string) ?? "DRAFT");
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id, isNew]);

  if (loading) {
    return (
      <div>
        <PageHeader title={isNew ? "Create Event" : "Edit Event"} description="Loading..." />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isNew && !event) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested event does not exist." />
        <Button variant="outline" onClick={() => router.push("/events")}>Back to Events</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      startDate: formData.get("date") as string,
      endDate: formData.get("endDate") as string || undefined,
      location: formData.get("location") as string || undefined,
      status,
    };

    try {
      setSaving(true);
      if (isNew) {
        await events.create(data, imageFileRef.current);
        toast.success("Event created successfully");
      } else {
        await events.update(id, data, imageFileRef.current);
        toast.success("Event updated successfully");
      }
      router.push("/events");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save event");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await events.delete(id);
      toast.success("Event deleted");
      router.push("/events");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete event");
    }
  }

  return (
    <div>
      <PageHeader title={isNew ? "Create Event" : "Edit Event"} description={isNew ? "Create a new event" : `Editing: ${event?.title as string}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input id="title" name="title" required defaultValue={(event?.title as string) ?? ""} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Start Date *</Label>
                <Input id="date" name="date" type="date" required defaultValue={event?.startDate ? new Date(String(event.startDate)).toISOString().split("T")[0] : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" defaultValue={event?.endDate ? new Date(String(event.endDate)).toISOString().split("T")[0] : ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={(event?.location as string) ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" required rows={6} defaultValue={(event?.description as string) ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Event Image</Label>
              <FileUpload accept="image/*" onFilesSelected={(files) => { imageFileRef.current = files[0] ?? null; }} />
              {event?.imageUrl ? (
                <p className="text-sm text-muted-foreground">Current: {(event.imageUrl as string).split("/").pop()}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : isNew ? "Create Event" : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/events")}>Cancel</Button>
              </div>
              {!isNew && (
                <ConfirmDialog title="Delete Event" description={`Permanently delete "${event?.title as string}"?`} onConfirm={handleDelete}>
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
