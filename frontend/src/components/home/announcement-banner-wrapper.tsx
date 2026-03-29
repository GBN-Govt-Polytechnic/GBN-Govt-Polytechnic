/**
 * @file announcement-banner-wrapper.tsx
 * @description Server component wrapper — fetches active banners and passes them to the client-side rotating banner.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { banners } from "@/lib/api";
import { AnnouncementBannerClient } from "./announcement-banner";

export async function AnnouncementBanner() {
  let items: { id: string; title: string; message: string; variant: string; linkUrl?: string; linkText?: string }[] = [];
  try {
    const res = await banners.listActive();
    if (res.data && res.data.length > 0) {
      items = (res.data as Record<string, unknown>[]).map((b) => ({
        id: String(b.id),
        title: String(b.title ?? ""),
        message: String(b.message ?? ""),
        variant: String(b.variant ?? "INFO"),
        linkUrl: b.linkUrl ? String(b.linkUrl) : undefined,
        linkText: b.linkText ? String(b.linkText) : undefined,
      }));
    }
  } catch {
    /* API unavailable */
  }

  if (items.length === 0) return null;

  return <AnnouncementBannerClient items={items} />;
}
