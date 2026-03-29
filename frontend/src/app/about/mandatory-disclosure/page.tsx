/**
 * @file page.tsx
 * @description Mandatory Disclosure page — AICTE-mandated disclosure document with PDF viewer and download option
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { PdfViewerModal } from "@/components/ui/pdf-viewer-modal";
import { Download, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Mandatory Disclosure",
  description:
    "Mandatory Disclosure as per AICTE norms for GBN Govt. Polytechnic Nilokheri.",
};

export default function MandatoryDisclosurePage() {
  const pdfUrl = "/documents/Mandatory_Disclosure.pdf";

  return (
    <>
      <PageHeader
        title="Mandatory Disclosure"
        subtitle="As per AICTE Norms"
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Mandatory Disclosure" },
        ]}
      />

      <section className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="max-w-2xl w-full text-center">
          <CardContent className="flex flex-col items-center gap-6 py-10">
            <div className="w-20 h-20 relative">
              <Image
                src="/images/aicte-logo.png"
                alt="AICTE Logo"
                fill
                className="object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold">
              Mandatory Disclosure as per AICTE Norms
            </h2>

            <p className="text-muted-foreground max-w-lg leading-relaxed">
              As per AICTE guidelines, all technical institutions are required to
              publish mandatory disclosure information. The document contains
              details about the institute, courses, faculty, infrastructure, and
              other essential information.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <PdfViewerModal
                url={pdfUrl}
                title="Mandatory Disclosure — GBN Govt. Polytechnic Nilokheri"
                trigger={
                  <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700 transition-colors">
                    <Eye className="h-5 w-5" />
                    View Document
                  </span>
                }
              />
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
