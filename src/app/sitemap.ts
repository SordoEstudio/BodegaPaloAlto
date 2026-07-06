import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bodegapaloalto.com").replace(/\/$/, "");
const locales = ["es", "en"] as const;

const staticRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/bodega", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/destileria", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/productos", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/contacto", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/politica-de-privacidad", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${siteUrl}/${locale}${route.path}`;
    }
    languages["x-default"] = `${siteUrl}/es${route.path}`;

    // Entry for each locale as primary URL (required by hreflang spec)
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: locale === "es" ? route.priority : route.priority * 0.9,
        alternates: { languages },
      });
    }
  }

  return entries;
}
