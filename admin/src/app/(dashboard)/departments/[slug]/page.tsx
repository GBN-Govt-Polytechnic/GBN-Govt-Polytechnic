/**
 * @file page.tsx
 * @description Department detail — overview of faculty, labs, courses, study materials, lesson plans, syllabus, timetables, and recent activity
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  departments as departmentsApi,
  faculty as facultyApi,
  labs as labsApi,
  studyMaterials as studyMaterialsApi,
  lessonPlans as lessonPlansApi,
  courses as coursesApi,
  syllabus as syllabusApi,
  timetables as timetablesApi,
  auditLogs as auditLogsApi,
  ApiError,
} from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  Users, FlaskConical, BookOpen, FileText, GraduationCap,
  Calendar, ArrowLeft, ScrollText,
  Clock, Plus, MapPin, Loader2, Pencil,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [dept, setDept] = useState<Record<string, unknown> | null>(null);
  const [facultyList, setFacultyList] = useState<Record<string, unknown>[]>([]);
  const [labsList, setLabsList] = useState<Record<string, unknown>[]>([]);
  const [materials, setMaterials] = useState<Record<string, unknown>[]>([]);
  const [lessonPlansList, setLessonPlansList] = useState<Record<string, unknown>[]>([]);
  const [coursesList, setCoursesList] = useState<Record<string, unknown>[]>([]);
  const [syllabusList, setSyllabusList] = useState<Record<string, unknown>[]>([]);
  const [deptLogs, setDeptLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [editHod, setEditHod] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const deptRes = await departmentsApi.get(slug);
        const deptData = deptRes.data;
        setDept(deptData);

        const departmentId = deptData.id as string;

        const [fRes, lRes, mRes, lpRes, cRes, sRes, , logRes] = await Promise.all([
          facultyApi.list({ departmentId }).catch(() => ({ data: [] })),
          labsApi.list({ departmentId }).catch(() => ({ data: [] })),
          studyMaterialsApi.list({ departmentId }).catch(() => ({ data: [] })),
          lessonPlansApi.list({ departmentId }).catch(() => ({ data: [] })),
          coursesApi.list({ departmentId }).catch(() => ({ data: [] })),
          syllabusApi.list({ departmentId }).catch(() => ({ data: [] })),
          timetablesApi.list({ departmentId }).catch(() => ({ data: [] })),
          user?.role === "super_admin" ? auditLogsApi.list({ limit: 10 }).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);

        setFacultyList(fRes.data);
        setLabsList(lRes.data);
        setMaterials(mRes.data);
        setLessonPlansList(lpRes.data);
        setCoursesList(cRes.data);
        setSyllabusList(sRes.data);
        setDeptLogs(logRes.data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          toast.error(err instanceof ApiError ? err.message : "Failed to load department");
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !dept) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
        <p>Department not found</p>
        <Button variant="outline" size="sm" onClick={() => router.push("/departments")}>
          <ArrowLeft className="mr-1 h-3 w-3" /> Back to Departments
        </Button>
      </div>
    );
  }

  function handleEditAbout() {
    setEditDesc((dept!.description as string) ?? "");
    setEditHod((dept!.hodName as string) ?? "");
    setEditing(true);
  }

  async function handleSaveAbout() {
    setSaving(true);
    try {
      await departmentsApi.update(dept!.id as string, {
        description: editDesc,
        hodName: editHod,
      });
      setDept({ ...dept!, description: editDesc, hodName: editHod });
      setEditing(false);
      toast.success("Department updated successfully");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update department");
    } finally {
      setSaving(false);
    }
  }

  const stats = [
    { label: "Faculty", count: facultyList.length, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", href: `/faculty?dept=${slug}` },
    { label: "Labs", count: labsList.length, icon: FlaskConical, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", href: `/labs?dept=${slug}` },
    { label: "Materials", count: materials.length, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", href: `/study-materials?dept=${slug}` },
    { label: "Lesson Plans", count: lessonPlansList.length, icon: FileText, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", href: `/lesson-plans?dept=${slug}` },
    { label: "Subjects", count: coursesList.length, icon: GraduationCap, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", href: `/courses?dept=${slug}` },
    { label: "Syllabus", count: syllabusList.length, icon: Calendar, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", href: `/syllabus?dept=${slug}` },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-xl bg-linear-to-r from-primary to-college-green-dark p-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => router.push("/departments")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">{dept.name as string}</h1>
              <Badge className="bg-white/20 text-white border-0 text-[10px] font-bold">
                {dept.code as string}
              </Badge>
            </div>
            <div className="flex items-center gap-4 ml-9 text-sm text-white/80">
              {dept.hodName ? (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> HOD: {dept.hodName as string}
                </span>
              ) : null}
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> GBN Polytechnic, Nilokheri
              </span>
            </div>
          </div>
          <Link href={`/faculty/new?dept=${slug}`}>
            <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Faculty
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className={`border ${stat.border} hover:shadow-md transition-all cursor-pointer group h-full`}>
              <CardContent className="p-3 text-center">
                <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                </div>
                <p className="text-xl font-bold text-foreground">{stat.count}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* About + Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold">About Department</CardTitle>
                {!editing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={handleEditAbout}
                    title="Edit About"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Updated: {formatDate(dept.updatedAt as string)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Created: {formatDate(dept.createdAt as string)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-desc" className="text-xs font-medium">Description</Label>
                  <Textarea
                    id="edit-desc"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={4}
                    placeholder="Enter department description..."
                    className="text-sm resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-hod" className="text-xs font-medium">HOD Name</Label>
                  <Input
                    id="edit-hod"
                    value={editHod}
                    onChange={(e) => setEditHod(e.target.value)}
                    placeholder="Enter Head of Department name..."
                    className="text-sm h-8"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    className="h-7 text-xs px-3"
                    onClick={handleSaveAbout}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : null}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-3"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {(dept.description as string) || "No description available for this department."}
                </p>
                {dept.hodName ? (
                  <div className="mt-4 flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {(dept.hodName as string).split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{dept.hodName as string}</p>
                      <p className="text-xs text-muted-foreground">Head of Department</p>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-primary" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deptLogs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No activity yet.</p>
            ) : (
              <div className="space-y-3">
                {deptLogs.slice(0, 6).map((log) => (
                  <div key={log.id as string} className="flex items-start gap-2 text-xs">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="leading-snug">
                        <span className="font-medium">{(log.admin as Record<string, unknown>)?.name as string ?? log.adminId as string}</span>{" "}
                        <span className="text-muted-foreground lowercase">{log.action as string}</span>{" "}
                        <span className="font-medium truncate">{log.entityType as string}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDateTime(log.createdAt as string)}
                      </p>
                    </div>
                  </div>
                ))}
                {deptLogs.length > 6 && (
                  <Link href="/logs">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-primary hover:text-primary">
                      View all logs →
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
            <Link href={`/faculty/new?dept=${slug}`}>
              <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs">
                <Users className="h-3.5 w-3.5 text-emerald-600" /> Add Faculty
              </Button>
            </Link>
            <Link href={`/labs/new?dept=${slug}`}>
              <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs">
                <FlaskConical className="h-3.5 w-3.5 text-teal-600" /> Add Lab
              </Button>
            </Link>
            <Link href={`/study-materials/new?dept=${slug}`}>
              <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Upload Material
              </Button>
            </Link>
            <Link href={`/courses/new?dept=${slug}`}>
              <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs">
                <GraduationCap className="h-3.5 w-3.5 text-amber-600" /> Add Subject
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
