/**
 * @file page.tsx
 * @description Dashboard home — modern role-based overview with stat cards, activity feed, and quick actions
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/config/roles";
import {
  dashboard as dashboardApi,
  auditLogs as auditLogsApi,
  news as newsApi,
  departments as departmentsApi,
  faculty as facultyApi,
  studyMaterials as studyMaterialsApi,
  labs as labsApi,
  courses as coursesApi,
  lessonPlans as lessonPlansApi,
  syllabus as syllabusApi,
  timetables as timetablesApi,
} from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import {
  Building2, Users, Newspaper, Image, Inbox, Briefcase,
  ArrowRight, Plus, Activity, Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


function StatCard({
  label, value, icon: Icon, href, color,
}: {
  label: string; value: number | string; icon: React.ElementType; href: string; color?: string;
}) {
  return (
    <Link href={href}>
      <Card className="group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border/60">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color ?? "bg-primary/10 text-primary"}`}>
              <Icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


function QuickAction({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link href={href}>
      <Button variant="outline" size="sm" className="h-9 gap-2 text-sm border-border/60 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Button>
    </Link>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      dashboardApi.stats(),
      auditLogsApi.list({ limit: 8 }),
    ]).then(([statsRes, logsRes]) => {
      if (cancelled) return;
      if (statsRes.data) setStats(statsRes.data);
      if (logsRes.data) setLogs(logsRes.data);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const s = stats ?? {} as Record<string, unknown>;

  return (
    <>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Departments" value={loading ? "—" : (s.departments as number) ?? 0} icon={Building2} href="/departments" color="bg-blue-50 text-blue-600" />
        <StatCard label="Faculty Members" value={loading ? "—" : (s.faculty as number) ?? 0} icon={Users} href="/departments" color="bg-violet-50 text-violet-600" />
        <StatCard label="News & Notices" value={loading ? "—" : (s.news as number) ?? 0} icon={Newspaper} href="/news" color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Pending Submissions" value={loading ? "—" : (s.pendingSubmissions as number) ?? 0} icon={Inbox} href="/submissions" color="bg-amber-50 text-amber-600" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Recent Activity — wider */}
        <Card className="lg:col-span-3 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </div>
            <Link href="/logs">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-primary">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {logs.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent activity.</p>
              )}
              {logs.slice(0, 8).map((log, i) => (
                <div key={log.id as string} className={`flex items-start gap-3 py-2.5 ${i < logs.length - 1 ? "border-b border-border/40" : ""}`}>
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/40" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{(log.admin as Record<string, unknown>)?.name as string ?? log.adminId as string}</span>{" "}
                      <span className="text-muted-foreground lowercase">{log.action as string}</span>{" "}
                      <span className="font-medium">{log.entityType as string}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatDateTime(log.createdAt as string)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <QuickAction href="/news/new" icon={Plus} label="Create News Post" />
              <QuickAction href="/gallery/new" icon={Plus} label="Upload to Gallery" />
              <QuickAction href="/submissions" icon={Inbox} label="View Submissions" />
              <QuickAction href="/hero-slides" icon={Image} label="Manage Hero Slides" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function HODDashboard() {
  const { user } = useAuth();
  const deptSlug = user?.departmentSlug ?? "cse";
  const deptId = user?.departmentId;

  const [, setDept] = useState<Record<string, unknown> | null>(null);
  const [deptFaculty, setDeptFaculty] = useState<Record<string, unknown>[]>([]);
  const [deptLogs, setDeptLogs] = useState<Record<string, unknown>[]>([]);
  const [counts, setCounts] = useState({
    faculty: 0, labs: 0, materials: 0, courses: 0,
    lessonPlans: 0, syllabus: 0, timetables: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const id = deptId;
    if (!id) { setLoading(false); return; }
    Promise.all([
      departmentsApi.get(deptSlug),
      facultyApi.list({ departmentId: id }),
      labsApi.list({ departmentId: id }),
      studyMaterialsApi.list({ departmentId: id, limit: 1 }),
      coursesApi.list({ departmentId: id }),
      lessonPlansApi.list({ departmentId: id, limit: 1 }),
      syllabusApi.list({ departmentId: id, limit: 1 }),
      timetablesApi.list({ departmentId: id, limit: 1 }),
      auditLogsApi.list({ limit: 6 }).catch(() => ({ data: [] })),
    ]).then(([deptRes, facRes, labsRes, matsRes, coursesRes, lpRes, sylRes, ttRes, logsRes]) => {
      if (cancelled) return;
      if (deptRes.data) setDept(deptRes.data);
      if (facRes.data) setDeptFaculty(Array.isArray(facRes.data) ? facRes.data : []);
      setCounts({
        faculty: facRes.meta?.total ?? (Array.isArray(facRes.data) ? facRes.data.length : 0),
        labs: labsRes.meta?.total ?? (Array.isArray(labsRes.data) ? labsRes.data.length : 0),
        materials: matsRes.meta?.total ?? (Array.isArray(matsRes.data) ? matsRes.data.length : 0),
        courses: coursesRes.meta?.total ?? (Array.isArray(coursesRes.data) ? coursesRes.data.length : 0),
        lessonPlans: lpRes.meta?.total ?? (Array.isArray(lpRes.data) ? lpRes.data.length : 0),
        syllabus: sylRes.meta?.total ?? (Array.isArray(sylRes.data) ? sylRes.data.length : 0),
        timetables: ttRes.meta?.total ?? (Array.isArray(ttRes.data) ? ttRes.data.length : 0),
      });
      if (Array.isArray(logsRes.data)) setDeptLogs(logsRes.data);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [deptId, deptSlug]);

  const v = (n: number) => loading ? "—" : n;

  return (
    <>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Faculty Members" value={v(counts.faculty)} icon={Users} href={`/faculty?dept=${deptSlug}`} color="bg-violet-50 text-violet-600" />
        <StatCard label="Labs" value={v(counts.labs)} icon={Building2} href={`/labs?dept=${deptSlug}`} color="bg-blue-50 text-blue-600" />
        <StatCard label="Study Materials" value={v(counts.materials)} icon={Newspaper} href={`/study-materials?dept=${deptSlug}`} color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Subjects" value={v(counts.courses)} icon={Briefcase} href={`/courses?dept=${deptSlug}`} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 mt-4">
        <StatCard label="Lesson Plans" value={v(counts.lessonPlans)} icon={Newspaper} href={`/lesson-plans?dept=${deptSlug}`} color="bg-rose-50 text-rose-600" />
        <StatCard label="Syllabus" value={v(counts.syllabus)} icon={Newspaper} href={`/syllabus?dept=${deptSlug}`} color="bg-cyan-50 text-cyan-600" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Staff */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold">Faculty Staff</CardTitle>
            <Link href={`/faculty?dept=${deptSlug}`}>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-primary">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {deptFaculty.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No faculty found.</p>
              )}
              {deptFaculty.map((f, i) => (
                <div key={f.id as string} className={`flex items-center gap-3 py-2.5 ${i < deptFaculty.length - 1 ? "border-b border-border/40" : ""}`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name as string}</p>
                    <p className="text-[11px] text-muted-foreground">{f.designation as string}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${(f.isActive as boolean) ? "border-emerald-200 text-emerald-600 bg-emerald-50" : "border-red-200 text-red-600 bg-red-50"}`}>
                    {(f.isActive as boolean) ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {deptLogs.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent activity.</p>
              )}
              {deptLogs.slice(0, 6).map((log, i) => (
                <div key={log.id as string} className={`flex items-start gap-3 py-2.5 ${i < Math.min(deptLogs.length, 6) - 1 ? "border-b border-border/40" : ""}`}>
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/40" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{(log.admin as Record<string, unknown>)?.name as string ?? log.adminId as string}</span>{" "}
                      <span className="text-muted-foreground lowercase">{log.action as string}</span>{" "}
                      <span className="font-medium">{log.entityType as string}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatDateTime(log.createdAt as string)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6 border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <QuickAction href={`/departments/${deptSlug}`} icon={Building2} label="My Department" />
            <QuickAction href={`/faculty/new?dept=${deptSlug}`} icon={Plus} label="Add Faculty" />
            <QuickAction href={`/study-materials/new?dept=${deptSlug}`} icon={Plus} label="Upload Material" />
            <QuickAction href={`/lesson-plans/new?dept=${deptSlug}`} icon={Plus} label="Add Lesson Plan" />
            <QuickAction href={`/courses/new?dept=${deptSlug}`} icon={Plus} label="Add Subject" />
            <QuickAction href={`/syllabus/new?dept=${deptSlug}`} icon={Plus} label="Upload Syllabus" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function TPODashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    dashboardApi.stats().then((res) => {
      if (!cancelled && res.data) setStats(res.data);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const s = stats ?? {} as Record<string, unknown>;

  return (
    <>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Companies" value={loading ? "—" : (s.totalPlacements as number) ?? 0} icon={Briefcase} href="/placement" color="bg-blue-50 text-blue-600" />
        <StatCard label="Gallery Albums" value={loading ? "—" : (s.totalGalleryAlbums as number) ?? 0} icon={Image} href="/gallery" color="bg-violet-50 text-violet-600" />
        <StatCard label="News & Notices" value={loading ? "—" : (s.news as number) ?? 0} icon={Newspaper} href="/news" color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Submissions" value={loading ? "—" : (s.pendingSubmissions as number) ?? 0} icon={Inbox} href="/submissions" color="bg-amber-50 text-amber-600" />
      </div>
      <Card className="mt-6 border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <QuickAction href="/placement/companies/new" icon={Plus} label="Add Company" />
            <QuickAction href="/placement/records/new" icon={Plus} label="Add Placement Record" />
            <QuickAction href="/gallery/new" icon={Plus} label="Upload Media" />
            <QuickAction href="/news/new" icon={Plus} label="Create Post" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function MediaDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    dashboardApi.stats().then((res) => {
      if (!cancelled && res.data) setStats(res.data);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const s = stats ?? {} as Record<string, unknown>;

  return (
    <>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard label="Gallery Albums" value={loading ? "—" : (s.totalGalleryAlbums as number) ?? 0} icon={Image} href="/gallery" color="bg-violet-50 text-violet-600" />
        <StatCard label="Total Images" value={loading ? "—" : (s.totalGalleryImages as number) ?? 0} icon={Image} href="/gallery" color="bg-blue-50 text-blue-600" />
        <StatCard label="Hero Slides" value={loading ? "—" : (s.totalHeroSlides as number) ?? 0} icon={Newspaper} href="/hero-slides" color="bg-emerald-50 text-emerald-600" />
      </div>
      <Card className="mt-6 border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <QuickAction href="/gallery/new" icon={Plus} label="Create Album" />
            <QuickAction href="/hero-slides" icon={Image} label="Manage Slides" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function NewsDashboard() {
  const [published, setPublished] = useState(0);
  const [drafts, setDrafts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      newsApi.list({ status: "PUBLISHED", limit: 1 }),
      newsApi.list({ status: "DRAFT", limit: 1 }),
    ]).then(([pubRes, draftRes]) => {
      if (cancelled) return;
      setPublished(pubRes.meta?.total ?? pubRes.data?.length ?? 0);
      setDrafts(draftRes.meta?.total ?? draftRes.data?.length ?? 0);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard label="Published" value={loading ? "—" : published} icon={Newspaper} href="/news" color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Drafts" value={loading ? "—" : drafts} icon={Newspaper} href="/news" color="bg-amber-50 text-amber-600" />
      </div>
      <Card className="mt-6 border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <QuickAction href="/news/new" icon={Plus} label="Create Post" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const [allDepartments, setAllDepartments] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    let cancelled = false;
    departmentsApi.list({ limit: 100 }).then((res) => {
      if (!cancelled && res.data) setAllDepartments(res.data);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const getDeptLabel = () => {
    if (user?.role === "hod" && user.departmentSlug) {
      const dept = allDepartments.find((d) => d.slug === user.departmentSlug);
      return dept ? ` — ${dept.code as string} Department` : "";
    }
    return "";
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <Badge variant="outline" className="text-[10px] font-medium border-primary/20 text-primary bg-primary/5">
            {user?.role ? ROLE_LABELS[user.role] : "—"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Welcome back, <span className="font-medium text-foreground">{user?.name}</span>
          {getDeptLabel()}
        </p>
      </div>

      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "hod" && <HODDashboard />}
      {user?.role === "tpo" && <TPODashboard />}
      {user?.role === "media_manager" && <MediaDashboard />}
      {user?.role === "news_editor" && <NewsDashboard />}
    </div>
  );
}
