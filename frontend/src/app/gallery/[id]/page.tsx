/**
 * @file page.tsx
 * @description Gallery album detail page — image/video grid with lightbox modal, centered description, and photo count
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { ImageGrid } from "@/components/gallery/image-grid";
import { gallery } from "@/lib/api";
import { Images, Camera } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await gallery.getAlbum(id);
    const album = res.data;
    return {
      title: String(album.title ?? "Gallery Album"),
      description: String(album.description ?? "Photo album from GBN Govt. Polytechnic Nilokheri."),
    };
  } catch {
    return { title: "Gallery Album" };
  }
}

export default async function GalleryAlbumPage({ params }: Props) {
  const { id } = await params;
  let album: Record<string, unknown> | null = null;

  try {
    const res = await gallery.getAlbum(id);
    album = res.data;
  } catch {
    // API unavailable
  }

  if (!album) {
    return (
      <>
        <PageHeader
          title="Album Not Found"
          breadcrumbs={[
            { label: "Gallery", href: "/gallery" },
            { label: "Not Found" },
          ]}
        />
        <div className="text-center py-20">
          <Images className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">This album could not be found.</p>
        </div>
      </>
    );
  }

  const rawImages = (album.images as Record<string, unknown>[]) ?? [];
  const images = rawImages.map((img) => ({
    id: String(img.id),
    imageUrl: String(img.imageUrl),
    imageMimeType: img.imageMimeType ? String(img.imageMimeType) : undefined,
    caption: typeof img.caption === "string" ? img.caption : undefined,
  }));

  return (
    <>
      <PageHeader
        title={String(album.title)}
        breadcrumbs={[
          { label: "Gallery", href: "/gallery" },
          { label: String(album.title) },
        ]}
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Album info — centered */}
          <div className="text-center mb-10">
            {typeof album.description === "string" && album.description && (
              <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                {album.description}
              </p>
            )}
            <Badge variant="secondary" className="text-sm gap-1.5 px-3 py-1">
              <Camera className="w-3.5 h-3.5" />
              {images.length} {images.length === 1 ? "photo" : "photos"}
            </Badge>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-12">
              <Images className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No photos in this album yet.</p>
            </div>
          ) : (
            <ImageGrid images={images} albumTitle={String(album.title)} />
          )}
        </div>
      </section>
    </>
  );
}
