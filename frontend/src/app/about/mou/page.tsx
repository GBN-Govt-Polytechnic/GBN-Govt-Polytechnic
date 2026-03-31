/**
 * @file page.tsx
 * @description MoU & Industry Partnerships page — list of memorandums of understanding fetched from backend API with static fallback
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Handshake, Building2, FileText } from "lucide-react";
import { mous } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "MoU & Industry Partnerships",
  description:
    "Memorandum of Understanding (MoU) signed by GBN Govt. Polytechnic Nilokheri with leading industries for training, internships, and placements.",
};

/** Static fallback used only when no data exists in the DB yet. */
const staticCompanies = [
  "Central Tool Room Ludhiana",
  "Karnal Milk Food Ltd.",
  "Modern Dairies",
  "Hartron",
  "Maruti Suzuki",
  "Toyota Boshoku",
  "Hella India",
  "JBM Group",
  "Orient Fans",
  "Lava Mobile",
  "Munjal Showa Ltd.",
  "Indo Autotech",
  "Hi-Tech Gears",
  "Micromax",
  "Samsung",
  "Sona Koyo",
  "TATA Motors",
  "Hero MotoCorp",
  "Honda Motorcycle",
  "Motherson Sumi",
  "Subros Ltd.",
  "Delphi TVS",
  "Napino Auto & Electronics",
  "Badve Engineering",
  "Omax Autos",
  "Shriram Piston",
];

interface MoUItem {
  companyName: string;
  purpose?: string;
  documentUrl?: string;
}

export default async function MOUPage() {
  let items: MoUItem[] = [];

  try {
    const res = await mous.list({ limit: 100 });
    if (res.data && res.data.length > 0) {
      items = (res.data as Record<string, unknown>[]).map((m) => ({
        companyName: String(m.companyName ?? ""),
        purpose: m.purpose ? String(m.purpose) : undefined,
        documentUrl: m.documentUrl ? String(m.documentUrl) : undefined,
      }));
    } else {
      items = staticCompanies.map((name) => ({ companyName: name }));
    }
  } catch {
    items = staticCompanies.map((name) => ({ companyName: name }));
  }

  return (
    <>
      <PageHeader
        title="MoU & Industry Partnerships"
        subtitle="Collaborations with Leading Industries for Student Growth"
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "MoU" },
        ]}
      />

      <section className="container mx-auto px-4 py-12 space-y-8">
        {/* Description */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2.5">
                <Handshake className="h-6 w-6 text-emerald-700" />
              </div>
              <CardTitle className="text-xl">About MoU Partnerships</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              GBN Govt. Polytechnic has signed MoUs with leading industries to
              provide students with practical training, internships, and
              placement opportunities. These partnerships bridge the gap between
              academia and industry, ensuring students are job-ready upon
              graduation.
            </p>
          </CardContent>
        </Card>

        {/* Company Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Partner Companies{" "}
            <Badge variant="secondary" className="ml-2 text-sm">
              {items.length} Partners
            </Badge>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <Card
                key={item.companyName}
                className="hover:shadow-lg hover:border-emerald-200 transition-all"
              >
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="rounded-lg bg-emerald-100 p-2 shrink-0">
                    <Building2 className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm block truncate">{item.companyName}</span>
                    {item.purpose && (
                      <span className="text-xs text-muted-foreground line-clamp-1">{item.purpose}</span>
                    )}
                  </div>
                  {item.documentUrl && (
                    <a
                      href={item.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                      title="View MoU document"
                    >
                      <FileText className="h-4 w-4 text-emerald-500 hover:text-emerald-700" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
