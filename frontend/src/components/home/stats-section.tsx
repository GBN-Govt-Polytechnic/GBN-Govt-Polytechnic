/**
 * @file stats-section.tsx
 * @description Stats section — animated counter cards showing key institute numbers (students, placements, departments, years) with intersection observer
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/config";
import { cn } from "@/lib/utils";

export function StatsSection() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "bg-white border border-gray-100 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-700",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
        <stat.icon className="h-5 w-5 text-emerald-600" />
      </div>
      <p className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
      <p className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</p>
    </div>
  );
}
