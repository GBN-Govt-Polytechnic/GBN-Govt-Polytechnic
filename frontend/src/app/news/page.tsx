/**
 * @file page.tsx
 * @description News & Notices — featured latest article + category-separated sections (News, Notices, Circulars, etc.)
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import {
  Bell,
  Megaphone,
  Briefcase,
  BookOpen,
  CalendarDays,
  Download,
  Paperclip,
} from "lucide-react";
import { news } from "@/lib/api";

export const metadata: Metadata = {
  title: "News & Notices",
  description:
    "Stay updated with latest announcements, events, circulars, and tenders from GBN Govt. Polytechnic Nilokheri.",
};

export const dynamic = "force-dynamic";

const CAT_CONFIG: Record<string, { bg: string; icon: typeof Bell; label: string; heading: string }> = {
  NEWS:     { bg: "bg-emerald-600", icon: Megaphone,    label: "News",     heading: "News" },
  NOTICE:   { bg: "bg-amber-500",   icon: Bell,         label: "Notice",   heading: "Notices" },
  CIRCULAR: { bg: "bg-blue-600",    icon: BookOpen,     label: "Circular", heading: "Circulars" },
  TENDER:   { bg: "bg-purple-600",  icon: Briefcase,    label: "Tender",   heading: "Tenders" },
  EVENT:    { bg: "bg-rose-600",    icon: CalendarDays, label: "Event",    heading: "Events" },
};

/** Order in which category sections appear */
const CAT_ORDER = ["NEWS", "NOTICE", "CIRCULAR", "TENDER", "EVENT"];

function isImageMime(m: string | undefined) { return !!m && m.startsWith("image/"); }

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Strip markdown syntax for plain-text previews */
function stripMd(text: string): string {
  const safe = text.length > 2000 ? text.slice(0, 2000) : text;
  return safe
    .replace(/^#{1,6}\s+/gm, "")   // headings
    .replace(/[*_~`]+/g, "")        // bold, italic, strikethrough, code
    .replace(/!?\[([^\]]{0,500})\]\([^)]{0,2000}\)/g, "$1") // links & images
    .replace(/^[-*+]\s+/gm, "")    // list markers
    .replace(/^>\s+/gm, "")        // blockquotes
    .replace(/---+/g, "")          // horizontal rules
    .replace(/\n{2,}/g, " ")       // collapse newlines
    .trim();
}

interface Article {
  id: string; slug: string; title: string; content: string;
  publishDate?: string; category: string;
  cat: typeof CAT_CONFIG.NEWS;
  thumb?: string; hasDoc: boolean;
  attachmentUrl?: string; attachmentName?: string;
}

function extract(n: Record<string, unknown>): Article {
  const category = String(n.category ?? "NEWS");
  const cat = CAT_CONFIG[category] || CAT_CONFIG.NEWS;
  const imageUrl = n.imageUrl as string | undefined;
  const attachmentUrl = n.attachmentUrl as string | undefined;
  const attachmentMime = n.attachmentMimeType as string | undefined;
  const attachmentName = n.attachmentFileName as string | undefined;
  const hasDoc = !!attachmentUrl && !isImageMime(attachmentMime);
  const thumb = imageUrl || (isImageMime(attachmentMime) ? attachmentUrl : undefined);
  return {
    id: String(n.id), slug: String(n.slug ?? n.id), title: String(n.title),
    content: String(n.content ?? ""), publishDate: n.publishDate as string | undefined,
    category, cat, thumb, hasDoc, attachmentUrl, attachmentName,
  };
}

export default async function NewsPage() {
  let raw: Record<string, unknown>[] = [];
  try {
    const res = await news.list({ limit: 50, status: "PUBLISHED" });
    raw = res.data;
  } catch { /* API unavailable */ }

  if (raw.length === 0) {
    return (
      <>
        <PageHeader title="News & Notices" subtitle="Latest announcements, circulars, and tenders" breadcrumbs={[{ label: "News & Notices" }]} />
        <section className="py-20 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No news or notices published yet.</p>
          <p className="text-gray-400 text-sm mt-1">Check back soon for updates.</p>
        </section>
      </>
    );
  }

  const all = raw.map(extract);
  const featured = all[0];
  const rest = all.slice(1);

  /** Group remaining articles by category */
  const grouped: Record<string, Article[]> = {};
  for (const item of rest) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  /** Only categories that have items, in defined order */
  const sections = CAT_ORDER.filter((cat) => grouped[cat] && grouped[cat].length > 0);

  return (
    <>
      <PageHeader title="News & Notices" subtitle="Latest announcements, circulars, and tenders" breadcrumbs={[{ label: "News & Notices" }]} />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* ═══ Latest Article ═══ */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900">Latest</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <Link href={`/news/${featured.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 md:h-80 bg-gray-100">
                  {featured.thumb ? (
                    <Image
                      src={featured.thumb}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
                      <featured.cat.icon className="w-16 h-16 text-emerald-200" />
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-full ${featured.cat.bg}`}>
                      {featured.cat.label}
                    </span>
                    {featured.publishDate && (
                      <span className="text-xs text-gray-400">{fmtDate(featured.publishDate)}</span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-3 line-clamp-3">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                    {stripMd(featured.content).slice(0, 280)}
                  </p>
                  {featured.hasDoc && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Paperclip className="w-3 h-3" /> Attachment included
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* ═══ Category Sections ═══ */}
          {sections.map((catKey) => {
            const items = grouped[catKey];
            const cfg = CAT_CONFIG[catKey];
            const SectionIcon = cfg.icon;

            return (
              <div key={catKey} className="mt-12">
                {/* Section heading */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                      <SectionIcon className="w-3.5 h-3.5 text-white" />
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{cfg.heading}</h3>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Items */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="group block h-full">
                      <article className="rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col">
                        {/* Thumbnail */}
                        <div className="relative h-44 bg-gray-100">
                          {item.thumb ? (
                            <Image
                              src={item.thumb}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                              <SectionIcon className="w-10 h-10 text-gray-300" />
                            </div>
                          )}
                        </div>
                        {/* Text */}
                        <div className="p-5 flex-1 flex flex-col">
                          {item.publishDate && (
                            <p className="text-xs text-gray-400 mb-2">{fmtDate(item.publishDate)}</p>
                          )}
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                            {stripMd(item.content).slice(0, 150)}
                          </p>
                          {item.hasDoc && item.attachmentUrl && (
                            <div className="pt-3 border-t border-gray-100">
                              <span className="inline-flex items-center gap-1 text-xs text-orange-500 font-medium">
                                <Paperclip className="w-3.5 h-3.5" /> Attachment available
                              </span>
                            </div>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      </section>
    </>
  );
}
