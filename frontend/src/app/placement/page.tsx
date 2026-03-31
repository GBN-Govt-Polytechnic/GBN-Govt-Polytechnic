/**
 * @file page.tsx
 * @description Placement Cell page — branch-wise placement statistics and top recruiters fetched from the backend API
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase, TrendingUp, Building2, Users, IndianRupee, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { placements } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Placement Cell",
  description:
    "Placement cell of GBN Govt. Polytechnic Nilokheri — connecting students with industry opportunities.",
};

/** Static fallback stats used only when no data exists in the DB yet. */
const staticStats = [
  { branch: "Civil", eligible: 61, placed: 9 },
  { branch: "Computer", eligible: 102, placed: 7 },
  { branch: "Electrical", eligible: 54, placed: 43 },
  { branch: "ECE", eligible: 50, placed: 32 },
  { branch: "ICE", eligible: 25, placed: 19 },
  { branch: "Mechanical", eligible: 106, placed: 78 },
];

/** Static fallback recruiter list used only when no companies exist in the DB. */
const staticRecruiters = [
  "Asian Paints Ltd.",
  "Maruti Suzuki India Ltd.",
  "Schneider Electric India Pvt. Ltd.",
  "Chandigarh Power Distribution Ltd.",
  "ISGEC Heavy Engineering Ltd.",
  "BCH Electric Ltd.",
  "Tata Hitachi Construction Machinery",
  "Jindal Stainless Ltd.",
  "Shree Cement Ltd.",
  "Toyota Boshoku",
  "ATLI Battery Technology",
  "Ultratech Cement",
  "ACC Cement",
  "Subros Ltd.",
  "Padget Electronics",
  "Vivo India",
];

export default async function PlacementPage() {
  // Fetch live stats and companies in parallel
  let statsRows: { branch: string; eligible: number; placed: number }[] = [];
  let sessionLabel = "";
  let recruiters: { name: string; website?: string }[] = [];
  let highestPackage: number | null = null;
  let totalCompaniesVisited = 0;

  const [statsResult, companiesResult] = await Promise.allSettled([
    placements.listStats(),
    placements.listCompanies(),
  ]);

  if (statsResult.status === "fulfilled" && statsResult.value.data.length > 0) {
    const apiStats = statsResult.value.data as Record<string, unknown>[];
    statsRows = apiStats.map((s) => {
      const dept = s.department as Record<string, unknown> | undefined;
      const placed = Number(s.studentsPlaced ?? 0);
      const eligible = Number(s.totalStudents ?? 0);
      if (s.highestPackage && Number(s.highestPackage) > (highestPackage ?? 0)) {
        highestPackage = Number(s.highestPackage);
      }
      totalCompaniesVisited += Number(s.companiesVisited ?? 0);
      const session = s.session as Record<string, unknown> | undefined;
      if (session?.name && !sessionLabel) sessionLabel = String(session.name);
      return {
        branch: String(dept?.shortName ?? dept?.name ?? "Unknown"),
        eligible,
        placed,
      };
    });
  } else {
    // No DB data — use static fallback
    statsRows = staticStats;
    sessionLabel = "2024-25";
  }

  if (companiesResult.status === "fulfilled" && companiesResult.value.data.length > 0) {
    recruiters = (companiesResult.value.data as Record<string, unknown>[]).map((c) => ({
      name: String(c.name),
      website: c.website ? String(c.website) : undefined,
    }));
  } else {
    // No DB data — use static fallback
    recruiters = staticRecruiters.map((name) => ({ name }));
  }

  const totalEligible = statsRows.reduce((s, r) => s + r.eligible, 0);
  const totalPlaced = statsRows.reduce((s, r) => s + r.placed, 0);
  const placementRate = totalEligible > 0 ? Math.round((totalPlaced / totalEligible) * 100) : 0;
  const companiesCount = totalCompaniesVisited > 0 ? `${totalCompaniesVisited}+` : `${recruiters.length}+`;
  const pkgDisplay = highestPackage ? `₹${highestPackage} LPA` : "₹5 LPA";

  return (
    <>
      <PageHeader
        title="Placement Cell"
        subtitle="Connecting Talent with Industry Since Decades"
        breadcrumbs={[{ label: "Placement" }]}
      />

      {/* Highlight Stats */}
      <section className="py-10 -mt-6 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, value: `${totalPlaced}`, label: `Students Placed (${sessionLabel})` },
              { icon: Building2, value: companiesCount, label: "Companies Visited" },
              { icon: IndianRupee, value: pkgDisplay, label: "Highest Package" },
              { icon: TrendingUp, value: `${placementRate}%`, label: "Placement Rate" },
            ].map((stat, i) => (
              <Card key={i} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-5">
                  <stat.icon className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Branch-Wise Placement */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">
            Branch-Wise Placement{" "}
            {sessionLabel && (
              <span className="text-emerald-600">({sessionLabel})</span>
            )}
          </h2>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold text-gray-700">Branch</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Eligible</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Placed</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {statsRows.map((row, i) => {
                    const rate = row.eligible > 0 ? Math.round((row.placed / row.eligible) * 100) : 0;
                    return (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-900">{row.branch}</td>
                        <td className="p-4 text-center text-gray-600">{row.eligible}</td>
                        <td className="p-4 text-center font-semibold text-emerald-600">{row.placed}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 font-bold">
                    <td className="p-4 text-gray-900">Total</td>
                    <td className="p-4 text-center text-gray-900">{totalEligible}</td>
                    <td className="p-4 text-center text-emerald-600">{totalPlaced}</td>
                    <td className="p-4 text-center text-emerald-600">{placementRate}%</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Top Recruiters */}
      <section className="py-12 bg-gray-50" id="recruiters">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-8">
            Our <span className="text-emerald-600">Recruiters</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recruiters.map((r, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    {r.website ? (
                      <a
                        href={r.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sm text-gray-900 hover:text-emerald-600 transition-colors"
                      >
                        {r.name}
                      </a>
                    ) : (
                      <div className="font-medium text-sm text-gray-900">{r.name}</div>
                    )}
                  </div>
                  <Briefcase className="w-4 h-4 text-gray-300 shrink-0 ml-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">
            and many more leading companies across various sectors...
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Card className="bg-linear-to-r from-emerald-600 to-emerald-700 border-0 text-white">
            <CardContent className="p-10">
              <h2 className="text-2xl font-bold mb-3">Want to Recruit from GBN?</h2>
              <p className="text-emerald-100 mb-6 max-w-md mx-auto">
                Partner with us for campus recruitment. Our students are
                industry-ready and eager to contribute.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-full font-medium hover:bg-emerald-50 transition-colors"
              >
                Contact TPO
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
