/**
 * @file page.tsx
 * @description Infrastructure page — 26.4-acre campus overview with dynamic labs from backend, hostels, library, sports, and ICT facilities
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  BookOpen,
  Home,
  Dumbbell,
  Monitor,
  Beaker,
  Wifi,
  ShieldCheck,
  Droplets,
  Zap,
  Leaf,
  Award,
} from "lucide-react";
import { labs, departments } from "@/lib/api";

export const metadata: Metadata = {
  title: "Infrastructure",
  description:
    "Explore the world-class infrastructure of GBN Govt. Polytechnic Nilokheri — 26.4 acres campus with modern labs, hostels, library and sports facilities.",
};

export const dynamic = "force-dynamic";

const campusStats = [
  { icon: Building2, label: "Total Area", value: "26.4 Acres" },
  { icon: Building2, label: "Built-up Area", value: "31,578 sq.m" },
  { icon: Beaker, label: "Laboratories", value: "50+" },
  { icon: Monitor, label: "Smart Classrooms", value: "3" },
];

const sports = [
  "Badminton", "Volleyball", "Football", "Cricket",
  "Hockey", "Basketball", "Kabaddi", "Table Tennis", "Handball",
];

export default async function InfrastructurePage() {
  // Fetch labs and departments from backend
  let labsByDept: { dept: string; code: string; count: number; labs: string[] }[] = [];

  try {
    const [labsRes, deptRes] = await Promise.all([
      labs.list({ limit: 200 }),
      departments.list({ limit: 50 }),
    ]);

    const deptList = deptRes.data as Record<string, unknown>[];
    const labList = labsRes.data as Record<string, unknown>[];

    // Build department map: id → { name, code }
    const deptMap: Record<string, { name: string; code: string }> = {};
    for (const d of deptList) {
      deptMap[String(d.id)] = {
        name: String(d.name ?? ""),
        code: String(d.code ?? ""),
      };
    }

    // Group labs by department
    const grouped: Record<string, string[]> = {};
    for (const lab of labList) {
      const deptId = String(lab.departmentId ?? "");
      if (!grouped[deptId]) grouped[deptId] = [];
      grouped[deptId].push(String(lab.name ?? "Lab"));
    }

    // Convert to array sorted by lab count (descending)
    labsByDept = Object.entries(grouped)
      .map(([deptId, labNames]) => ({
        dept: deptMap[deptId]?.name ?? "Other",
        code: deptMap[deptId]?.code ?? "",
        count: labNames.length,
        labs: labNames.sort(),
      }))
      .sort((a, b) => b.count - a.count);
  } catch {
    // API unavailable — show empty state
  }

  const defaultTab = labsByDept[0]?.code || "ME";

  return (
    <>
      <PageHeader
        title="Infrastructure"
        subtitle="World-Class Facilities Spread Across 26.4 Acres"
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Infrastructure" },
        ]}
      />

      {/* Campus Overview Stats */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {campusStats.map((stat, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <stat.icon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Building Details */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Campus <span className="text-emerald-600">Facilities</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  Building Area Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Classrooms & Tutorial Rooms", value: "1,248 sq.m" },
                    { label: "Drawing Halls", value: "840 sq.m" },
                    { label: "Laboratories", value: "6,362 sq.m" },
                    { label: "Workshop", value: "1,715 sq.m" },
                    { label: "Administrative Block", value: "1,054 sq.m" },
                    { label: "Amenities Area", value: "6,948 sq.m" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-emerald-200">
                    <span className="font-bold text-gray-800">Total Built-up Area</span>
                    <span className="font-bold text-emerald-600">18,167 sq.m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  Central Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-700">~1L</div>
                      <div className="text-xs text-gray-500 mt-1">Volumes</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-700">19</div>
                      <div className="text-xs text-gray-500 mt-1">Journals/Magazines</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-700">~1000</div>
                      <div className="text-xs text-gray-500 mt-1">sq.m Area</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-orange-700">150</div>
                      <div className="text-xs text-gray-500 mt-1">Reading Capacity</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    The library provides a <strong>Book Bank</strong> that supplies textbooks
                    for the complete course duration to students.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hostels */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Hostel <span className="text-emerald-600">Facilities</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <div className="bg-linear-to-r from-blue-500 to-blue-600 p-4">
                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Boys Hostel (Hostel-A)
                </h3>
              </div>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-700">80</div>
                    <div className="text-xs text-gray-500">Rooms</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-700">240</div>
                    <div className="text-xs text-gray-500">Capacity</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Wifi, text: "Wi-Fi" },
                    { icon: ShieldCheck, text: "CCTV" },
                    { icon: Droplets, text: "RO Water" },
                    { icon: Zap, text: "Generator" },
                    { icon: Dumbbell, text: "Sports" },
                  ].map((item, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      <item.icon className="w-3 h-3" />
                      {item.text}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="bg-linear-to-r from-pink-500 to-rose-500 p-4">
                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Girls Hostel (Saraswati Hostel)
                </h3>
              </div>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-xl font-bold text-pink-700">35</div>
                    <div className="text-xs text-gray-500">Rooms</div>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-xl font-bold text-pink-700">105</div>
                    <div className="text-xs text-gray-500">Capacity</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Wifi, text: "Wi-Fi" },
                    { icon: ShieldCheck, text: "24/7 Security" },
                    { icon: Droplets, text: "Hot Water" },
                    { icon: Zap, text: "Generator" },
                    { icon: ShieldCheck, text: "CCTV" },
                  ].map((item, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      <item.icon className="w-3 h-3" />
                      {item.text}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Laboratories — dynamic from backend */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Department <span className="text-emerald-600">Laboratories</span>
          </h2>

          {labsByDept.length === 0 ? (
            <div className="text-center py-12">
              <Beaker className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Laboratory information coming soon.</p>
            </div>
          ) : (
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-1 bg-gray-100 p-1 rounded-xl mb-6">
                {labsByDept.map((d) => (
                  <TabsTrigger
                    key={d.code}
                    value={d.code}
                    className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg"
                  >
                    {d.code || d.dept} ({d.count})
                  </TabsTrigger>
                ))}
              </TabsList>
              {labsByDept.map((d) => (
                <TabsContent key={d.code} value={d.code}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Beaker className="w-6 h-6 text-emerald-600" />
                        <h3 className="text-lg font-bold">
                          {d.dept} — {d.count} Lab{d.count !== 1 ? "s" : ""}
                        </h3>
                      </div>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {d.labs.map((lab, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
                          >
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            {lab}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      {/* Sports & Green Campus */}
      <section className="py-12 bg-gray-50" id="green">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-emerald-600" />
                  Sports Facilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sports.map((sport, i) => (
                    <Badge key={i} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-sm px-3 py-1.5">
                      {sport}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Both indoor and outdoor sports facilities available for hostel
                  residents and day scholars.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  Green Campus Initiative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600 text-sm">
                  <p>
                    GBN Polytechnic is committed to sustainability and environmental
                    conservation. Our green initiatives include:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Solar panels for renewable energy generation",
                      "Rainwater harvesting system",
                      "Extensive tree plantation drives",
                      "Waste management and recycling programs",
                      "Energy-efficient LED lighting across campus",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Leaf className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Badge className="mt-4 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  State Level Energy Conservation Award 2024
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
