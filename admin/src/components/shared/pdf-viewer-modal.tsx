/**
 * @file pdf-viewer-modal.tsx
 * @description PDF viewer modal — iframe-based viewer with fullscreen, download, and error state
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { X, Download, ExternalLink, Maximize2, Minimize2, FileX2, Loader2 } from "lucide-react";

interface PdfViewerModalProps {
  url: string;
  title: string;
  trigger: ReactNode;
}

export function PdfViewerModal({ url, title, trigger }: PdfViewerModalProps) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (cancelled) return;
        setStatus(res.ok ? "ready" : "error");
      })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [open, url]);

  return (
    <>
      <div onClick={() => { setStatus("loading"); setOpen(true); }} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setOpen(false); setFullscreen(false); }}
          />

          <div
            className={`relative bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              fullscreen ? "w-screen h-screen rounded-none" : "w-[95vw] max-w-5xl h-[85vh]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50 shrink-0">
              <h3 className="font-medium text-foreground text-sm truncate pr-4">{title}</h3>
              <div className="flex items-center gap-1">
                {status === "ready" && (
                  <>
                    <a
                      href={url}
                      download
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setFullscreen(!fullscreen)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                      {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>
                  </>
                )}
                <button
                  onClick={() => { setOpen(false); setFullscreen(false); }}
                  className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors ml-1"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-muted/30 relative">
              {status === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                  <p className="text-sm text-muted-foreground">Loading document...</p>
                </div>
              )}
              {status === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileX2 className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h4 className="text-base font-semibold text-foreground mb-1">Document Unavailable</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    The file could not be loaded. It may not exist or the URL is inaccessible.
                  </p>
                  <button
                    onClick={() => { setOpen(false); setFullscreen(false); }}
                    className="px-4 py-2 text-xs font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Close
                  </button>
                </div>
              )}
              {status === "ready" && (
                <iframe src={url} className="w-full h-full border-0" title={title} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
