/**
 * @file page.tsx
 * @description Documents page — official institutional PDFs grouped by category with download buttons
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { publicDocuments } from "@/lib/api";
import { DocumentsView } from "./documents-view";

export const metadata: Metadata = {
  title: "Documents & Approvals",
  description:
    "Download official documents including AICTE approvals, mandatory disclosures, fee structure, RTI, and more from GBN Govt. Polytechnic Nilokheri.",
};

export const revalidate = 300;

export default async function DocumentsPage() {
  let docs: Record<string, unknown>[] = [];

  try {
    const res = await publicDocuments.list();
    docs = res.data ?? [];
  } catch {
    docs = [];
  }

  return (
    <>
      <PageHeader
        title="Documents & Approvals"
        subtitle="Official documents, approvals, and institutional disclosures"
        breadcrumbs={[{ label: "Documents & Approvals" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <DocumentsView
            documents={docs as unknown as Parameters<typeof DocumentsView>[0]["documents"]}
          />
        </div>
      </section>
    </>
  );
}
