/**
 * @file page.tsx
 * @description Gallery management — card grid of albums with image count, publish status, and date
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { gallery, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ImageIcon, Loader2 } from "lucide-react";
import type { GalleryAlbum } from "@/lib/types";
import { toast } from "sonner";

export default function GalleryPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        setLoading(true);
        const res = await gallery.listAlbums({ limit: 200 });
        setAlbums(res.data as unknown as GalleryAlbum[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load albums");
      } finally {
        setLoading(false);
      }
    }
    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Gallery" description="Manage photo albums and images" action={{ label: "Create Album", href: "/gallery/new" }} />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Gallery" description="Manage photo albums and images" action={{ label: "Create Album", href: "/gallery/new" }} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {albums.map((album) => (
          <Card
            key={album.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
            onClick={() => router.push(`/gallery/${album.id}`)}
          >
            <div className="relative aspect-video bg-muted flex items-center justify-center">
              {album.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={album.isPublished ? "default" : "secondary"}>
                  {album.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <CardContent className="px-4 pt-4 pb-2">
              <h3 className="font-semibold text-sm line-clamp-1">{album.title}</h3>
              {album.description ? (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">{album.description}</p>
              ) : null}
            </CardContent>
            <CardFooter className="px-4 pt-0 pb-4 text-xs text-muted-foreground justify-between">
              <span>{album._count?.images ?? 0} photos</span>
              <span>{formatDate(album.createdAt)}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
