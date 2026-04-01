"use client";

import { usePathname } from "next/navigation";
import { PromoCarousel } from "@/components/promo/PromoCarousel";
import {
  findPageScopedPromoCarousel,
  getGlobalUniqueSliderBanner,
} from "@/lib/cms-global-banner";
import { mapPromoCarouselFromCms } from "@/lib/data";
import { useCMSComponentsFromContext } from "@/portable-dynamic-cms";

/**
 * Rutas donde el carrusel lo resuelve la propia página (DynamicLayout o contacto).
 * Aquí no duplicamos el banner único.
 */
function pathDelegatesPromoToPage(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  if (p.includes("/bienvenida")) return true;
  const base = p.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
  if (base === "" || base === "/") return true;
  if (base.startsWith("/bodega")) return true;
  if (base.startsWith("/destileria")) return true;
  if (base.startsWith("/contacto")) return true;
  return false;
}

function cmsPageKeyForPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  let idx = 0;
  if (parts[0] === "en" || parts[0] === "es") idx = 1;
  const rest = parts.slice(idx);
  if (rest.length === 0) return "Inicio";
  const [first, second] = rest;
  if (first === "productos" && second) return "productos";
  if (first === "productos") return "productos";
  if (first === "politica-de-privacidad") return "politica-de-privacidad";
  if (first === "promo-demo") return "promo-demo";
  return first;
}

export function GlobalUniquePromoSlot() {
  const pathname = usePathname() ?? "/";
  const { components, loading } = useCMSComponentsFromContext();

  if (loading && !components) return null;
  if (pathDelegatesPromoToPage(pathname)) return null;
  if (!components?.length) return null;

  const pageKey = cmsPageKeyForPath(pathname);
  if (findPageScopedPromoCarousel(components, pageKey)) return null;

  const globalComp = getGlobalUniqueSliderBanner(components);
  if (!globalComp?.data) return null;

  const carouselData = mapPromoCarouselFromCms(
    globalComp.data as Record<string, unknown>
  );
  if (!carouselData.slides?.length) return null;

  return (
    <PromoCarousel
      data={carouselData}
      minHeight="50vh"
      prioritizeFirstSlide={false}
    />
  );
}
