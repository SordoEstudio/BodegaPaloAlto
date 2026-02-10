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

/** Mapea banner en formato CMS (img_fondo, txt_titulo, link_destino, _configuracion) a HomeBannerData */
function mapBannerFromCms(raw: Record<string, unknown>): HomeBannerData {
  const link = raw.link_destino as { url?: string; label?: string } | undefined;
  const config = raw._configuracion as { parallax?: boolean } | undefined;
  return {
    imageSrc: (raw.img_fondo as string) ?? "",
    imageAlt: (raw.txt_alt_optional as string) ?? "",
    title: raw.txt_titulo as string | undefined,
    href: typeof link === "object" && link?.url ? link.url : (raw.link_url as string | undefined),
    config: config ? { parallax: config.parallax } : undefined,
  };
}

/** Mapea welcome en formato CMS (txt_*, btn_confirmar, link_decline, _configuracion) a WelcomeData */
function mapWelcomeFromCms(raw: Record<string, unknown>): WelcomeData {
  const btn = raw.btn_confirmar as { txt_label?: string } | undefined;
  const link = raw.link_decline as { url?: string; label?: string } | undefined;
  const config = raw._configuracion as { confirmAriaLabel?: string; declineAriaLabel?: string } | undefined;
  return {
    hero: {
      imageSrc: (raw.img_hero_optional as string) || undefined,
      imageAlt: (raw.txt_alt_hero_optional as string) ?? "",
    },
    title: (raw.txt_titulo as string) ?? "",
    message: (raw.txt_mensaje as string) ?? "",
    legalNotice: (raw.txt_aviso_legal as string) ?? "",
    buttons: {
      confirm: (btn?.txt_label as string) ?? "",
      confirmAriaLabel: config?.confirmAriaLabel ?? "",
      decline: (link?.label as string) ?? "",
      declineAriaLabel: config?.declineAriaLabel ?? "",
      declineUrl: (link?.url as string) ?? "",
    },
  };
}

export function getWelcomeData(locale?: string): WelcomeData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? welcomeEn : welcomeEs) as Record<string, unknown>;
  return raw.title != null && typeof raw.hero === "object" ? (raw as unknown as WelcomeData) : mapWelcomeFromCms(raw);
}

/** Mapea header en formato CMS (txt_logo, lista_nav, btn_shop, _configuracion) a HeaderData */
function mapHeaderFromCms(raw: Record<string, unknown>): HeaderData {
  const linkLogo = raw.link_logo as { url?: string; label?: string } | undefined;
  const listaNav = (raw.lista_nav as Record<string, unknown>[]) ?? [];
  const btnShop = raw.btn_shop as { txt_label?: string; link_url?: string; link_tipo?: string } | undefined;
  const config = raw._configuracion as { lista_idiomas?: { code: string; label: string }[] } | undefined;
  return {
    logo: {
      text: (raw.txt_logo as string) ?? "Palo Alto",
      imageSrc: (raw.img_logo_optional as string) || undefined,
      imageAlt: (raw.txt_alt_logo_optional as string) ?? "",
      href: linkLogo?.url ?? "/",
    },
    nav: listaNav.map((item) => {
      const rawHijos = item.lista_hijos_optional;
      const hijos = Array.isArray(rawHijos) ? (rawHijos as { txt_label?: string; link_url?: string }[]) : undefined;
      return {
        label: (item.txt_label as string) ?? "",
        href: (item.link_url as string) ?? "",
        ...(hijos?.length && {
          children: hijos.map((h) => ({ label: h.txt_label ?? "", href: h.link_url ?? "" })),
        }),
      };
    }),
    shop: {
      label: btnShop?.txt_label ?? "Shop",
      href: btnShop?.link_url ?? "",
      external: btnShop?.link_tipo === "external",
    },
    languages: (config?.lista_idiomas ?? [{ code: "es", label: "ES" }, { code: "en", label: "EN" }]) as { code: Locale; label: string }[],
  };
}

function mapHeroFromCms(raw: Record<string, unknown>): HomeHeroData {
  const lista = (raw.lista_slides as { img_src?: string; txt_alt?: string }[]) ?? [];
  return {
    slides: lista.map((s) => ({ imageSrc: s.img_src ?? "", imageAlt: s.txt_alt ?? "" })),
    title: (raw.txt_titulo as string) ?? "",
    subtitle: (raw.txt_subtitulo as string) ?? "",
  };
}

export function getHomeHeroData(locale?: string): HomeHeroData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? heroEn : heroEs) as Record<string, unknown>;
  return Array.isArray(raw.slides) ? (raw as unknown as HomeHeroData) : mapHeroFromCms(raw);
}

function mapCarouselLineasFromCms(raw: Record<string, unknown>): HomeCarouselLineasData {
  const lista = (raw.lista_lineas as { txt_nombre?: string; img_linea?: string; txt_alt_optional?: string; link_url?: string }[]) ?? [];
  return {
    sectionTitle: (raw.txt_titulo_seccion as string) ?? "",
    lineas: lista.map((item, i) => ({
      id: `linea-${i}`,
      name: item.txt_nombre ?? "",
      slug: item.txt_nombre?.toLowerCase().replace(/\s+/g, "-") ?? "",
      imageSrc: item.img_linea ?? "",
      imageAlt: item.txt_alt_optional ?? item.txt_nombre ?? "",
      href: item.link_url ?? "",
    })),
  };
}

export function getHomeCarouselLineasData(
  locale?: string
): HomeCarouselLineasData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? carouselLineasEn : carouselLineasEs) as Record<string, unknown>;
  return raw.sectionTitle != null ? (raw as unknown as HomeCarouselLineasData) : mapCarouselLineasFromCms(raw);
}

export function getHomeBanner1Data(locale?: string): HomeBannerData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? banner1En : banner1Es) as Record<string, unknown>;
  return raw.imageSrc != null ? (raw as unknown as HomeBannerData) : mapBannerFromCms(raw);
}

export function getHomeBanner2Data(locale?: string): HomeBannerData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? banner2En : banner2Es) as Record<string, unknown>;
  return raw.imageSrc != null ? (raw as unknown as HomeBannerData) : mapBannerFromCms(raw);
}

function mapProductosDestacadosFromCms(raw: Record<string, unknown>): HomeProductosDestacadosData {
  const lista = (raw.lista_productos as { txt_nombre?: string; img_producto?: string; txt_alt_optional?: string; link_url?: string }[]) ?? [];
  return {
    sectionTitle: (raw.txt_titulo_seccion as string) ?? "",
    products: lista.map((item, i) => ({
      id: `producto-${i}`,
      name: item.txt_nombre ?? "",
      imageSrc: item.img_producto ?? "",
      imageAlt: item.txt_alt_optional ?? item.txt_nombre ?? "",
      href: item.link_url ?? "",
    })),
  };
}

export function getHomeProductosDestacadosData(
  locale?: string
): HomeProductosDestacadosData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? productosDestacadosEn : productosDestacadosEs) as Record<string, unknown>;
  return raw.sectionTitle != null ? (raw as unknown as HomeProductosDestacadosData) : mapProductosDestacadosFromCms(raw);
}

function mapContactoFromCms(raw: Record<string, unknown>): HomeContactoData {
  const lista = (raw.lista_contacto as { txt_label?: string; link_destino?: string; txt_aria_optional?: string }[]) ?? [];
  return {
    sectionTitle: (raw.txt_titulo_seccion as string) ?? "",
    address: (raw.txt_direccion as string) ?? "",
    addressUrl: (raw.link_direccion as string) || undefined,
    phone: (raw.txt_telefono_optional as string) || undefined,
    email: (raw.txt_email_optional as string) || undefined,
    whatsapp: (raw.link_whatsapp_optional as string) || undefined,
    socialLinks: lista.map((c) => ({
      label: c.txt_label ?? "",
      href: c.link_destino ?? "",
      ariaLabel: c.txt_aria_optional ?? c.txt_label ?? "",
    })),
  };
}

export function getHomeContactoData(locale?: string): HomeContactoData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? contactoEn : contactoEs) as Record<string, unknown>;
  return raw.sectionTitle != null ? (raw as unknown as HomeContactoData) : mapContactoFromCms(raw);
}

export function getHeaderData(locale?: string): HeaderData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? headerEn : headerEs) as Record<string, unknown>;
  return raw.logo != null && typeof raw.logo === "object" ? (raw as unknown as HeaderData) : mapHeaderFromCms(raw);
}

/** Mapea footer en formato CMS (txt_*, lista_contacto, link_*) a FooterData */
function mapFooterFromCms(raw: Record<string, unknown>): FooterData {
  const linkLogo = raw.link_logo as { url?: string } | undefined;
  const listaContacto = (raw.lista_contacto as { txt_label?: string; link_destino?: string; txt_aria_optional?: string }[]) ?? [];
  return {
    logo: {
      text: (raw.txt_logo as string) ?? "Palo Alto",
      imageSrc: (raw.img_logo_optional as string) || undefined,
      imageAlt: (raw.txt_alt_logo_optional as string) ?? "",
      href: linkLogo?.url ?? "/",
    },
    address: (raw.txt_direccion as string) ?? "",
    addressUrl: (raw.link_direccion as string) || undefined,
    phone: (raw.txt_telefono_optional as string) || undefined,
    email: (raw.txt_email_optional as string) || undefined,
    whatsapp: (raw.link_whatsapp_optional as string) || undefined,
    socialLinks: listaContacto.map((c) => ({
      label: c.txt_label ?? "",
      href: c.link_destino ?? "",
      ariaLabel: c.txt_aria_optional ?? c.txt_label ?? "",
    })),
    disclaimer: (raw.txt_disclaimer as string) ?? "",
    developedBy: (raw.txt_desarrollado_por as string) ?? "",
    developedByUrl: (raw.link_desarrollado_por_optional as string) || undefined,
  };
}

export function getFooterData(locale?: string): FooterData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? footerEn : footerEs) as Record<string, unknown>;
  return raw.logo != null && typeof raw.logo === "object" ? (raw as unknown as FooterData) : mapFooterFromCms(raw);
}
