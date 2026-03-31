/**
 * @file next.config.ts
 * @description Next.js configuration — image remote patterns, API proxy rewrites, and security headers
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    // Allow next/image to fetch from localhost/private IPs (MinIO in dev)
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      // MinIO local dev
      { protocol: "http", hostname: "localhost", port: "9000" },
      // MinIO LAN dev (restrict to local network only)
      ...(process.env.NODE_ENV === "development"
        ? [{ protocol: "http" as const, hostname: "192.168.*.*", port: "9000" }]
        : []),
      // MinIO production — restrict to your specific R2 bucket when deployed
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      // Production file CDN (set STORAGE_PUBLIC_URL in backend .env)
      { protocol: "https", hostname: "files.gpnilokheri.ac.in" },
      // Production MinIO storage host used by this deployment
      { protocol: "https", hostname: "gpn-storage.repoassistant.com" },
    ],
  },
  async rewrites() {
    return [
      {
        // Proxy /api/* to the backend so client-side fetches work across LAN
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https:; object-src 'none'; base-uri 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
