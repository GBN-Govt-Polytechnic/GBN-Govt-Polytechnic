/**
 * @file top-loading-bar.tsx
 * @description Green NProgress-style top loading bar — animates on every route change
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";

function TopLoadingBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    // Clear any running animation
    if (timerRef.current) clearTimeout(timerRef.current);

    const t0 = setTimeout(() => {
      setVisible(true);
      setWidth(0);
    }, 0);

    // Animate to 80% quickly, then finish to 100%
    const t1 = setTimeout(() => setWidth(75), 50);
    const t2 = setTimeout(() => setWidth(95), 400);
    const t3 = setTimeout(() => {
      setWidth(100);
      timerRef.current = setTimeout(() => setVisible(false), 300);
    }, 700);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981] transition-[width] ease-out"
        style={{
          width: `${width}%`,
          transitionDuration: width === 0 ? "0ms" : width === 100 ? "200ms" : "600ms",
        }}
      />
    </div>
  );
}

export function TopLoadingBar() {
  return (
    <Suspense>
      <TopLoadingBarInner />
    </Suspense>
  );
}
