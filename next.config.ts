import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yi4v6kde7clqp3do.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Cache para assets estáticos
      {
        source: "/fonts/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Cache para las API públicas en el CDN de Vercel
      {
        source: "/api/public/v1/products(.*)",
        headers: [{ key: "Cache-Control", value: "s-maxage=60, stale-while-revalidate=120" }],
      },
      {
        source: "/api/public/v1/cms-components(.*)",
        headers: [{ key: "Cache-Control", value: "s-maxage=120, stale-while-revalidate=300" }],
      },
    ];
  },
};

export default nextConfig;
