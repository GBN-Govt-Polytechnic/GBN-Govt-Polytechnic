/**
 * @file page.tsx
 * @description Hero slides management — sortable list with reorder controls, active toggle, and delete actions
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { heroSlides, ApiError } from "@/lib/api";
import { ArrowUp, ArrowDown, Pencil, Trash2, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { HeroSlide } from "@/lib/types";

export default function HeroSlidesPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        setLoading(true);
        const res = await heroSlides.list();
        setSlides(res.data as unknown as HeroSlide[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load slides");
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  function moveSlide(index: number, direction: "up" | "down") {
    const newSlides = [...slides];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSlides.length) return;
    [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];
    setSlides(newSlides);
    toast.success("Slide order updated");
  }

  async function toggleActive(id: string) {
    const slide = slides.find((s) => s.id === id);
    if (!slide) return;
    try {
      await heroSlides.update(id, { isActive: !slide.isActive });
      setSlides((prev) => prev.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s));
      toast.success("Slide visibility updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update slide");
    }
  }

  async function deleteSlide(id: string) {
    try {
      await heroSlides.delete(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
      toast.success("Slide deleted");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete slide");
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Hero Slides" description="Manage homepage hero carousel slides" action={{ label: "Add Slide", href: "/hero-slides/new" }} />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Hero Slides" description="Manage homepage hero carousel slides" action={{ label: "Add Slide", href: "/hero-slides/new" }} />
      <div className="space-y-3 max-w-3xl">
        {slides.length === 0 && (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-10 w-10" />
              <p className="text-sm">No hero slides configured</p>
              <Button size="sm" onClick={() => router.push("/hero-slides/new")}>Add First Slide</Button>
            </CardContent>
          </Card>
        )}
        {slides.map((slide, index) => (
          <Card key={slide.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-40 h-24 bg-muted shrink-0">
                  {slide.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{slide.title}</h3>
                    <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                  </div>
                  {slide.subtitle ? (
                    <p className="text-xs text-muted-foreground truncate">{slide.subtitle}</p>
                  ) : null}
                  {slide.linkUrl ? (
                    <p className="text-xs text-blue-600 truncate mt-0.5">{slide.linkUrl}</p>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pr-4 shrink-0">
                  <Switch checked={slide.isActive} onCheckedChange={() => toggleActive(slide.id)} />
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSlide(index, "up")} disabled={index === 0}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSlide(index, "down")} disabled={index === slides.length - 1}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/hero-slides/${slide.id}`)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <ConfirmDialog title="Delete Slide" description={`Delete "${slide.title}"?`} onConfirm={() => deleteSlide(slide.id)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </ConfirmDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
