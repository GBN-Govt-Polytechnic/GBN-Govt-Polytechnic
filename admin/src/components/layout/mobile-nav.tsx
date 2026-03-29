/**
 * @file mobile-nav.tsx
 * @description Mobile navigation drawer — modern slide-out sheet with role-filtered nav items and department sub-links
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";
import { hasAccess } from "@/config/roles";
import { NAV_ITEMS } from "@/config/navigation";
import { useAuth } from "@/hooks/use-auth";
import { departments as departmentsApi } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  LogOut, ChevronRight,
  Building2, Users, FlaskConical, BookOpen, FileText,
  GraduationCap, Calendar, LayoutDashboard,
  Loader2,
} from "lucide-react";

const DEPT_SUB_ITEMS = [
  { label: "Overview", href: (slug: string) => `/departments/${slug}`, icon: Building2 },
  { label: "Faculty", href: (slug: string) => `/faculty?dept=${slug}`, icon: Users },
  { label: "Labs", href: (slug: string) => `/labs?dept=${slug}`, icon: FlaskConical },
  { label: "Materials", href: (slug: string) => `/study-materials?dept=${slug}`, icon: BookOpen },
  { label: "Lesson Plans", href: (slug: string) => `/lesson-plans?dept=${slug}`, icon: FileText },
  { label: "Subjects", href: (slug: string) => `/courses?dept=${slug}`, icon: GraduationCap },
  { label: "Syllabus", href: (slug: string) => `/syllabus?dept=${slug}`, icon: Calendar },
];

const GROUP_LABELS: Record<string, string> = {
  content: "Content",
  data: "Data",
  system: "System",
};

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

function MobileNavInner({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { role } = useRole();
  const { user, logout } = useAuth();

  const getInitialDept = () => {
    if (pathname.startsWith("/departments/")) return pathname.split("/")[2] || null;
    return searchParams.get("dept");
  };

  const [expandedDept, setExpandedDept] = useState<string | null>(getInitialDept);
  const [allDepartments, setAllDepartments] = useState<Record<string, unknown>[]>([]);
  const [deptsLoading, setDeptsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    departmentsApi.list({ limit: 100 }).then((res) => {
      if (!cancelled && res.data) setAllDepartments(res.data);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setDeptsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filteredNav = NAV_ITEMS.filter(
    (item) => role && hasAccess(role, item.section) && item.group !== "academic"
  );

  const groups = ["content", "data", "system"] as const;

  const departments =
    user?.role === "hod"
      ? allDepartments.filter((d) => d.slug === user.departmentSlug)
      : allDepartments;

  const deptParam = searchParams.get("dept");
  const isOnDeptPage = pathname.startsWith("/departments/");
  const isOnDeptList = pathname === "/departments";
  const currentDeptSlug = isOnDeptPage && !isOnDeptList ? pathname.split("/")[2] : null;
  const canSeeDepts = role && hasAccess(role, "departments");

  const isSubActive = (href: string) => {
    const [hrefPath, hrefSearch] = href.split("?");
    if (hrefPath !== pathname) return false;
    if (!hrefSearch) return !deptParam;
    return hrefSearch === `dept=${deptParam}`;
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border/60 px-4 py-4">
          <SheetTitle className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.jpeg" alt="GBN Logo" className="h-9 w-9 rounded-lg object-cover shadow-sm" />
            <div>
              <p className="text-sm font-semibold text-foreground text-left">GBN Polytechnic</p>
              <p className="text-[10px] text-muted-foreground text-left">Admin Panel</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-73px)]">
          <div className="flex-1 overflow-y-auto py-3">
            <nav className="px-3 space-y-1">
              {/* Dashboard */}
              <Link
                href="/"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  pathname === "/"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <LayoutDashboard className="h-[18px] w-[18px]" />
                <span>Dashboard</span>
              </Link>

              {/* Departments */}
              {canSeeDepts && (
                <div className="pt-4">
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Departments
                  </p>

                  {deptsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {departments.map((dept) => {
                        const slug = dept.slug as string;
                        const isDeptActive = currentDeptSlug === slug || deptParam === slug;
                        const isDeptExpanded = expandedDept === slug;

                        return (
                          <div key={dept.id as string}>
                            <button
                              onClick={() => setExpandedDept(isDeptExpanded ? null : slug)}
                              className={cn(
                                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 group",
                                isDeptActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold shrink-0",
                                  isDeptActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                )}
                              >
                                {dept.code as string}
                              </span>
                              <span className="flex-1 text-left truncate text-[13px]">
                                {dept.name as string}
                              </span>
                              <ChevronRight
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                                  isDeptExpanded && "rotate-90"
                                )}
                              />
                            </button>

                            {isDeptExpanded && (
                              <div className="mt-0.5 ml-5 space-y-0.5 border-l border-border/60 pl-3">
                                {DEPT_SUB_ITEMS.map((sub) => {
                                  const href = sub.href(slug);
                                  const active = isSubActive(href);
                                  const SubIcon = sub.icon;

                                  return (
                                    <Link
                                      key={sub.label}
                                      href={href}
                                      onClick={onClose}
                                      className={cn(
                                        "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-all duration-150",
                                        active
                                          ? "bg-primary/10 text-primary font-medium"
                                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                      )}
                                    >
                                      <SubIcon className="h-3.5 w-3.5 shrink-0" />
                                      <span>{sub.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Nav groups */}
              {groups.map((group) => {
                const items = filteredNav.filter((i) => i.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group} className="pt-4">
                    <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      {GROUP_LABELS[group]}
                    </p>
                    <div className="space-y-0.5">
                      {items.map((item) => {
                        const isActive =
                          pathname === item.href ||
                          (item.href !== "/" && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <Icon className="h-[18px] w-[18px]" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-border/60 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { logout(); onClose(); }}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function MobileNav(props: MobileNavProps) {
  return (
    <Suspense>
      <MobileNavInner {...props} />
    </Suspense>
  );
}
