import type { CMSComponent } from "@/portable-dynamic-cms/types/cms-components";
import { cmsTypeToLayoutName } from "@/lib/cms-type-map";

const PROMO_LAYOUT = "promo-carousel";

function layoutNameForCmsType(type: string): string | undefined {
  const t = (type ?? "").trim();
  return cmsTypeToLayoutName[t] ?? cmsTypeToLayoutName[t.toLowerCase()];
}

export function componentMapsToPromoCarousel(c: CMSComponent): boolean {
  return layoutNameForCmsType(c.type) === PROMO_LAYOUT;
}

/** Página reservada en CMS para el slider que se replica en todo el sitio (variantes de título). */
export function isGlobalUniqueBannerPage(page: string): boolean {
  const n = (page ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  if (!n) return false;
  if (n === "baner unico" || n === "banner unico") return true;
  if ((n.includes("baner") || n.includes("banner")) && n.includes("unico")) return true;
  return false;
}

/** Slider global: tipo slider_banner y page marcada como banner único. */
export function isGlobalUniqueSliderBanner(c: CMSComponent): boolean {
  if ((c.type ?? "").trim().toLowerCase() !== "slider_banner") return false;
  return isGlobalUniqueBannerPage(c.page);
}

function pagesMatchForCms(a: string, b: string): boolean {
  return (
    (a ?? "").toString().trim().toLowerCase() === (b ?? "").toString().trim().toLowerCase()
  );
}

export function getGlobalUniqueSliderBanner(
  components: CMSComponent[] | null
): CMSComponent | null {
  if (!components?.length) return null;
  return (
    components.find(
      (c) => c.isVisible !== false && isGlobalUniqueSliderBanner(c)
    ) ?? null
  );
}

/** Carrusel promocional asignado a una página concreta (no el banner único). */
export function findPageScopedPromoCarousel(
  components: CMSComponent[] | null,
  pageKey: string
): CMSComponent | null {
  if (!components?.length) return null;
  const candidates = components.filter(
    (c) =>
      c.isVisible !== false &&
      componentMapsToPromoCarousel(c) &&
      !isGlobalUniqueSliderBanner(c) &&
      pagesMatchForCms(c.page, pageKey)
  );
  if (!candidates.length) return null;
  const sorted = [...candidates].sort((a, b) => {
    const da = a.data as Record<string, unknown>;
    const db = b.data as Record<string, unknown>;
    const oa = da?._orden ?? da?.order ?? 999;
    const ob = db?._orden ?? db?.order ?? 999;
    return (oa as number) - (ob as number);
  });
  return sorted[0] ?? null;
}

export function pageHasScopedPromoCarousel(
  components: CMSComponent[] | null,
  pageKey: string
): boolean {
  return findPageScopedPromoCarousel(components, pageKey) != null;
}
