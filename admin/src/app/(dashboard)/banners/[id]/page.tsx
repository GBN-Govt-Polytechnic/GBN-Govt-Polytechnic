/**
 * @file page.tsx
 * @description Edit banner form — update or delete an announcement banner
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { banners, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditBannerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<Record<string, unknown> | null>(null);
  const [variant, setVariant] = useState("INFO");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    banners.get(id).then((res) => {
      setItem(res.data);
      setVariant(String(res.data.variant ?? "INFO"));
      setIsActive(res.data.isActive !== false);
    }).catch((err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to load banner");
    }).finally(() => setLoading(false));
  }, [id]);

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
    data.linkUrl = linkUrl || null;
    data.linkText = (fd.get("linkText") as string) || null;
    const startDate = fd.get("startDate") as string;
    data.startDate = startDate || null;
    const endDate = fd.get("endDate") as string;
    data.endDate = endDate || null;

    try {
      setSaving(true);
      await banners.update(id, data);
      toast.success("Banner updated");
      router.push("/banners");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update banner");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await banners.delete(id);
      toast.success("Banner deleted");
      router.push("/banners");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete banner");
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Edit Banner" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested banner does not exist." />
        <Button variant="outline" onClick={() => router.push("/banners")}>Back to Banners</Button>
      </div>
    );
  }

  const startStr = item.startDate
    ? new Date(String(item.startDate)).toISOString().split("T")[0]
    : "";
  const endStr = item.endDate
    ? new Date(String(item.endDate)).toISOString().split("T")[0]
    : "";

  return (
    <div>
      <PageHeader title="Edit Banner" description={`Editing: ${String(item.title)}`} />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={String(item.title ?? "")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={3}
                defaultValue={String(item.message ?? "")}
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
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={Number(item.sortOrder ?? 0)} min={0} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link URL (Optional)</Label>
                <Input id="linkUrl" name="linkUrl" defaultValue={String(item.linkUrl ?? "")} placeholder="/news or https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkText">Link Text</Label>
                <Input id="linkText" name="linkText" defaultValue={String(item.linkText ?? "")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (Optional)</Label>
                <Input id="startDate" name="startDate" type="date" defaultValue={startStr} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input id="endDate" name="endDate" type="date" defaultValue={endStr} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/banners")}>Cancel</Button>
              </div>
              <ConfirmDialog
                title="Delete Banner"
                description="Are you sure you want to delete this banner? This action cannot be undone."
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
