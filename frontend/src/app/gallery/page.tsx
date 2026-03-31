/**
 * @file page.tsx
 * @description Gallery page — photo albums of campus, events, and activities fetched from the backend API
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { gallery } from "@/lib/api";
import { Camera, Images } from "lucide-react";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo gallery of GBN Govt. Polytechnic Nilokheri — campus, events, and activities.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  let albums: Record<string, unknown>[] = [];

  try {
    const res = await gallery.listAlbums({ isPublished: true });
    albums = res.data;
  } catch {
    // API unavailable
  }

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Capturing Moments of Excellence & Campus Life"
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {albums.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Gallery Coming Soon</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                We&apos;re curating the best moments from our campus. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => {
                const coverUrl = (album.coverUrl ?? album.coverImageUrl) as string | undefined;
                const images = album.images as Record<string, unknown>[] | undefined;
                const firstImage = images?.[0]?.imageUrl as string | undefined;
                const imgSrc = coverUrl || firstImage;

                return (
                  <Link key={String(album.id)} href={`/gallery/${album.id}`}>
                    <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      <div className="relative h-48 bg-gray-100">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={String(album.title)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Images className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                          {String(album.title)}
                        </h3>
                        {album.description ? (
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                            {String(album.description)}
                          </p>
                        ) : null}
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            <Images className="w-3 h-3 mr-1" />
                            {album._count && typeof album._count === "object"
                              ? String((album._count as Record<string, unknown>).images ?? 0)
                              : "0"} photos
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(String(album.createdAt)).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
