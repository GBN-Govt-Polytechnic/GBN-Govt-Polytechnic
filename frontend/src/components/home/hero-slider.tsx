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

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 6000);
    heroSlidesApi.list().then((res) => {
      const active = (res.data as unknown as HeroSlide[]).filter((s) => s.isActive);
      if (active.length > 0) setSlides(active);
      setReady(true);
    }).catch(() => { setReady(true); }).finally(() => clearTimeout(timeout));
  }, []);

  const markLoaded = useCallback((id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
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

  // Full-page loading overlay — identical to loading.tsx so it feels seamless.
  // Covers the ENTIRE page (not just the slider section) until the first image is ready.
  const firstImageReady = slides.length > 0 && loadedImages.has(slides[0].id);
  const showOverlay = !ready || (slides.length > 0 && !firstImageReady);

  // Loaded but no active slides — hide the section entirely
  if (ready && slides.length === 0) return null;

  return (
    <>
      {/* Full-page loading overlay — ONE loader for the entire homepage */}
      {showOverlay && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full bg-emerald-100 blur-xl opacity-60 scale-110" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Logo.jpeg"
              alt="GBN Govt. Polytechnic"
              width={80}
              height={80}
              className="relative rounded-full shadow-lg"
            />
          </div>
          <p className="text-lg font-bold text-gray-900 mb-0.5 text-center px-6">GBN Govt. Polytechnic</p>
          <p className="text-sm text-gray-500 mb-8 text-center">Nilokheri, Karnal (Haryana)</p>
          <div className="w-40 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-[loading_1.4s_ease-in-out_infinite]" />
          </div>
          <style>{`@keyframes loading{0%{width:0%;margin-left:0%}50%{width:60%;margin-left:20%}100%{width:0%;margin-left:100%}}`}</style>
          {/* Pre-load first image in background */}
          {ready && slides.length > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slides[0].imageUrl}
              alt=""
              className="absolute opacity-0 pointer-events-none"
              onLoad={() => markLoaded(slides[0].id)}
              onError={() => markLoaded(slides[0].id)}
            />
          )}
        </div>
      )}

      {/* The actual slider — renders behind the overlay, visible once overlay disappears */}
      <section className="relative w-full h-96 md:h-[30rem] lg:h-[36rem] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              i === current ? "opacity-100" : "opacity-0"
            )}
          >
            {!loadedImages.has(slide.id) && (
              <div className="absolute inset-0 bg-emerald-950" />
            )}
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
              onLoad={() => markLoaded(slide.id)}
              onError={() => markLoaded(slide.id)}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-end pb-12 md:pb-20 lg:pb-24">
              <div className="container mx-auto px-4">
                <div
                  className={cn(
                    "transition-all duration-700 delay-300",
                    i === current
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  )}
                >
                  <div className="mb-4">
                    <span
                      className={cn(
                        "inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all duration-700",
                        i === current
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                      )}
                    >
                      {slide.badge || defaultBadges[i % defaultBadges.length]}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-xl drop-shadow">
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

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
