/**
 * @file page.tsx
 * @description Achievements page — notable accolades fetched from the backend API with static fallback
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award } from "lucide-react";
import Image from "next/image";
import { achievements } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Notable achievements and accolades of GBN Govt. Polytechnic Nilokheri.",
};

/** Static fallback achievements shown when no data is in the DB yet. */
const staticAchievements = [
  {
    title: "Toyota Boshoku Hitozukuri Centre",
    date: "2025",
    description:
      "MoU with Toyota Boshoku Device India Limited, Bawal for a state-of-the-art Smart Classroom and Lab facility. Industrial-grade Advanced PLC and Electro-pneumatic trainer kits installed. Inaugurated by MD Naoki Hiraguchi and delegation.",
    imageUrl: null as string | null,
  },
  {
    title: "State Level Energy Conservation Award",
    date: "2024",
    description:
      "Appreciation Certificate in State Level Energy Conservation Award (SLECA-2024) in the category of Institutions & Organisations with connected load below 500 kW, for the year 2023-24.",
    imageUrl: null as string | null,
  },
  {
    title: "State Level Competition Winner",
    date: "2025",
    description:
      "Student secured 3rd position in State Level Competition at InderDhanush Auditorium, Sector 5, Panchkula with an individual project entry. Awarded ₹5,000 cash prize.",
    imageUrl: null as string | null,
  },
  {
    title: "District-Level Youth Festival 2025",
    date: "2025",
    description:
      "Outstanding performance at the District-Level Youth Festival (Karnal) — 1st Position in Science Mela (Solo), 2nd Position in Group Dance, 3rd Position in Science Mela (Group) and Poetry.",
    imageUrl: null as string | null,
  },
];

export default async function AchievementsPage() {
  let items: { title: string; date: string; description: string; imageUrl: string | null }[] = [];

  try {
    const res = await achievements.list({ limit: 50 });
    if (res.data && res.data.length > 0) {
      items = res.data.map((a) => ({
        title: String(a.title ?? ""),
        description: String(a.description ?? ""),
        date: a.date
          ? new Date(String(a.date)).getFullYear().toString()
          : "",
        imageUrl: a.imageUrl ? String(a.imageUrl) : null,
      }));
    } else {
      items = staticAchievements;
    }
  } catch {
    items = staticAchievements;
  }

  return (
    <>
      <PageHeader
        title="Achievements"
        subtitle="Celebrating Excellence Across Academics, Sports & Innovation"
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Achievements" },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No achievements added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item, i) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="bg-linear-to-r from-emerald-600 to-emerald-700 p-4 flex items-center gap-3">
                    <Award className="w-5 h-5 text-white shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base truncate">{item.title}</h3>
                    </div>
                    {item.date && (
                      <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 shrink-0 text-xs">
                        {item.date}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    {item.imageUrl && (
                      <div className="relative w-full h-36 mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
