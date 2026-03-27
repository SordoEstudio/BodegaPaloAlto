import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bodegapaloalto.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/bienvenida/", "/es/bienvenida", "/en/bienvenida", "/es/promo-demo", "/en/promo-demo"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
