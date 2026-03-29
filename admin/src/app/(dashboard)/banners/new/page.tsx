/**
 * @file page.tsx
 * @description New banner form — create an announcement banner with variant, scheduling, and optional link
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { banners, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewBannerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [variant, setVariant] = useState("INFO");
  const [isActive, setIsActive] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      title: fd.get("title") as string,
      message: fd.get("message") as string,
      variant,
      isActive,
      sortOrder: Number(fd.get("sortOrder") || 0),
    };
    const linkUrl = fd.get("linkUrl") as string;
    if (linkUrl) {
      data.linkUrl = linkUrl;
      data.linkText = (fd.get("linkText") as string) || "Learn More";
    }
    const startDate = fd.get("startDate") as string;
    if (startDate) data.startDate = startDate;
    const endDate = fd.get("endDate") as string;
    if (endDate) data.endDate = endDate;

    try {
      setSaving(true);
      await banners.create(data);
      toast.success("Banner created successfully");
      router.push("/banners");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create banner");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Banner" description="Create a new announcement banner" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g. Admission Open 2025-26" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={3}
                placeholder="Write the banner message..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Variant *</Label>
                <Select value={variant} onValueChange={(value) => setVariant(value ?? "INFO")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INFO">Info (Blue)</SelectItem>
                    <SelectItem value="WARNING">Warning (Amber)</SelectItem>
                    <SelectItem value="URGENT">Urgent (Red)</SelectItem>
                    <SelectItem value="SUCCESS">Success (Green)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Display Order</Label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} min={0} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link URL (Optional)</Label>
                <Input id="linkUrl" name="linkUrl" placeholder="/news or https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkText">Link Text</Label>
                <Input id="linkText" name="linkText" placeholder="Learn More" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (Optional)</Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active immediately</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Banner"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/banners")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
