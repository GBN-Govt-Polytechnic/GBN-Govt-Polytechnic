/**
 * @file news-notices.tsx
 * @description News & notices ticker — floating dock with seamless infinite scrolling, category-colored dots, pause-on-hover with tooltip
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Notice {
  title: string;
  slug: string;
}


export function NewsNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [singleWidth, setSingleWidth] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Fetch via the Next.js proxy route so clients on the LAN don't need direct backend access
    fetch("/api/news?limit=6&status=PUBLISHED")
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          setNotices(
            json.data.map((n: Record<string, unknown>) => ({
              title: String(n.title ?? ""),
              slug: String(n.slug ?? n.id ?? ""),
            }))
          );
        }
      })
      .catch(() => {
        // Fallback only if the proxy is also unreachable
        setNotices([]);
      });
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setSingleWidth(track.scrollWidth / 4);
  }, []);

  useEffect(() => {
    if (notices.length === 0) return;
    requestAnimationFrame(() => requestAnimationFrame(measure));
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [notices, measure]);

  if (notices.length === 0) return null;

  const duration = Math.max(notices.length * 6, 20);

  const renderSet = (prefix: string) =>
    notices.map((n, i) => (
      <Link
        key={`${prefix}-${i}`}
        href={`/news/${n.slug}`}
        className="inline-flex items-center text-[11px] text-gray-700 mr-8 hover:text-emerald-600 transition-colors whitespace-nowrap relative"
        onMouseEnter={() => { setHovered(`${prefix}-${i}`); setPaused(true); }}
        onMouseLeave={() => { setHovered(null); setPaused(false); }}
      >
        <span className="text-gray-300 mr-2">|</span>
        {n.title}
        {hovered === `${prefix}-${i}` && (
          <span className="absolute left-0 top-full mt-1.5 z-50 bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none">
            {n.title}
          </span>
        )}
      </Link>
    ));

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm px-4 h-8 overflow-hidden">
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-white bg-emerald-600 px-1.5 py-0.5 rounded leading-tight">
          Updates
        </span>

        <div className="overflow-hidden flex-1 flex items-center">
          <div
            ref={trackRef}
            className="inline-flex items-center will-change-transform"
            style={
              singleWidth > 0
                ? {
                    animation: `news-scroll ${duration}s linear infinite`,
                    animationPlayState: paused ? "paused" : "running",
                  }
                : undefined
            }
          >
            {renderSet("a")}
            {renderSet("b")}
            {renderSet("c")}
            {renderSet("d")}
          </div>
        </div>

        <Link
          href="/news"
          className="shrink-0 text-[10px] text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-0.5"
        >
          All <ArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>

      {singleWidth > 0 && (
        <style>{`
          @keyframes news-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${singleWidth}px); }
          }
        `}</style>
      )}
    </div>
  );
}
