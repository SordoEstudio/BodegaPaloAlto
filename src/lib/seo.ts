import type { Locale } from "@/lib/i18n";

const FALLBACK_SITE_URL = "https://bodegapaloalto.com";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_SITE_URL;
  return raw.replace(/\/$/, "");
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function getLocalizedAlternates(path: string) {
  const site = getSiteUrl();
  return {
    canonical: `${site}${getLocalizedPath(path, "es")}`,
    languages: {
      es: `${site}${getLocalizedPath(path, "es")}`,
      en: `${site}${getLocalizedPath(path, "en")}`,
      "x-default": `${site}/es`,
    },
  };
}

export function getDefaultOgImage(): string {
  return `${getSiteUrl()}/logos/tipo-b.png`;
}
