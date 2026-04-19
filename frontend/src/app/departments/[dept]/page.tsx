/**
 * @file page.tsx
 * @description Dynamic department detail page — fetches faculty, labs, courses, and resources
 *              live from the backend API. All content is editable from the admin panel.
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { departments as deptConfig } from "@/lib/config";
import { toSafeUrl } from "@/lib/safe-url";
import {
  Users, Beaker, BookOpen, Award, FileText, Download,
  GraduationCap, UserCircle, ExternalLink,
} from "lucide-react";

// ISR: re-render at most every 60s so admin panel changes reflect quickly
export const revalidate = 60;

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";


async function get(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

type Params = Promise<{ dept: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { dept } = await params;
  const config = deptConfig.find((d) => d.code === dept);
  if (!config) return {};
  return { title: `${config.name} Department`, description: config.description };
}

export default async function DepartmentPage({ params }: { params: Params }) {
  const { dept: slug } = await params;

  const config = deptConfig.find((d) => d.code === slug);
  if (!config) notFound();

  // 1. Fetch department from API (get UUID + DB metadata)
  const deptRes = await get(`${API}/departments/${slug}`);
  if (!deptRes?.data) notFound();
  const dept = deptRes.data as Record<string, unknown>;
  const deptId = dept.id as string;

  // 2. Fetch everything else in parallel using the department UUID
  const [facultyRes, labsRes, coursesRes, materialsRes, lessonPlansRes, syllabusRes] =
    await Promise.all([
      get(`${API}/faculty?departmentId=${deptId}&limit=100`),
      get(`${API}/labs?departmentId=${deptId}&limit=100`),
      get(`${API}/courses?departmentId=${deptId}&limit=200`),
      get(`${API}/study-materials?departmentId=${deptId}&limit=100`),
      get(`${API}/lesson-plans?departmentId=${deptId}&limit=100`),
      get(`${API}/syllabus?departmentId=${deptId}&limit=100`),
    ]);

  type Row = Record<string, unknown>;
  const faculty: Row[] = facultyRes?.data ?? [];
  const labs: Row[] = labsRes?.data ?? [];
  const courses: Row[] = coursesRes?.data ?? [];
  const materials: Row[] = materialsRes?.data ?? [];
  const lessonPlans: Row[] = lessonPlansRes?.data ?? [];
  const syllabi: Row[] = syllabusRes?.data ?? [];

  // Group courses by semester
  const bySemester = courses.reduce<Record<number, Row[]>>((acc, c) => {
    const sem = c.semester as number;
    (acc[sem] ??= []).push(c);
    return acc;
  }, {});

  const about = (dept.description as string) || config.description;
  const hodName = dept.hodName as string | undefined;
  const hod = faculty.find((f) => (f.designation as string)?.toUpperCase().includes("HOD"));

  return (
    <>
      <PageHeader
        title={config.name}
        subtitle={config.description}
        breadcrumbs={[
          { label: "Departments", href: "/departments" },
          { label: config.shortName },
        ]}
        gradient={config.color}
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-10 mb-12">
            <Card className="text-center shadow-lg">
              <CardContent className="p-5">
                <Users className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <div className="text-xl font-bold">{config.seats ?? "—"}</div>
                <div className="text-xs text-gray-500">Seats</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardContent className="p-5">
                <Beaker className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <div className="text-xl font-bold">{labs.length || "—"}</div>
                <div className="text-xs text-gray-500">Labs</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardContent className="p-5">
                <BookOpen className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <div className="text-xl font-bold">3 Years</div>
                <div className="text-xs text-gray-500">Duration</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardContent className="p-5">
                <Award className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <div className="text-xl font-bold">HSBTE</div>
                <div className="text-xs text-gray-500">Affiliated</div>
              </CardContent>
            </Card>
          </div>

          {/* About */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-3">
              About the <span className="text-emerald-600">Department</span>
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">{about}</p>
            {(hodName || hod) && (
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2 text-sm">
                <UserCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800">
                  <span className="font-medium">HOD: </span>
                  {hodName || (hod?.name as string)}
                </span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="faculty" className="w-full">
            <div className="overflow-x-auto -mx-4 px-4 mb-6">
              <TabsList className="bg-gray-100 p-1 rounded-xl inline-flex w-auto min-w-full sm:min-w-0">
                {[
                  { value: "faculty", icon: Users, label: "Faculty" },
                  { value: "curriculum", icon: BookOpen, label: "Curriculum" },
                  { value: "labs", icon: Beaker, label: "Labs" },
                  { value: "lesson-plans", icon: FileText, label: "Lesson Plans" },
                  { value: "resources", icon: Download, label: "Resources" },
                ].map(({ value, icon: Icon, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white whitespace-nowrap text-xs sm:text-sm"
                  >
                    <Icon className="w-4 h-4 mr-1 sm:mr-1.5" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* ── CURRICULUM ─────────────────────────────────── */}
            <TabsContent value="curriculum">
              {Object.keys(bySemester).length === 0 ? (
                <Empty icon={BookOpen} message="No subjects have been added yet. An HOD can add them from the admin panel." />
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].filter((s) => bySemester[s]?.length).map((sem) => (
                    <div key={sem} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-emerald-700">{sem}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {sem === 1 ? "1st" : sem === 2 ? "2nd" : sem === 3 ? "3rd" : `${sem}th`} Semester
                          </h4>
                          <p className="text-xs text-gray-500">{bySemester[sem].length} subjects</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="grid sm:grid-cols-2 gap-2.5">
                          {bySemester[sem].map((c) => (
                            <div key={c.id as string} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm text-gray-700 truncate">{c.name as string}</p>
                                {(c.code as string) && <p className="text-xs text-gray-400">{c.code as string}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── FACULTY ───────────────────────────────────── */}
            <TabsContent value="faculty">
              {faculty.length === 0 ? (
                <Empty icon={Users} message="No faculty members have been added yet. Admins can add them from the admin panel." />
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                  {hod && (
                    <div className="px-6 py-5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        {hod.photoUrl
                          ? <Image src={hod.photoUrl as string} alt="" width={56} height={56} className="w-14 h-14 rounded-full object-cover" />
                          : <UserCircle className="w-8 h-8 text-emerald-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{hod.name as string}</p>
                        <p className="text-sm text-emerald-700 font-medium">{hod.designation as string}</p>
                        {(hod.qualification as string) && <p className="text-xs text-gray-500 mt-0.5">{hod.qualification as string}</p>}
                      </div>
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50/80">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">S.No.</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Qualification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {faculty
                          .filter((f) => !(f.designation as string)?.toUpperCase().includes("HOD"))
                          .map((f, i) => (
                            <tr key={f.id as string} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-3.5 text-gray-400">{i + 1}</td>
                              <td className="px-6 py-3.5 font-medium text-gray-900">{f.name as string}</td>
                              <td className="px-6 py-3.5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(f.designation as string)?.toLowerCase().includes("guest")
                                    ? "bg-amber-50 text-amber-700"
                                    : (f.designation as string)?.toLowerCase().includes("lab") || (f.designation as string)?.toLowerCase().includes("workshop")
                                      ? "bg-blue-50 text-blue-700"
                                      : (f.designation as string)?.toLowerCase().includes("sr.")
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-gray-100 text-gray-700"
                                  }`}>
                                  {f.designation as string}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 text-gray-500 hidden sm:table-cell">{(f.qualification as string) || "—"}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 bg-gray-50/50 border-t text-xs text-gray-400">
                    Total: {faculty.length} faculty members
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ── LABS ──────────────────────────────────────── */}
            <TabsContent value="labs">
              {labs.length === 0 ? (
                <Empty icon={Beaker} message="No labs have been added yet. HOD can add them from the admin panel." />
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {labs.map((lab) => (
                      <div key={lab.id as string} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Beaker className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700">{lab.name as string}</p>
                          {(lab.roomNumber as string) && <p className="text-xs text-gray-400">Room: {lab.roomNumber as string}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ── LESSON PLANS ──────────────────────────────── */}
            <TabsContent value="lesson-plans">
              <ResourceSection
                title="Lesson Plans"
                icon={<FileText className="w-4 h-4 text-blue-600" />}
                items={lessonPlans}
                colorClass="hover:bg-blue-50 hover:border-blue-200"
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                emptyMsg="No lesson plans uploaded yet. HOD can upload them from the admin panel."
              />
            </TabsContent>

            {/* ── RESOURCES ─────────────────────────────────── */}
            <TabsContent value="resources">
              <div className="space-y-5">

                {/* Study Materials */}
                <ResourceSection
                  title="Study Materials"
                  icon={<BookOpen className="w-4 h-4 text-emerald-600" />}
                  items={materials}
                  colorClass="hover:bg-emerald-50 hover:border-emerald-200"
                  iconBg="bg-emerald-100"
                  iconColor="text-emerald-600"
                  emptyMsg="No study materials uploaded yet."
                />

                {/* Syllabus */}
                <ResourceSection
                  title="Syllabus"
                  icon={<GraduationCap className="w-4 h-4 text-purple-600" />}
                  items={syllabi}
                  colorClass="hover:bg-purple-50 hover:border-purple-200"
                  iconBg="bg-purple-100"
                  iconColor="text-purple-600"
                  emptyMsg="No syllabus uploaded yet."
                />

                {/* HSBTE external link */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                  <a
                    href="https://hsbte.org.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">HSBTE Official Syllabus</p>
                        <p className="text-xs text-gray-400">hsbte.org.in</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-amber-600 transition-colors" />
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function Empty({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
      <Icon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

type Row = Record<string, unknown>;

function ResourceSection({
  title, icon, items, colorClass, iconBg, iconColor, emptyMsg,
}: {
  title: string;
  icon: React.ReactNode;
  items: Row[];
  colorClass: string;
  iconBg: string;
  iconColor: string;
  emptyMsg: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
        {icon}
        <span className="font-semibold text-gray-900 text-sm">{title}</span>
      </div>
      {items.length === 0 ? (
        <p className="px-6 py-5 text-sm text-gray-400">{emptyMsg}</p>
      ) : (
        <div className="p-5 grid sm:grid-cols-2 gap-3">
          {items.map((item) => {
            const safeFileUrl = toSafeUrl(String(item.fileUrl ?? ""));
            if (!safeFileUrl) return null;

            return (
              <a
                key={item.id as string}
                href={safeFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-transparent ${colorClass} transition-all cursor-pointer group`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                    <FileText className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{item.title as string}</p>
                    {(item.semester as number) && <p className="text-xs text-gray-400">Semester {item.semester as number}</p>}
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-300 group-hover:text-current transition-colors shrink-0" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
