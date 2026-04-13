/**
 * @file pdf-viewer-modal.tsx
 * @description PDF viewer modal — fullscreen-capable iframe-based PDF viewer with loading state, error handling, and download link
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState } from "react";
import { X, Download, ExternalLink, Maximize2, Minimize2, FileX2, Loader2 } from "lucide-react";
import { toSafeUrl } from "@/lib/safe-url";

interface PdfViewerModalProps {
  url: string;
  title: string;
  trigger: React.ReactNode;
}

export function PdfViewerModal({ url, title, trigger }: PdfViewerModalProps) {
  const safeUrl = toSafeUrl(url);
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  return (
    <>
      <div onClick={() => { setStatus(safeUrl ? "ready" : "error"); setOpen(true); }} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setOpen(false); setFullscreen(false); }}
          />

          <div
            className={`relative bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${fullscreen
              ? "w-screen h-screen rounded-none"
              : "w-[98vw] sm:w-[95vw] max-w-5xl h-[90vh] sm:h-[85vh] rounded-xl sm:rounded-2xl"
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/80">
              <h3 className="font-semibold text-gray-900 text-xs truncate pr-4">
                {title}
              </h3>
              <div className="flex items-center gap-1">
                {status === "ready" && safeUrl && (
                  <>
                    <a href={safeUrl} download className="p-1.5 rounded-lg hover:bg-gray-200/80 text-gray-500 hover:text-gray-700 transition-colors" title="Download">
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-gray-200/80 text-gray-500 hover:text-gray-700 transition-colors" title="Open in new tab">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => setFullscreen(!fullscreen)} className="p-1.5 rounded-lg hover:bg-gray-200/80 text-gray-500 hover:text-gray-700 transition-colors" title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
                      {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>
                  </>
                )}
                <button
                  onClick={() => { setOpen(false); setFullscreen(false); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors ml-1"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-gray-100 relative">
              {status === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                  <p className="text-sm text-gray-500">Checking document...</p>
                </div>
              )}
              {status === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <FileX2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-700 mb-1.5">
                    Document Not Available
                  </h4>
                  <p className="text-sm text-gray-500 max-w-md mb-5">
                    This document has not been uploaded yet. It will be available once the administration uploads it.
                  </p>
                  <button
                    onClick={() => { setOpen(false); setFullscreen(false); }}
                    className="px-4 py-2 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
              {status === "ready" && safeUrl && (
                <iframe src={safeUrl} className="w-full h-full border-0" title={title} />
              )}
            </div>
          </div>
        </div>
      )
      }
    </>
  );
}
