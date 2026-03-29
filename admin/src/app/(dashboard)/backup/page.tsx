/**
 * @file page.tsx
 * @description Database backup page — informational cards for PostgreSQL backup, scheduling, and storage guidance
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { DatabaseBackup, Clock, HardDrive } from "lucide-react";

export default function BackupPage() {
  return (
    <div>
      <PageHeader title="Database Backup" description="Create and manage database backups" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <DatabaseBackup className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">Database Backup</p>
                <p className="text-xs text-muted-foreground">Full PostgreSQL export</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Use <code className="text-xs bg-muted px-1 py-0.5 rounded">pg_dump</code> via the server CLI to create manual backups.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <HardDrive className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">MinIO Storage</p>
                <p className="text-xs text-muted-foreground">File storage backup</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              MinIO data is persisted via Docker volumes. Use <code className="text-xs bg-muted px-1 py-0.5 rounded">mc mirror</code> for offsite copies.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">Automated Backups</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Scheduled automated backups will be available in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
