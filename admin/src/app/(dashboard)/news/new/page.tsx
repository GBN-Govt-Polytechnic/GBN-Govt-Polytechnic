/**
 * @file page.tsx
 * @description New news article form — create a news/notice with markdown editor, category, status, and single file upload
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { MarkdownEditor } from "@/components/shared/markdown-editor";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { news, ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function NewNewsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("NEWS");
  const [status, setStatus] = useState("PUBLISHED");
  const [content, setContent] = useState("");
  const fileRef = useRef<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rawDate = fd.get("publishDate") as string;

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    const data: Record<string, unknown> = {
      title: fd.get("title") as string,
      content,
      category,
      status,
    };
    if (rawDate) data.publishDate = rawDate;

    const file = fileRef.current;
    const isImage = file?.type?.startsWith("image/");
    const imageFile = file && isImage ? file : null;
    const attachmentFile = file && !isImage ? file : null;

    try {
      setSaving(true);
      await news.create(data, imageFile, attachmentFile);
      toast.success("Post created successfully");
      router.push("/news");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Create Post" description="Write a new news post, notice, circular, or tender" />
      <Card className="max-w-3xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="Post title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select required value={category} onValueChange={(v) => setCategory(v ?? "")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {NEWS_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select required value={status} onValueChange={(v) => setStatus(v ?? "")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input id="publishDate" name="publishDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label>Content * <span className="text-xs text-muted-foreground font-normal ml-1">Supports Markdown — bold, headings, lists, links</span></Label>
              <MarkdownEditor value={content} onChange={setContent} />
            </div>
            <div className="space-y-2">
              <Label>File (Image or Document)</Label>
              <FileUpload accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onFilesSelected={(files) => { fileRef.current = files[0] ?? null; }} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Post"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/news")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
