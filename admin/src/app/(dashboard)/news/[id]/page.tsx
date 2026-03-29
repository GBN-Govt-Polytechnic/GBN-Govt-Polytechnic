/**
 * @file page.tsx
 * @description News editor — update news article with markdown editor, category, status, and single file upload
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/file-upload";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MarkdownEditor } from "@/components/shared/markdown-editor";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { news, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditNewsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [post, setPost] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("NEWS");
  const [status, setStatus] = useState("PUBLISHED");
  const [content, setContent] = useState("");
  const fileRef = useRef<File | null>(null);

  useEffect(() => {
    if (isNew) return;
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await news.get(id);
        setPost(res.data);
        setCategory((res.data.category as string) ?? "NEWS");
        setStatus((res.data.status as string) ?? "PUBLISHED");
        setContent((res.data.content as string) ?? "");
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, isNew]);

  if (loading) {
    return (
      <div>
        <PageHeader title={isNew ? "Create Post" : "Edit Post"} description="Loading..." />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isNew && !post) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested post does not exist." />
        <Button variant="outline" onClick={() => router.push("/news")}>Back to News</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawDate = formData.get("publishDate") as string;

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    const data: Record<string, unknown> = {
      title: formData.get("title") as string,
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
      if (isNew) {
        await news.create(data, imageFile, attachmentFile);
        toast.success("Post created successfully");
      } else {
        await news.update(id, data, imageFile, attachmentFile);
        toast.success("Post updated successfully");
      }
      router.push("/news");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await news.delete(id);
      toast.success("Post deleted");
      router.push("/news");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete post");
    }
  }

  const existingFile = (post?.imageUrl as string) || (post?.attachmentUrl as string);

  return (
    <div>
      <PageHeader title={isNew ? "Create Post" : "Edit Post"} description={isNew ? "Create a new news post" : `Editing: ${post?.title as string}`} />
      <Card className="max-w-3xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={(post?.title as string) ?? ""} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
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
                <Select value={status} onValueChange={(v) => setStatus(v ?? "")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input id="publishDate" name="publishDate" type="date" defaultValue={post?.publishDate ? new Date(post.publishDate as string).toISOString().split("T")[0] : ""} />
            </div>
            <div className="space-y-2">
              <Label>Content * <span className="text-xs text-muted-foreground font-normal ml-1">Supports Markdown — bold, headings, lists, links</span></Label>
              <MarkdownEditor value={content} onChange={setContent} />
            </div>
            <div className="space-y-2">
              <Label>File (Image or Document)</Label>
              <FileUpload accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onFilesSelected={(files) => { fileRef.current = files[0] ?? null; }} />
              {existingFile && (
                <p className="text-sm text-muted-foreground">Current: {existingFile.split("/").pop()}</p>
              )}
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : isNew ? "Create Post" : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/news")}>Cancel</Button>
              </div>
              {!isNew && (
                <ConfirmDialog title="Delete Post" description={`Permanently delete "${post?.title as string}"?`} onConfirm={handleDelete}>
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
