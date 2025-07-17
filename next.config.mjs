import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // Add security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    authInterrupts: true,
    // ppr: "incremental",
    // Forward browser logs to the terminal for easier debugging
    browserDebugInfoInTerminal: true,

    // Enable new caching and pre-rendering behavior
    // dynamicIO: true, // will be renamed to cacheComponents in Next.js 16

    // Activate new client-side router improvements
    clientSegmentCache: true,

    // Explore route composition and segment overrides via DevTools
    devtoolSegmentExplorer: true,

    // Enable persistent caching for the turbopack dev server and build.
    turbopackPersistentCaching: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

// Define security headers
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

export default nextConfig;
