/**
 * @file page.tsx
 * @description Two-factor authentication page — deprecated, redirects to login
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 2FA page is no longer used — redirect to login
export default function TwoFactorPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
