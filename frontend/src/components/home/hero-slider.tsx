/**
 * @file hero-slider.tsx
 * @description Hero slider component — auto-advancing image carousel fetched from the backend API with campus badges and site tagline
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { heroSlides as heroSlidesApi } from "@/lib/api";

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

const defaultBadges = [
  `Estd. ${siteConfig.established}`,
  "AICTE Approved",
  "HSBTE Affiliated",
];

function parseSlides(payload: unknown): HeroSlide[] {
  if (!Array.isArray(payload)) return [];

  const parsed: HeroSlide[] = [];

  for (const item of payload) {
    if (typeof item !== "object" || item === null) continue;
    const slide = item as Record<string, unknown>;
    if (
      typeof slide.id !== "string" ||
      typeof slide.title !== "string" ||
      typeof slide.imageUrl !== "string"
    ) {
      continue;
    }

    parsed.push({
      id: slide.id,
      title: slide.title,
      subtitle: typeof slide.subtitle === "string" ? slide.subtitle : undefined,
      badge: typeof slide.badge === "string" ? slide.badge : undefined,
      imageUrl: slide.imageUrl,
      order: typeof slide.order === "number" ? slide.order : 0,
      isActive: slide.isActive !== false,
    });
  }

  return parsed;
}

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    heroSlidesApi
      .list()
      .then((res) => {
        if (cancelled) return;
        const active = parseSlides(res.data).filter((slide) => slide.isActive);
        setSlides(active);
      })
      .catch(() => {
        if (!cancelled) setSlides([]);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  // Loaded but no active slides — hide the section entirely
  if (ready && slides.length === 0) return null;

  const activeSlide = slides[current];

  return (
    <>
      {/* Keep loading feedback inside the hero so the rest of the page remains interactive on mobile. */}
      <section className="relative w-full h-96 md:h-120 lg:h-144 overflow-hidden">
        {!ready && (
          <div className="absolute inset-0 z-10 bg-emerald-950/95">
            <div className="absolute inset-0 bg-linear-to-b from-emerald-900/30 to-emerald-950" />
          </div>
        )}

        {activeSlide && (
          <div key={activeSlide.id} className="absolute inset-0 transition-opacity duration-500 opacity-100">
            <Image
              src={activeSlide.imageUrl}
              alt={activeSlide.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={60}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-end pb-12 md:pb-20 lg:pb-24">
              <div className="container mx-auto px-4">
                <div className="transition-all duration-500 translate-y-0 opacity-100">
                  <div className="mb-4">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full">
                      {activeSlide.badge || defaultBadges[current % defaultBadges.length]}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {activeSlide.title}
                  </h2>
                  {activeSlide.subtitle && (
                    <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-xl drop-shadow">
                      {activeSlide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
