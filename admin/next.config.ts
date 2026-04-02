import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";
const IS_PROD = process.env.NODE_ENV === "production";
const BACKEND_ORIGIN = (() => {
  try {
    return new URL(BACKEND_URL).origin;
  } catch {
    return "http://localhost:4000";
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // MinIO local dev
      { protocol: "http", hostname: "localhost", port: "9000" },
      // Production MinIO host
      { protocol: "https", hostname: "gpn-storage.repoassistant.com" },
    ],
  },
  async rewrites() {
    return [
      {
        // Proxy /api/* to the backend so the admin panel works across LAN
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  async headers() {
    const connectSrc = [
      "'self'",
      "https:",
      BACKEND_ORIGIN,
      ...(IS_PROD ? [] : ["http://localhost:4000", "http://127.0.0.1:4000"]),
    ].join(" ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src ${connectSrc}; frame-src 'self'; object-src 'none'; base-uri 'self'` },
        ],
      },
    ];
  },
};

export default nextConfig;
