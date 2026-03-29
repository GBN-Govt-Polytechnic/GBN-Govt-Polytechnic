/**
 * @file file-upload.tsx
 * @description File upload dropzone — drag-and-drop area with file type validation, size limit, and preview
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  accept = "image/*,.pdf,.doc,.docx",
  multiple = false,
  maxSize = 10,
  onFilesSelected,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      // Parse the accept prop into an allowlist for file type checking
      const allowedPatterns = accept.split(",").map((s) => s.trim());
      const isAllowed = (f: File) =>
        allowedPatterns.some((pattern) => {
          if (pattern.startsWith("."))
            return f.name.toLowerCase().endsWith(pattern);
          if (pattern.endsWith("/*"))
            return f.type.startsWith(pattern.slice(0, -1));
          return f.type === pattern;
        });

      const arr = Array.from(newFiles).filter(
        (f) => f.size <= maxSize * 1024 * 1024 && isAllowed(f),
      );
      setFiles((prev) => (multiple ? [...prev, ...arr] : arr.slice(0, 1)));
      onFilesSelected?.(arr);
    },
    [accept, maxSize, multiple, onFilesSelected],
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          dragOver
            ? "border-[#5cb874] bg-[#f0f7f1]"
            : "border-[#b8d4be] hover:border-[#5cb874]"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = accept;
          input.multiple = multiple;
          input.onchange = (e) =>
            handleFiles((e.target as HTMLInputElement).files);
          input.click();
        }}
      >
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drop files here or click to upload
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Max {maxSize}MB per file
        </p>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-md border p-2"
            >
              {file.type.startsWith("image/") ? (
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <FileText className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="flex-1 truncate text-sm">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(1)}MB
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
