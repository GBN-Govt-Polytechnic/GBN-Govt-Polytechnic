/**
 * @file page-header.tsx
 * @description Page header component — clean title, description, and optional action button for dashboard pages
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import { Button } from "@/components/ui/button";
import { Plus, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  children?: React.ReactNode;
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  const ActionIcon = action?.icon ?? Plus;

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {action &&
          (action.href ? (
            <Link href={action.href}>
              <Button size="sm" className="h-9 gap-2">
                <ActionIcon className="h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button size="sm" className="h-9 gap-2" onClick={action.onClick}>
              <ActionIcon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
      </div>
    </div>
  );
}
