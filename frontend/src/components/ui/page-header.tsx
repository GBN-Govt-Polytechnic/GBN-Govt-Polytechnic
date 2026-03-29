/**
 * @file page-header.tsx
 * @description Page header component — gradient banner with title, subtitle, and breadcrumb navigation used across all inner pages
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: { label: string; href?: string }[];
  gradient?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, gradient }: PageHeaderProps) {
  const gradientClass = gradient
    ? `bg-gradient-to-br ${gradient}`
    : "bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800";

  return (
    <section className={`${gradientClass} text-white`} style={{ backgroundColor: "#059669" }}>
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-emerald-100 text-sm md:text-base mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              <Home className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-emerald-100 text-base md:text-lg max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {/* Wave */}
      <div className="h-8 bg-white rounded-t-[2rem]" />
    </section>
  );
}
