/**
 * @file documents-view.tsx
 * @description Documents page client component — category tabs with PDF card grid and download buttons
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState } from "react";
import { FileText, Download, FolderOpen } from "lucide-react";

type Category =
  | "ALL"
  | "APPROVAL"
  | "MANDATORY_DISCLOSURE"
  | "FEE_STRUCTURE"
  | "RTI"
  | "ANNUAL_REPORT"
  | "COMMITTEE"
  | "GOVT_ORDER"
  | "OTHER";

const CATEGORY_LABELS: Record<Exclude<Category, "ALL">, string> = {
  APPROVAL: "Approvals",
  MANDATORY_DISCLOSURE: "Mandatory Disclosure",
  FEE_STRUCTURE: "Fee Structure",
  RTI: "RTI",
  ANNUAL_REPORT: "Annual Reports",
  COMMITTEE: "Committees",
  GOVT_ORDER: "Govt. Orders",
  OTHER: "Other",
};

const CATEGORY_COLORS: Record<Exclude<Category, "ALL">, string> = {
  APPROVAL: "bg-green-50 text-green-700 border-green-200",
  MANDATORY_DISCLOSURE: "bg-blue-50 text-blue-700 border-blue-200",
  FEE_STRUCTURE: "bg-amber-50 text-amber-700 border-amber-200",
  RTI: "bg-purple-50 text-purple-700 border-purple-200",
  ANNUAL_REPORT: "bg-teal-50 text-teal-700 border-teal-200",
  COMMITTEE: "bg-indigo-50 text-indigo-700 border-indigo-200",
  GOVT_ORDER: "bg-rose-50 text-rose-700 border-rose-200",
  OTHER: "bg-gray-50 text-gray-700 border-gray-200",
};

interface Document {
  id: string;
  title: string;
  category: Exclude<Category, "ALL">;
  year: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  documents: Document[];
}

export function DocumentsView({ documents }: Props) {
  const [activeTab, setActiveTab] = useState<Category>("ALL");

  const availableCategories = Array.from(
    new Set(documents.map((d) => d.category))
  ).sort();

  const filtered =
    activeTab === "ALL"
      ? documents
      : documents.filter((d) => d.category === activeTab);

  const tabs: Category[] = ["ALL", ...availableCategories];

  if (documents.length === 0) {
    return (
      <div className="text-center py-20">
        <FolderOpen className="h-14 w-14 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
        <p className="text-gray-500 text-lg font-medium">No documents published yet.</p>
        <p className="text-gray-400 text-sm mt-1">Check back soon.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              activeTab === tab
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
            }`}
          >
            {tab === "ALL" ? "All Documents" : CATEGORY_LABELS[tab]}
            {tab !== "ALL" && (
              <span className={`ml-1.5 text-xs ${activeTab === tab ? "opacity-75" : "text-gray-400"}`}>
                ({documents.filter((d) => d.category === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-6">
        {filtered.length} {filtered.length === 1 ? "document" : "documents"}
        {activeTab !== "ALL" && ` in ${CATEGORY_LABELS[activeTab]}`}
      </p>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
          <p className="font-medium">No documents in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md hover:border-emerald-200 transition-all duration-200"
            >
              {/* Top: icon + meta */}
              <div className="flex items-start gap-3">
                <div className="bg-red-50 rounded-lg p-2.5 flex-shrink-0 mt-0.5">
                  <FileText className="h-5 w-5 text-red-500" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-1.5 ${CATEGORY_COLORS[doc.category]}`}>
                    {CATEGORY_LABELS[doc.category]}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-3">
                    {doc.title}
                  </h3>
                </div>
              </div>

              {/* Bottom: year + size + download */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                <span className="text-xs text-gray-400">
                  {doc.year} · {formatFileSize(doc.fileSize)}
                </span>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
