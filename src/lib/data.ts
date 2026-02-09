/**
 * Capa de datos por sección. Origen actual: JSON en src/data.
 * En producción: reemplazar por fetch a API del CMS manteniendo los mismos tipos.
 */

import type {
  WelcomeData,
  HomeHeroData,
  HomeCarouselLineasData,
  HomeBannerData,
  HomeProductosDestacadosData,
  HomeContactoData,
  HeaderData,
  FooterData,
  Locale,
} from "@/types/sections";

// Importaciones estáticas (mismo contrato que devolverá el CMS)
import welcomeEs from "@/data/es/welcome.json";
import headerEs from "@/data/es/header.json";
import headerEn from "@/data/en/header.json";
import footerEs from "@/data/es/footer.json";
import footerEn from "@/data/en/footer.json";
import welcomeEn from "@/data/en/welcome.json";
import heroEs from "@/data/es/home/hero.json";
import heroEn from "@/data/en/home/hero.json";
import carouselLineasEs from "@/data/es/home/carousel-lineas.json";
import carouselLineasEn from "@/data/en/home/carousel-lineas.json";
import banner1Es from "@/data/es/home/banner-1.json";
import banner1En from "@/data/en/home/banner-1.json";
import banner2Es from "@/data/es/home/banner-2.json";
import banner2En from "@/data/en/home/banner-2.json";
import productosDestacadosEs from "@/data/es/home/productos-destacados.json";
import productosDestacadosEn from "@/data/en/home/productos-destacados.json";
import contactoEs from "@/data/es/home/contacto.json";
import contactoEn from "@/data/en/home/contacto.json";

const defaultLocale: Locale = "es";

function normalizeLocale(locale: string | undefined): Locale {
  if (locale === "en") return "en";
  return defaultLocale;
}

export function getWelcomeData(locale?: string): WelcomeData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? welcomeEn : welcomeEs) as WelcomeData;
}

export function getHomeHeroData(locale?: string): HomeHeroData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? heroEn : heroEs) as HomeHeroData;
}

export function getHomeCarouselLineasData(
  locale?: string
): HomeCarouselLineasData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? carouselLineasEn : carouselLineasEs) as HomeCarouselLineasData;
}

export function getHomeBanner1Data(locale?: string): HomeBannerData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? banner1En : banner1Es) as HomeBannerData;
}

export function getHomeBanner2Data(locale?: string): HomeBannerData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? banner2En : banner2Es) as HomeBannerData;
}

export function getHomeProductosDestacadosData(
  locale?: string
): HomeProductosDestacadosData {
  const loc = normalizeLocale(locale);
  return (loc === "en"
    ? productosDestacadosEn
    : productosDestacadosEs) as HomeProductosDestacadosData;
}

export function getHomeContactoData(locale?: string): HomeContactoData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? contactoEn : contactoEs) as HomeContactoData;
}

export function getHeaderData(locale?: string): HeaderData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? headerEn : headerEs) as HeaderData;
}

export function getFooterData(locale?: string): FooterData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? footerEn : footerEs) as FooterData;
}
