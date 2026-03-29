/**
 * @file page.tsx
 * @description Album editor — update album metadata, manage image uploads, toggle published status, set cover, and delete images
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
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/shared/file-upload";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { gallery, ApiError } from "@/lib/api";
import { Trash2, ImageIcon, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import type { GalleryImage } from "@/lib/types";

/** Maximum files per upload batch (backend limit) */
const BATCH_SIZE = 20;

export default function AlbumDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [album, setAlbum] = useState<Record<string, unknown> | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [settingCover, setSettingCover] = useState<string | null>(null);
  const uploadFilesRef = useRef<File[]>([]);

  useEffect(() => {
    if (isNew) return;
    async function fetchAlbum() {
      try {
        setLoading(true);
        const res = await gallery.getAlbum(id);
        setAlbum(res.data);
        setIsPublished((res.data.isPublished as boolean) ?? false);
        setImages((res.data.images as unknown as GalleryImage[]) ?? []);
        // Determine current cover image ID from the album's coverUrl
        const albumImages = (res.data.images as unknown as GalleryImage[]) ?? [];
        const coverUrl = res.data.coverUrl as string | undefined;
        if (coverUrl) {
          const coverImg = albumImages.find((img) => img.imageUrl === coverUrl);
          if (coverImg) setCoverImageId(coverImg.id);
        }
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load album");
      } finally {
        setLoading(false);
      }
    }
    fetchAlbum();
  }, [id, isNew]);

  if (loading) {
    return (
      <div>
        <PageHeader title={isNew ? "Create Album" : "Edit Album"} description="Loading..." />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isNew && !album) {
    return (
      <div>
        <PageHeader title="Not Found" description="The requested album does not exist." />
        <Button variant="outline" onClick={() => router.push("/gallery")}>Back to Gallery</Button>
      </div>
    );
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || undefined,
      isPublished,
    };

    try {
      setSaving(true);
      if (isNew) {
        const res = await gallery.createAlbum(data);
        toast.success("Album created");
        router.push(`/gallery/${(res.data as Record<string, unknown>).id}`);
      } else {
        await gallery.updateAlbum(id, data);
        toast.success("Album updated");
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save album");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAlbum() {
    try {
      await gallery.deleteAlbum(id);
      toast.success("Album deleted");
      router.push("/gallery");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete album");
    }
  }

  /**
   * Uploads selected files in batches of BATCH_SIZE to respect the backend limit.
   * When more than BATCH_SIZE files are selected, they are chunked and uploaded sequentially.
   */
  async function handleUploadImages() {
    const files = uploadFilesRef.current;
    if (files.length === 0) {
      toast.error("Please select files first");
      return;
    }

    try {
      setUploading(true);
      const totalBatches = Math.ceil(files.length / BATCH_SIZE);

      for (let i = 0; i < totalBatches; i++) {
        const batch = files.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
        if (totalBatches > 1) {
          setUploadProgress(`Uploading batch ${i + 1} of ${totalBatches} (${batch.length} files)...`);
        }
        await gallery.addImages(id, batch);
      }

      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded`);
      // Refresh album data
      const res = await gallery.getAlbum(id);
      setImages((res.data.images as unknown as GalleryImage[]) ?? []);
      uploadFilesRef.current = [];
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to upload images");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      await gallery.deleteImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      if (coverImageId === imageId) setCoverImageId(null);
      toast.success("Image removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete image");
    }
  }

  /** Sets the given image as the album cover */
  async function handleSetCover(imageId: string) {
    try {
      setSettingCover(imageId);
      await gallery.setCover(id, imageId);
      setCoverImageId(imageId);
      toast.success("Cover image updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to set cover image");
    } finally {
      setSettingCover(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title={isNew ? "Create Album" : "Edit Album"} description={isNew ? "Create a new photo album" : `Managing: ${album?.title as string}`} />

      {/* Album Settings */}
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Album Title *</Label>
              <Input id="title" name="title" required defaultValue={(album?.title as string) ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={(album?.description as string) ?? ""} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} id="published" />
              <Label htmlFor="published" className="font-normal">Published</Label>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : isNew ? "Create Album" : "Save Changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/gallery")}>Back</Button>
              </div>
              {!isNew && (
                <ConfirmDialog title="Delete Album" description={`Delete "${album?.title as string}" and all its images?`} onConfirm={handleDeleteAlbum}>
                  <Button type="button" variant="destructive" size="sm">Delete Album</Button>
                </ConfirmDialog>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Image Upload - only show for existing albums */}
      {!isNew && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-1">Upload Images</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Up to 20 files per batch (images: 5MB, videos: 100MB). Selecting more than 20 files will auto-chunk them into sequential batches.
            </p>
            <FileUpload accept="image/*,video/mp4,video/webm,video/quicktime" multiple maxSize={100} onFilesSelected={(files) => { uploadFilesRef.current = files; }} />
            <div className="mt-3 flex items-center gap-3">
              <Button onClick={handleUploadImages} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Selected Images"}
              </Button>
              {uploadProgress && (
                <span className="text-xs text-muted-foreground">{uploadProgress}</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Grid - only show for existing albums */}
      {!isNew && (
        <div>
          <h3 className="font-semibold mb-3">Album Images ({images.length})</h3>
          {images.length === 0 ? (
            <Card className="py-12">
              <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-10 w-10" />
                <p className="text-sm">No images in this album yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted border">
                  {img.imageMimeType?.startsWith("video/") ? (
                    <video src={img.imageUrl} className="w-full h-full object-cover" muted />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.imageUrl} alt={img.caption ?? "Gallery image"} className="w-full h-full object-cover" />
                  )}
                  {/* Cover badge */}
                  {coverImageId === img.id && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                        <Star className="h-3 w-3 fill-white" /> Cover
                      </span>
                    </div>
                  )}
                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      disabled={settingCover === img.id || coverImageId === img.id}
                      onClick={(e) => { e.stopPropagation(); handleSetCover(img.id); }}
                      title="Set as cover"
                    >
                      {settingCover === img.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                    <ConfirmDialog title="Delete Image" description="Remove this image from the album?" onConfirm={() => handleDeleteImage(img.id)}>
                      <Button variant="destructive" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </ConfirmDialog>
                  </div>
                  {img.caption ? (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-1 text-xs truncate">
                      {img.caption}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
