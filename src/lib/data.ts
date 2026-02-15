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
  BodegaData,
  BodegaQuienesSomosData,
  BodegaEquipoData,
  BodegaFincasSectionData,
  BodegaFincaData,
  DestileriaData,
  ContactPageData,
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
import bodegaEs from "@/data/es/bodega.json";
import bodegaEn from "@/data/en/bodega.json";
import destileriaEs from "@/data/es/destileria.json";
import destileriaEn from "@/data/en/destileria.json";
import contactPageEs from "@/data/es/contacto.json";
import contactPageEn from "@/data/en/contacto.json";

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
    logoImage: (raw.logoImage as string) || undefined,
    logoAlt: (raw.logoAlt as string) || undefined,
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
    logoImage: (raw.logoImage as string) || undefined,
    logoAlt: (raw.logoAlt as string) || undefined,
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

/** Mapea bodega en formato CMS (quienes_somos, equipo, finca_1, finca_2) a BodegaData */
function mapBodegaFromCms(raw: Record<string, unknown>): BodegaData {
  const qs = (raw.quienes_somos as Record<string, unknown>) ?? {};
  const eq = (raw.equipo as Record<string, unknown>) ?? {};
  const listaEquipo = (eq.lista_equipo as Record<string, unknown>[]) ?? [];
  const fs = (raw.fincas_seccion as Record<string, unknown>) ?? {};
  const f1 = (raw.finca_1 as Record<string, unknown>) ?? {};
  const f2 = (raw.finca_2 as Record<string, unknown>) ?? {};
  /** Convierte lista_caracteristicas en formato items [{ "Superficie": "25 Hectáreas" }, ...] o legacy [{ txt_label, txt_valor }] a { label, value }[] */
  function mapCaracteristicas(rawList: unknown): { label: string; value: string }[] {
    const list = Array.isArray(rawList) ? rawList : [];
    return list.map((item) => {
      const obj = item as Record<string, string>;
      if (obj.txt_label != null || obj.txt_valor != null) {
        return { label: obj.txt_label ?? "", value: obj.txt_valor ?? "" };
      }
      const keys = Object.keys(obj).filter((k) => !k.startsWith("_"));
      const key = keys[0];
      return key ? { label: key, value: String(obj[key] ?? "") } : { label: "", value: "" };
    }).filter((c) => c.label || c.value);
  }
  const listaLabels = mapCaracteristicas(f1.lista_caracteristicas);
  const lista2 = mapCaracteristicas(f2.lista_caracteristicas);

  const imgFondoFincas = fs.img_fondo_optional as string | undefined;
  const fincasSection: BodegaFincasSectionData = {
    title: (fs.txt_titulo as string) ?? "Nuestras Fincas",
    backgroundImage: imgFondoFincas
      ? { imageSrc: imgFondoFincas, imageAlt: (fs.txt_alt_fondo_optional as string) || undefined }
      : undefined,
  };

  const imgLeft = qs.img_izquierda_optional as string | undefined;
  const imgFondo = qs.img_fondo_optional as string | undefined;
  const quienesSomos: BodegaQuienesSomosData = {
    title: (qs.txt_titulo as string) ?? "",
    paragraphs: [(qs.txt_parrafo_1 as string) ?? "", (qs.txt_parrafo_2 as string) ?? ""].filter(Boolean),
    highlight: (qs.txt_destacado as string) || undefined,
    imageLeft: imgLeft ? { imageSrc: imgLeft, imageAlt: (qs.txt_alt_izquierda_optional as string) || undefined } : undefined,
    backgroundImage: imgFondo ? { imageSrc: imgFondo, imageAlt: (qs.txt_alt_fondo_optional as string) || undefined } : undefined,
    showEquipo: (qs.mostrar_equipo_optional as boolean) ?? false,
  };

  const avatarLayoutRaw = (eq.avatar_layout_optional as string) ?? "";
  const equipo: BodegaEquipoData = {
    sectionTitle: (eq.txt_titulo_seccion as string) ?? "",
    avatarLayout: avatarLayoutRaw === "left" ? "left" : "top",
    members: listaEquipo.map((m, i) => ({
      id: `equipo-${i}`,
      name: (m.txt_nombre as string) ?? "",
      role: (m.txt_rol_optional as string) || undefined,
      imageSrc: (m.img_avatar_optional as string) || undefined,
      imageAlt: (m.txt_alt_avatar_optional as string) || undefined,
      bio: (m.txt_bio_optional as string) || undefined,
    })),
  };

  const finca1Txt = raw.finca_1_txt as string[] | undefined;
  const finca2Txt = raw.finca_2_txt as string[] | undefined;
  const toParagraphs = (arr: string[] | undefined) =>
    Array.isArray(arr) ? arr.filter((s): s is string => typeof s === "string" && s.length > 0) : [];

  const f1Bg = (f1.img_fondo_optional as string) || undefined;
  const f2Bg = (f2.img_fondo_optional as string) || undefined;
  const finca1: BodegaFincaData = {
    id: "finca-alto-ugarteche",
    title: (f1.txt_titulo as string) ?? "",
    location: (f1.txt_ubicacion_optional as string) || undefined,
    description: (f1.txt_descripcion_optional as string) || undefined,
    features: listaLabels,
    imageSrc: (f1.img_finca_optional as string) || undefined,
    imageAlt: (f1.txt_alt_finca_optional as string) || (f1.txt_alt_fondo_optional as string) || undefined,
    paragraphs: toParagraphs(finca1Txt),
    imagePosition: "right",
    backgroundImage: f1Bg ? { imageSrc: f1Bg, imageAlt: (f1.txt_alt_fondo_optional as string) || undefined } : undefined,
    parallax: (f1.parallax_optional as boolean) ?? false,
  };

  const finca2: BodegaFincaData = {
    id: "finca-palo-alto",
    title: (f2.txt_titulo as string) ?? "",
    location: (f2.txt_ubicacion_optional as string) || undefined,
    description: (f2.txt_descripcion_optional as string) || undefined,
    features: lista2,
    imageSrc: (f2.img_finca_optional as string) || undefined,
    imageAlt: (f2.txt_alt_finca_optional as string) || (f2.txt_alt_fondo_optional as string) || undefined,
    paragraphs: toParagraphs(finca2Txt),
    imagePosition: "left",
    backgroundImage: f2Bg ? { imageSrc: f2Bg, imageAlt: (f2.txt_alt_fondo_optional as string) || undefined } : undefined,
    parallax: (f2.parallax_optional as boolean) ?? false,
  };

  return { quienesSomos, equipo, fincasSection, finca1, finca2 };
}

function normalizeFincaFromRaw(obj: unknown): BodegaFincaData | null {
  const r = obj as Record<string, unknown> | null;
  if (!r || typeof r !== "object") return null;
  const title = (r.title as string) ?? "";
  const paragraphs = Array.isArray(r.paragraphs)
    ? (r.paragraphs as string[]).filter((s): s is string => typeof s === "string")
    : [];
  return {
    id: (r.id as string) || undefined,
    title,
    location: (r.location as string) || undefined,
    description: (r.description as string) || undefined,
    features: undefined,
    imageSrc: (r.imageSrc as string) || undefined,
    imageAlt: (r.imageAlt as string) || undefined,
    imageSrc2: (r.imageSrc2 as string) || undefined,
    imageAlt2: (r.imageAlt2 as string) || undefined,
    paragraphs,
    imagePosition: r.imagePosition === "left" ? "left" : "right",
    backgroundImage: undefined,
    parallax: false,
  };
}

export function getBodegaData(locale?: string): BodegaData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? bodegaEn : bodegaEs) as Record<string, unknown>;
  const base = raw.quienes_somos != null ? mapBodegaFromCms(raw) : (raw as unknown as BodegaData);
  const directFinca1 = normalizeFincaFromRaw(raw.finca1);
  const directFinca2 = normalizeFincaFromRaw(raw.finca2);
  if (directFinca1 && directFinca2) {
    return {
      ...base,
      finca1: { ...directFinca1, id: directFinca1.id ?? "finca-alto-ugarteche" },
      finca2: { ...directFinca2, id: directFinca2.id ?? "finca-palo-alto" },
    };
  }
  return base;
}

export function getDestileriaData(locale?: string): DestileriaData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? destileriaEn : destileriaEs) as unknown as DestileriaData;
}

export function getContactPageData(locale?: string): ContactPageData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? contactPageEn : contactPageEs) as unknown as ContactPageData;
}
