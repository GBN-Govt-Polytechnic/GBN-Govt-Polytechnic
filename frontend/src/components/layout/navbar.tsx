/**
 * @file navbar.tsx
 * @description Responsive navigation bar — sticky header with desktop mega-menu dropdowns, mobile sheet drawer, and scroll shadow
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { navLinks, type NavLink } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b"
            : "bg-white shadow-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 xl:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image
                src="/college-logo.svg"
                alt="GPN Logo"
                width={52}
                height={52}
                className="w-12 h-12 xl:w-14 xl:h-14 object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.16)]"
              />
              <div className="hidden sm:block">
                <h1 className="text-xs xl:text-sm font-bold text-gray-900 leading-tight">
                  GBN Govt. Polytechnic
                </h1>
                <p className="text-[11px] text-gray-500">Nilokheri, Karnal (Haryana)</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const hasDropdown = link.children || link.groups;
                return (
                  <div
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-0.5 px-2 py-1.5 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap",
                        "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                      )}
                    >
                      {link.label}
                      {hasDropdown && (
                        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                      )}
                    </Link>

                    {/* Grouped mega-dropdown */}
                    {link.groups && openDropdown === link.label && (
                      <div className="absolute top-full left-0 pt-1 z-50">
                        <div className="bg-white rounded-lg shadow-xl border p-4 flex gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                          {link.groups.map((group) => (
                            <div key={group.heading} className="min-w-36">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 px-2">
                                {group.heading}
                              </p>
                              {group.items.map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Flat dropdown */}
                    {link.children && !link.groups && openDropdown === link.label && (
                      <div className="absolute top-full left-0 pt-1 z-50">
                        <div className="bg-white rounded-lg shadow-xl border py-2 min-w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-2 xl:gap-3">
              {/* Contact — desktop only */}
              <a
                href="tel:+911745246002"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <Phone className="h-3 w-3" />
                01745-246002
              </a>

              {/* Mobile Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="xl:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto p-0 flex flex-col">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                  {/* Header */}
                  <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b shrink-0">
                    <Image
                      src="/college-logo.svg"
                      alt="GPN Logo"
                      width={44}
                      height={44}
                      className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.14)]"
                    />
                    <div>
                      <p className="font-bold text-sm">GBN Govt. Polytechnic</p>
                      <p className="text-xs text-muted-foreground">Nilokheri</p>
                    </div>
                  </div>

                  {/* Nav Links */}
                  <nav className="flex flex-col py-2 px-2 flex-1">
                    {navLinks.map((link) => (
                      <MobileNavItem
                        key={link.label}
                        link={link}
                        onNavigate={() => setMobileOpen(false)}
                        expandedItem={mobileExpandedItem}
                        onToggle={(label) => setMobileExpandedItem(prev => prev === label ? null : label)}
                      />
                    ))}
                  </nav>

                  {/* Bottom section */}
                  <div className="shrink-0 border-t bg-gray-50 px-4 py-3">
                    <a
                      href="tel:+911745246002"
                      className="flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg py-2.5 w-full transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      Contact: 01745-246002
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function MobileNavItem({
  link,
  onNavigate,
  expandedItem,
  onToggle,
}: {
  link: NavLink;
  onNavigate: () => void;
  expandedItem: string | null;
  onToggle: (label: string) => void;
}) {
  const hasDropdown = link.children || link.groups;
  const open = expandedItem === link.label;

  if (!hasDropdown) {
    return (
      <Link
        href={link.href}
        onClick={onNavigate}
        className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => onToggle(link.label)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
      >
        {link.label}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-emerald-100 pl-3">
          {/* Grouped items */}
          {link.groups?.map((group) => (
            <div key={group.heading}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 pt-2 pb-1">
                {group.heading}
              </p>
              {group.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onNavigate}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors block"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          {/* Flat items */}
          {link.children && !link.groups && link.children.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              onClick={onNavigate}
              className="px-3 py-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
