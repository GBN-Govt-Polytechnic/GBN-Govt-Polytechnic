/**
 * @file topbar.tsx
 * @description Top navigation bar — clean breadcrumb trail, search hint, mobile menu toggle, user avatar dropdown
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const breadcrumbs = () => {
    if (pathname === "/") return [{ label: "Dashboard", href: "/" }];
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((s, i) => ({
      label: s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      href: "/" + segments.slice(0, i + 1).join("/"),
    }));
  };

  const crumbs = breadcrumbs();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/60 bg-white/80 backdrop-blur-sm px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5" />
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              {i === crumbs.length - 1 ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 gap-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5">
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
