/**
 * @file page.tsx
 * @description Company editor — update or delete a recruiting company's details
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { placements, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Save, Trash2, Loader2 } from "lucide-react";

export default function EditCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [companyData, setCompanyData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // placements.listCompanies returns all companies; filter by id
        const res = await placements.listCompanies();
        const company = (res.data ?? []).find(
          (c: Record<string, unknown>) => c.id === id,
        );
        if (!company) throw new ApiError(404, "Company not found");
        setCompanyData(company);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to load company");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Company not found
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      industry: (fd.get("industry") as string) || undefined,
      website: (fd.get("website") as string) || undefined,
    };

    try {
      await placements.updateCompany(id, data);
      toast.success("Company updated");
      router.push("/placement");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update company");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await placements.deleteCompany(id);
      toast.success("Company deleted");
      router.push("/placement");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete company");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={`Edit: ${companyData.name as string}`}
        description="Update company details"
      />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={companyData.name as string}
                placeholder="e.g. Infosys"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                defaultValue={(companyData.industry as string) ?? ""}
                placeholder="e.g. IT Services"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={(companyData.website as string) ?? ""}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/placement")}>
                Cancel
              </Button>
              <ConfirmDialog
                onConfirm={handleDelete}
                title="Delete Company"
                description="This will permanently delete this company and all associated data. This action cannot be undone."
                confirmLabel="Delete"
              >
                <Button type="button" variant="destructive" className="ml-auto" disabled={deleting}>
                  {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </ConfirmDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
