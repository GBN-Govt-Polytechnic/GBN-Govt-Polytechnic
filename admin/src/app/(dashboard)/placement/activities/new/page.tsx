/**
 * @file page.tsx
 * @description New placement activity form — create a placement drive, workshop, or training event with details and image
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { PLACEMENT_ACTIVITY_TYPES } from "@/lib/constants";
import { placements, sessions as sessionsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewPlacementActivityPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState("DRIVE");
  const [sessionId, setSessionId] = useState("");
  const [sessionsList, setSessionsList] = useState<{ id: string; name: string }[]>([]);
  const imageRef = useRef<File | null>(null);

  useEffect(() => {
    sessionsApi.list().then((res) => {
      const list = res.data as { id: string; name: string; isCurrent: boolean }[];
      setSessionsList(list);
      const current = list.find((s) => s.isCurrent);
      if (current) setSessionId(current.id);
    }).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      type,
      date: fd.get("date") as string,
      description: fd.get("description") as string,
      sessionId,
    };

    try {
      setSaving(true);
      await placements.createActivity(data, imageRef.current);
      toast.success("Placement activity added");
      router.push("/placement");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add activity");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Activity" description="Create a new placement activity" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g. Campus Drive - TCS" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select required value={type} onValueChange={(v) => setType(v ?? "")}>
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
                <Input id="date" name="date" type="date" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Session *</Label>
              <Select required value={sessionId} onValueChange={(v) => setSessionId(v ?? "")} items={sessionsList.map(s => ({ value: s.id, label: s.name }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
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
              <Textarea id="description" name="description" required rows={4} placeholder="Activity details..." />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <FileUpload accept="image/*" onFilesSelected={(files) => { imageRef.current = files[0] ?? null; }} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Adding..." : "Add Activity"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/placement")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
