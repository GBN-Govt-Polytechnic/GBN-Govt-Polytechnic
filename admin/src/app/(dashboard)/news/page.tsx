/**
 * @file page.tsx
 * @description News management — card-style list with category color coding, delete actions, and status indicators
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { news, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { NewsNotice } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2, Trash2, Pencil, Megaphone, Bell, BookOpen, Briefcase,
  CalendarDays, Search, FileText,
} from "lucide-react";

const CATEGORY_CONFIG: Record<string, { bg: string; text: string; border: string; accent: string; icon: typeof Bell; label: string }> = {
  NEWS: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", accent: "bg-emerald-500", icon: Megaphone, label: "News" },
  NOTICE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", accent: "bg-amber-500", icon: Bell, label: "Notice" },
  CIRCULAR: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", accent: "bg-blue-500", icon: BookOpen, label: "Circular" },
  TENDER: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", accent: "bg-purple-500", icon: Briefcase, label: "Tender" },
  EVENT: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", accent: "bg-rose-500", icon: CalendarDays, label: "Event" },
};

export default function NewsPage() {
  const router = useRouter();
  const [data, setData] = useState<NewsNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const res = await news.list({ limit: 200 });
        setData(res.data as unknown as NewsNotice[]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load news");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  async function handleDelete(id: string) {
    try {
      await news.delete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Post deleted");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete post");
    }
  }

  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <PageHeader title="News & Notices" description="Manage news, notices, circulars, tenders, and events" action={{ label: "Create Post", href: "/news/new" }} />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="News & Notices" description="Manage news, notices, circulars, tenders, and events" action={{ label: "Create Post", href: "/news/new" }} />

      <div className="mb-5 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No posts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const cat = CATEGORY_CONFIG[item.category?.toUpperCase()] || CATEGORY_CONFIG.NEWS;
            const Icon = cat.icon;

            return (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden"
                onClick={() => router.push(`/news/${item.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Color accent bar */}
                    <div className={`w-1.5 shrink-0 ${cat.accent}`} />

                    <div className="flex-1 flex items-center gap-4 px-4 py-3">
                      {/* Category icon */}
                      <div className={`shrink-0 w-9 h-9 rounded-lg ${cat.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${cat.text}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${cat.bg} ${cat.text} ${cat.border}`}>
                            {cat.label}
                          </Badge>
                          <StatusBadge status={item.status} />
                          {item.publishDate && (
                            <span className="text-[11px] text-muted-foreground">{formatDate(item.publishDate)}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); router.push(`/news/${item.id}`); }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <ConfirmDialog
                          title="Delete Post"
                          description={`Permanently delete "${item.title}"?`}
                          onConfirm={() => handleDelete(item.id)}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
