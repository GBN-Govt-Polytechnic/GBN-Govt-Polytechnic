/**
 * @file page.tsx
 * @description New event form — create an event with title, description, date range, location, status, and image
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { events, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const imageRef = useRef<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      startDate: fd.get("date") as string,
      endDate: fd.get("endDate") as string || undefined,
      location: fd.get("location") as string || undefined,
      status,
    };

    try {
      setSaving(true);
      await events.create(data, imageRef.current);
      toast.success("Event created successfully");
      router.push("/events");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create event");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Create Event" description="Add a new college event" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input id="title" name="title" required placeholder="e.g. Annual Tech Fest 2026" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Start Date *</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g. Main Auditorium" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" required rows={6} placeholder="Describe the event, agenda, participants..." />
            </div>
            <div className="space-y-2">
              <Label>Event Image</Label>
              <FileUpload accept="image/*" onFilesSelected={(files) => { imageRef.current = files[0] ?? null; }} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Event"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/events")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
