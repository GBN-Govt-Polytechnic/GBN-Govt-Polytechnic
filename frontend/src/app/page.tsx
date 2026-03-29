/**
 * @file page.tsx
 * @description Homepage — renders hero slider, news bar, stats counters, quick links, about preview, departments preview, and placement highlights
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { HeroSlider } from "@/components/home/hero-slider";
import { NewsNotices } from "@/components/home/news-notices";
import { AnnouncementBanner } from "@/components/home/announcement-banner-wrapper";
import { StatsSection } from "@/components/home/stats-section";
import { AboutPreview } from "@/components/home/about-preview";
import { DepartmentsPreview } from "@/components/home/departments-preview";
import { PlacementPreview } from "@/components/home/placement-preview";
import { QuickLinks } from "@/components/home/quick-links";

export default function Home() {
  return (
    <>
      <div className="relative">
        <HeroSlider />
        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-2">
          <div className="container mx-auto">
            <NewsNotices />
          </div>
        </div>
        <AnnouncementBanner />
      </div>
      <StatsSection />
      <QuickLinks />
      <AboutPreview />
      <DepartmentsPreview />
      <PlacementPreview />
    </>
  );
}
