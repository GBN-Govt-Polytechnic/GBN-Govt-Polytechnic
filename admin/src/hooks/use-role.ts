/**
 * @file use-role.ts
 * @description Role utility hook — exposes canAccess helper and department-scoped context for the current user
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useAuth } from "./use-auth";
import { hasAccess, type Section } from "@/config/roles";

export function useRole() {
  const { user } = useAuth();

  const canAccess = (section: Section): boolean => {
    if (!user) return false;
    return hasAccess(user.role, section);
  };

  const isDepartmentScoped = user?.role === "hod";
  const departmentSlug = user?.departmentSlug;

  return {
    role: user?.role ?? null,
    canAccess,
    isDepartmentScoped,
    departmentSlug,
  };
}
