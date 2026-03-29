/**
 * @file status-badge.tsx
 * @description Status badge component — color-coded pill for published, draft, archived, active, and inactive states
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { cn } from "@/lib/utils";

// Supports both legacy lowercase values and current UPPERCASE Prisma enum values
type StatusVariant =
  | "PUBLISHED" | "published"
  | "DRAFT" | "draft"
  | "ARCHIVED" | "archived"
  | "active" | "inactive"
  | "NEW" | "new"
  | "READ" | "read"
  | "RESPONDED" | "responded";

const variantStyles: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  published: "bg-green-100 text-green-800",
  active: "bg-green-100 text-green-800",
  RESPONDED: "bg-green-100 text-green-800",
  responded: "bg-green-100 text-green-800",
  DRAFT: "bg-yellow-100 text-yellow-800",
  draft: "bg-yellow-100 text-yellow-800",
  READ: "bg-blue-100 text-blue-800",
  read: "bg-blue-100 text-blue-800",
  NEW: "bg-blue-100 text-blue-800",
  new: "bg-blue-100 text-blue-800",
  ARCHIVED: "bg-[#e8f5eb] text-[#5f6b64]",
  archived: "bg-[#e8f5eb] text-[#5f6b64]",
  inactive: "bg-red-100 text-red-800",
};

// Human-readable labels for UPPERCASE enum values
const labels: Record<string, string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
  NEW: "New",
  READ: "Read",
  RESPONDED: "Responded",
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const displayLabel = labels[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        variantStyles[status] ?? "bg-[#e8f5eb] text-[#5f6b64]",
        className
      )}
    >
      {displayLabel}
    </span>
  );
}
