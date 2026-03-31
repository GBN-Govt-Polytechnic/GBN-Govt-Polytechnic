/**
 * @file page.tsx
 * @description News detail page — full content with inline image display, document download, and cover image
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { news } from "@/lib/api";
import { Calendar, Download, FileText, ImageIcon } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

function isImageMime(mime: string | undefined): boolean {
  return !!mime && mime.startsWith("image/");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await news.getBySlug(slug);
    const item = res.data;
    return {
      title: String(item.title ?? "News"),
      description: String(item.excerpt ?? item.content ?? "").slice(0, 160),
    };
  } catch {
    return { title: "News" };
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  let item: Record<string, unknown> | null = null;

  try {
    const res = await news.getBySlug(slug);
    item = res.data;
  } catch {
    // not found
  }

  if (!item) {
    return (
      <>
        <PageHeader
          title="Not Found"
          breadcrumbs={[
            { label: "News & Notices", href: "/news" },
            { label: "Not Found" },
          ]}
        />
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">This news item could not be found.</p>
        </div>
      </>
    );
  }

  const category = String(item.category ?? "NEWS");
  const publishDate = item.publishDate as string | undefined;
  const imageUrl = item.imageUrl as string | undefined;
  const rawAttachmentUrl = item.attachmentUrl as string | undefined;
  const attachmentUrl =
    rawAttachmentUrl && /^https?:\/\//.test(rawAttachmentUrl) ? rawAttachmentUrl : undefined;
  const attachmentFileName = item.attachmentFileName as string | undefined;
  const attachmentMime = item.attachmentMimeType as string | undefined;
  const attachmentIsImage = isImageMime(attachmentMime);

  const categoryColors: Record<string, string> = {
    NEWS: "bg-emerald-50 text-emerald-700",
    NOTICE: "bg-amber-50 text-amber-700",
    CIRCULAR: "bg-blue-50 text-blue-700",
    TENDER: "bg-purple-50 text-purple-700",
    EVENT: "bg-rose-50 text-rose-700",
  };

  return (
    <>
      <PageHeader
        title={String(item.title)}
        breadcrumbs={[
          { label: "News & Notices", href: "/news" },
          { label: String(item.title) },
        ]}
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <Badge className={categoryColors[category] ?? categoryColors.NEWS}>
              {category}
            </Badge>
            {publishDate && (
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(publishDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Cover image */}
          {imageUrl && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
              <Image
                src={imageUrl}
                alt={String(item.title)}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <MarkdownContent content={String(item.content ?? "")} />

          {/* Attachment — image type: show inline */}
          {attachmentUrl && attachmentIsImage && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                <ImageIcon className="w-4 h-4" />
                <span>{attachmentFileName ?? "Attached Image"}</span>
              </div>
              <div className="relative w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={attachmentUrl}
                  alt={attachmentFileName ?? "Attachment"}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 mt-3 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download full image
              </a>
            </div>
          )}

          {/* Attachment — document type: show download card */}
          {attachmentUrl && !attachmentIsImage && (
            <div className="mt-8 p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachmentFileName ?? "Attachment"}
                </p>
                <p className="text-xs text-gray-400">
                  {item.attachmentFileSize
                    ? `${(Number(item.attachmentFileSize) / 1024).toFixed(0)} KB`
                    : attachmentFileName?.split(".").pop()?.toUpperCase() ?? "File"}
                </p>
              </div>
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
