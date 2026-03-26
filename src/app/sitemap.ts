import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bodegapaloalto.com";
const locales = ["es", "en"] as const;

// Rutas estáticas del sitio (excluye bienvenida y promo-demo)
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
    const alternates: Record<string, string> = {};
    for (const locale of locales) {
      alternates[locale] = `${siteUrl}/${locale}${route.path}`;
    }

    // Entrada canónica en español
    entries.push({
      url: `${siteUrl}/es${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: alternates },
    });
  }

  return entries;
}
