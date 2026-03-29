/**
 * @file image-grid.tsx
 * @description Gallery image grid — masonry layout with click-to-open lightbox modal
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/lightbox";
import { Play } from "lucide-react";

interface GalleryItem {
  id: string;
  imageUrl: string;
  imageMimeType?: string;
  caption?: string;
}

interface ImageGridProps {
  images: GalleryItem[];
  albumTitle: string;
}

export function ImageGrid({ images, albumTitle }: ImageGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxImages = images.map((img) => ({
    url: img.imageUrl,
    alt: img.caption ?? albumTitle,
    mime: img.imageMimeType,
    caption: img.caption,
  }));

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
        {images.map((img, index) => {
          const isVideo = img.imageMimeType?.startsWith("video/");
          return (
            <div
              key={img.id}
              className="break-inside-avoid mb-3 sm:mb-4 rounded-xl overflow-hidden bg-gray-100 cursor-pointer group relative"
              onClick={() => setLightboxIndex(index)}
            >
              {isVideo ? (
                <div className="relative">
                  <video
                    src={img.imageUrl}
                    className="w-full h-auto"
                    preload="metadata"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={img.imageUrl}
                  alt={img.caption ?? albumTitle}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none rounded-xl" />

              {img.caption && (
                <p className="px-3 py-2 text-xs text-gray-600 bg-white">{img.caption}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
