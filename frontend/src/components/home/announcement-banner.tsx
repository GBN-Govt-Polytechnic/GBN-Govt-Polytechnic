/**
 * @file announcement-banner.tsx
 * @description Announcement banner box — positioned bottom-right of hero slider on desktop,
 *              bottom strip on mobile. Auto-cycles every 5s with crossfade.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerItem {
  id: string;
  title: string;
  message: string;
  variant: string;
  linkUrl?: string;
  linkText?: string;
}

const ACCENT: Record<string, string> = {
  INFO: "border-blue-500",
  WARNING: "border-amber-400",
  URGENT: "border-red-500",
  SUCCESS: "border-emerald-500",
};

const ICON_BG: Record<string, string> = {
  INFO: "bg-blue-500",
  WARNING: "bg-amber-500",
  URGENT: "bg-red-500",
  SUCCESS: "bg-emerald-500",
};

export function AnnouncementBannerClient({ items }: { items: BannerItem[] }) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const advance = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % items.length);
      setFade(true);
    }, 150);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [items.length, advance]);

  if (items.length === 0) return null;

  const item = items[current];
  const accent = ACCENT[item.variant] ?? ACCENT.INFO;
  const iconBg = ICON_BG[item.variant] ?? ICON_BG.INFO;

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block absolute bottom-10 right-6 lg:right-10 z-10 w-72 lg:w-80">
        <div className={cn("bg-white rounded-lg shadow-xl border-l-[3px] overflow-hidden", accent)}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <div className="flex items-center gap-2">
              <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", iconBg)}>
                <Megaphone className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Announcement
              </span>
            </div>
            {items.length > 1 && (
              <span className="text-[10px] text-gray-300 font-medium tabular-nums">
                {current + 1}/{items.length}
              </span>
            )}
          </div>

          {/* Body */}
          <div className={cn("px-4 pb-3 pt-1 transition-opacity duration-150", fade ? "opacity-100" : "opacity-0")}>
            <h3 className="text-gray-900 text-[13px] font-bold leading-tight">
              {item.title}
            </h3>
            <p className="text-gray-500 text-[11px] leading-relaxed mt-1 line-clamp-2">
              {item.message}
            </p>
            {item.linkUrl && (
              <Link
                href={item.linkUrl}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 mt-2 transition-colors"
              >
                {item.linkText || "Learn More"}
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Progress dots */}
          {items.length > 1 && (
            <div className="px-4 pb-3 flex gap-1">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true); }, 150); }}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    i === current
                      ? cn("flex-1", iconBg)
                      : "flex-1 bg-gray-100 hover:bg-gray-200"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-10">
        <div className={cn("bg-white/95 backdrop-blur-sm border-t-2", accent)}>
          <div className={cn("px-4 py-2.5 flex items-center gap-3 transition-opacity duration-150", fade ? "opacity-100" : "opacity-0")}>
            <div className={cn("w-7 h-7 rounded-md flex items-center justify-center shrink-0", iconBg)}>
              <Megaphone className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-900 text-[12px] font-bold truncate">{item.title}</p>
              <p className="text-gray-500 text-[10px] truncate">{item.message}</p>
            </div>
            {item.linkUrl ? (
              <Link
                href={item.linkUrl}
                className="shrink-0 text-[10px] font-bold text-emerald-600"
              >
                {item.linkText || "View"} →
              </Link>
            ) : items.length > 1 ? (
              <button onClick={advance} className="shrink-0 text-gray-400">
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
          {items.length > 1 && (
            <div className="flex gap-0.5 px-4 pb-1.5">
              {items.map((_, i) => (
                <span key={i} className={cn("h-0.5 rounded-full flex-1 transition-all", i === current ? iconBg : "bg-gray-200")} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
