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
  DestileriaHeroData,
  DestileriaStorySplitData,
  DestileriaTextHighlightData,
  DestileriaMissionVisionData,
  DestileriaManifestoData,
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
export function mapBannerFromCms(raw: Record<string, unknown>): HomeBannerData {
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

function mapHeroSlides(raw: Record<string, unknown>): { imageSrc: string; imageAlt: string }[] {
  const gallery = (raw.gallery_slides as { url?: string; alt?: string }[]) ?? [];
  if (gallery.length > 0) {
    return gallery.map((s) => ({ imageSrc: s.url ?? "", imageAlt: s.alt ?? "" }));
  }
  const lista = (raw.lista_slides as { img_src?: string; txt_alt?: string }[]) ?? [];
  return lista.map((s) => ({ imageSrc: s.img_src ?? "", imageAlt: s.txt_alt ?? "" }));
}

export function mapHeroFromCms(raw: Record<string, unknown>): HomeHeroData {
  const logoSrc = (raw.logoImage ?? raw.img_logo) as string | undefined;
  const logoAlt = (raw.logoAlt ?? raw.txt_alt_logo_optional) as string | undefined;
  return {
    slides: mapHeroSlides(raw),
    img_logo: logoSrc && logoSrc.trim() ? logoSrc : undefined,
    logoAlt: logoAlt && logoAlt.trim() ? logoAlt : undefined,
    title: (raw.txt_titulo as string) ?? "",
    subtitle: (raw.txt_subtitulo as string) ?? "",
  };
}

export function getHomeHeroData(locale?: string): HomeHeroData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? heroEn : heroEs) as Record<string, unknown>;
  return Array.isArray(raw.slides) ? (raw as unknown as HomeHeroData) : mapHeroFromCms(raw);
}

export function mapCarouselLineasFromCms(raw: Record<string, unknown>): HomeCarouselLineasData {
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

export function mapProductosDestacadosFromCms(raw: Record<string, unknown>): HomeProductosDestacadosData {
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

/** Mapea footer en formato CMS (txt_*, lista_contacto, lista_contacto_destileria, link_*) a FooterData */
function mapFooterFromCms(raw: Record<string, unknown>): FooterData {
  const linkLogo = raw.link_logo as { url?: string } | undefined;
  const listaContacto = (raw.lista_contacto as { txt_label?: string; link_destino?: string; txt_aria_optional?: string }[]) ?? [];
  const listaDestileria = (raw.lista_contacto_destileria as { txt_label?: string; link_destino?: string; txt_aria_optional?: string }[]) ?? [];
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
    lista_contacto: listaContacto.map((c) => ({
      label: c.txt_label ?? "",
      href: c.link_destino ?? "",
      ariaLabel: c.txt_aria_optional ?? c.txt_label ?? "",
    })),
    socialLinks: listaContacto.map((c) => ({
      label: c.txt_label ?? "",
      href: c.link_destino ?? "",
      ariaLabel: c.txt_aria_optional ?? c.txt_label ?? "",
    })),
    lista_contacto_destileria: listaDestileria.map((c) => ({
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
  const listaParrafos = (qs.lista_parrafos as unknown) ?? [];
  const parrafosFromLista = Array.isArray(listaParrafos)
    ? listaParrafos.map((p) =>
        typeof p === "string" ? p : (p && typeof p === "object" && "txt_parrafo" in p ? String((p as { txt_parrafo?: unknown }).txt_parrafo ?? "") : "")
      ).filter((s): s is string => typeof s === "string" && s.length > 0)
    : [];
  const parrafosLegacy =
    parrafosFromLista.length > 0
      ? parrafosFromLista
      : [(qs.txt_parrafo_1 as string) ?? "", (qs.txt_parrafo_2 as string) ?? ""].filter(Boolean);
  const quienesSomos: BodegaQuienesSomosData = {
    title: (qs.txt_titulo as string) ?? "",
    paragraphs: parrafosLegacy,
    highlight: (qs.txt_destacado as string) || undefined,
    imageLeft: imgLeft ? { imageSrc: imgLeft, imageAlt: (qs.txt_alt_izquierda_optional as string) || undefined } : undefined,
    backgroundImage: imgFondo ? { imageSrc: imgFondo, imageAlt: (qs.txt_alt_fondo_optional as string) || undefined } : undefined,
    showEquipo: (qs.mostrar_equipo_optional ?? (qs as Record<string, unknown>)._show_team_optional) as boolean ?? false,
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

function toParagraphsFromRaw(raw: unknown[] | undefined): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((p) =>
      typeof p === "string" ? p : (p && typeof p === "object" && "txt_parrafo" in p ? String((p as { txt_parrafo?: unknown }).txt_parrafo ?? "") : "")
    )
    .filter((s): s is string => typeof s === "string" && s.length > 0);
}

function normalizeFincaFromRaw(obj: unknown): BodegaFincaData | null {
  const r = obj as Record<string, unknown> | null;
  if (!r || typeof r !== "object") return null;
  const isCmsFormat = "txt_titulo" in r || "lista_parrafos" in r;
  const title = (r.txt_titulo ?? r.title ?? "") as string;
  const paragraphs = isCmsFormat
    ? toParagraphsFromRaw(r.lista_parrafos as unknown[])
    : Array.isArray(r.paragraphs)
      ? (r.paragraphs as string[]).filter((s): s is string => typeof s === "string")
      : [];
  const conf = (r._configuracion ?? {}) as Record<string, unknown>;
  const imagePosition = (conf.imagePosition ?? r.imagePosition) === "left" ? "left" : "right";
  const img1 = (r.img_imagen_optional ?? r.imageSrc) as string | undefined;
  const img2 = (r.img_imagen_2_optional ?? r.imageSrc2) as string | undefined;
  const alt1 = (r.txt_alt_imagen_optional ?? r.txt_alt_optional ?? r.imageAlt) as string | undefined;
  const alt2 = (r.txt_alt_imagen_2_optional ?? r.imageAlt2) as string | undefined;
  return {
    id: (r.id as string) || undefined,
    title,
    location: (r.txt_ubicacion_optional ?? r.location) as string | undefined,
    description: (r.txt_descripcion_optional ?? r.description) as string | undefined,
    features: undefined,
    imageSrc: img1 || undefined,
    imageAlt: alt1 || undefined,
    imageSrc2: img2 || undefined,
    imageAlt2: alt2 || undefined,
    paragraphs,
    imagePosition,
    backgroundImage: undefined,
    parallax: (r.parallax_optional ?? r.parallax) as boolean ?? false,
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

/** Formato CMS destilería: prefijos txt_, img_, lista_, _configuracion (ver MANUAL_JSON_COMPONENTES_CMS_FORMULARIO_DINAMICO.md) */
function mapDestileriaFromCms(raw: Record<string, unknown>): DestileriaData {
  const heroRaw = (raw.hero ?? {}) as Record<string, unknown>;
  const btnCta = (heroRaw.btn_cta_optional ?? {}) as Record<string, unknown>;
  const heroConf = (heroRaw._configuracion ?? {}) as Record<string, unknown>;
  const position = heroConf.position as "top" | "center" | "bottom" | undefined;
  const hero = {
    title: String(heroRaw.txt_titulo ?? ""),
    subtitle: String(heroRaw.txt_subtitulo ?? ""),
    ctaLabel: String(btnCta.txt_label ?? ""),
    ctaUrl: String(btnCta.link_url ?? ""),
    backgroundImage: heroRaw.img_fondo_optional != null ? String(heroRaw.img_fondo_optional) : undefined,
    logoImage: heroRaw.img_logo_optional != null ? String(heroRaw.img_logo_optional) : undefined,
    position: position === "top" || position === "center" || position === "bottom" ? position : undefined,
  };

  const listaStorySplits = (raw.lista_story_splits ?? raw.story_splits ?? raw.storySplits ?? []) as unknown[];
  const storySplits = listaStorySplits.map((item) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const conf = (r._configuracion ?? {}) as Record<string, unknown>;
    const rawParrafos = Array.isArray(r.lista_parrafos) ? r.lista_parrafos : Array.isArray(r.list_parrafos) ? r.list_parrafos : [];
    const parrafos = rawParrafos.map((p) =>
      typeof p === "string" ? p : (p && typeof p === "object" && "txt_parrafo" in p ? String((p as { txt_parrafo?: unknown }).txt_parrafo ?? "") : "")
    ).filter(Boolean);
    return {
      title: r.txt_titulo != null ? String(r.txt_titulo) : undefined,
      paragraphs: parrafos,
      imageSrc: r.img_imagen_optional != null ? String(r.img_imagen_optional) : undefined,
      imageAlt: r.txt_alt_optional != null ? String(r.txt_alt_optional) : undefined,
      imagePosition: (conf.imagePosition as "left" | "right") ?? undefined,
      paloalto: r.paloalto === true,
    };
  });

  function bodyFromParrafos(r: Record<string, unknown>): string {
    const raw = (r.lista_parrafos ?? r.list_parrafos ?? []) as unknown[];
    if (!Array.isArray(raw) || raw.length === 0) return "";
    return raw
      .map((p) =>
        typeof p === "string" ? p : (p && typeof p === "object" && "txt_parrafo" in p ? String((p as { txt_parrafo?: unknown }).txt_parrafo ?? "") : "")
      )
      .filter(Boolean)
      .join("\n\n");
  }
  const listaHighlights = (raw.lista_text_highlights ?? raw.text_highlights ?? raw.textHighlights ?? []) as unknown[];
  const textHighlights = listaHighlights.map((item) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const conf = (r._configuracion ?? {}) as Record<string, unknown>;
    const body = String(r.txt_body ?? "").trim() || bodyFromParrafos(r);
    return {
      title: r.txt_titulo != null ? String(r.txt_titulo) : undefined,
      body,
      highlightQuote: r.txt_quote_optional != null ? String(r.txt_quote_optional) : undefined,
      backgroundImage: r.img_fondo_optional != null ? String(r.img_fondo_optional) : undefined,
      backgroundImageAlt: r.txt_alt_fondo_optional != null ? String(r.txt_alt_fondo_optional) : undefined,
      parallax: conf.parallax === true,
      textAlign: (conf.textAlign as "left" | "center" | "right") ?? undefined,
    };
  });

  const promisesRaw = (raw.text_promises ?? raw.textPromises ?? {}) as Record<string, unknown>;
  const promisesConf = (promisesRaw._configuracion ?? {}) as Record<string, unknown>;
  const promisesBody = String(promisesRaw.txt_body ?? "").trim() || bodyFromParrafos(promisesRaw);
  const textPromises = {
    title: promisesRaw.txt_titulo != null ? String(promisesRaw.txt_titulo) : undefined,
    body: promisesBody,
    highlightQuote: promisesRaw.txt_quote_optional != null ? String(promisesRaw.txt_quote_optional) : undefined,
    backgroundImage: promisesRaw.img_fondo_optional != null ? String(promisesRaw.img_fondo_optional) : undefined,
    backgroundImageAlt: promisesRaw.txt_alt_fondo_optional != null ? String(promisesRaw.txt_alt_fondo_optional) : undefined,
    parallax: promisesConf.parallax === true,
    textAlign: (promisesConf.textAlign as "left" | "center" | "right") ?? undefined,
  };

  const mvRaw = (raw.mission_vision ?? raw.missionVision ?? {}) as Record<string, unknown>;
  const mvConf = (mvRaw._configuracion ?? {}) as Record<string, unknown>;
  const listaValues = (mvRaw.lista_values ?? mvRaw.values ?? []) as unknown[];
  const values = listaValues.map((v) => {
    const r = (v ?? {}) as Record<string, unknown>;
    return {
      key: String(r.key ?? ""),
      title: String(r.txt_titulo ?? r.title ?? ""),
      description: String(r.txt_descripcion ?? r.description ?? ""),
    };
  });
  const rawTabLabels = mvConf.tab_labels as { mission?: string; vision?: string; values?: string } | undefined;
  const tabLabels =
    rawTabLabels &&
    rawTabLabels.mission != null &&
    rawTabLabels.vision != null &&
    rawTabLabels.values != null
      ? {
          mission: String(rawTabLabels.mission),
          vision: String(rawTabLabels.vision),
          values: String(rawTabLabels.values),
        }
      : undefined;
  const missionVision = {
    mission: String(mvRaw.txt_mission ?? mvRaw.mission ?? ""),
    vision: String(mvRaw.txt_vision ?? mvRaw.vision ?? ""),
    values,
    tabLabels,
    layout: (mvConf.layout as "tabs" | "blocks") ?? undefined,
  };

  const manifestoRaw = (raw.manifesto ?? {}) as Record<string, unknown>;
  const listaLineas = (manifestoRaw.lista_lineas ?? manifestoRaw.lines ?? []) as string[];
  const galleryImgs = (manifestoRaw.gallery_imagenes ?? manifestoRaw.lista_imagenes ?? manifestoRaw.images ?? []) as unknown[];
  const images = galleryImgs.map((img) => {
    const r = (img ?? {}) as Record<string, unknown>;
    return {
      imageSrc: String(r.url ?? r.img_src ?? ""),
      imageAlt: String(r.alt ?? r.txt_alt ?? ""),
    };
  }).filter((x) => x.imageSrc);

  const manifesto = {
    lines: listaLineas,
    images: images.length > 0 ? images : undefined,
  };

  return {
    hero,
    storySplits,
    textHighlights,
    textPromises,
    missionVision,
    manifesto,
  };
}

function isDestileriaCmsFormat(raw: Record<string, unknown>): boolean {
  const hero = (raw.hero ?? {}) as Record<string, unknown>;
  return "txt_titulo" in hero || "txt_subtitulo" in hero;
}

export function getDestileriaData(locale?: string): DestileriaData {
  const loc = normalizeLocale(locale);
  const raw = (loc === "en" ? destileriaEn : destileriaEs) as Record<string, unknown>;
  if (isDestileriaCmsFormat(raw)) return mapDestileriaFromCms(raw);
  return raw as unknown as DestileriaData;
}

/** Mapea data de portada_destileria (API) a DestileriaHeroData. Acepta { hero } o data directa. */
export function mapPortadaDestileriaFromCms(raw: Record<string, unknown>): DestileriaHeroData {
  const heroRaw = (raw.hero ?? raw) as Record<string, unknown>;
  const btnCta = (heroRaw.btn_cta_optional ?? {}) as Record<string, unknown>;
  const heroConf = (heroRaw._configuracion ?? {}) as Record<string, unknown>;
  const position = heroConf.position as "top" | "center" | "bottom" | undefined;
  return {
    title: String(heroRaw.txt_titulo ?? ""),
    subtitle: String(heroRaw.txt_subtitulo ?? ""),
    ctaLabel: String(btnCta.txt_label ?? ""),
    ctaUrl: String(btnCta.link_url ?? ""),
    backgroundImage: heroRaw.img_fondo_optional != null ? String(heroRaw.img_fondo_optional) : undefined,
    logoImage: heroRaw.img_logo_optional != null ? String(heroRaw.img_logo_optional) : undefined,
    position: position === "top" || position === "center" || position === "bottom" ? position : undefined,
  };
}

function mapSingleStorySplitFromCms(r: Record<string, unknown>): DestileriaStorySplitData {
  const conf = (r._configuracion ?? {}) as Record<string, unknown>;
  const rawParrafos = Array.isArray(r.lista_parrafos) ? r.lista_parrafos : Array.isArray(r.list_parrafos) ? r.list_parrafos : [];
  const parrafos = rawParrafos
    .map((p: unknown) =>
      typeof p === "string" ? p : (p && typeof p === "object" && "txt_parrafo" in (p as object) ? String((p as { txt_parrafo?: unknown }).txt_parrafo ?? "") : "")
    )
    .filter((s): s is string => typeof s === "string" && s.length > 0);
  return {
    title: r.txt_titulo != null ? String(r.txt_titulo) : undefined,
    paragraphs: parrafos,
    imageSrc: r.img_imagen_optional != null ? String(r.img_imagen_optional) : undefined,
    imageAlt: r.txt_alt_optional != null ? String(r.txt_alt_optional) : undefined,
    imagePosition: (conf.imagePosition as "left" | "right") ?? "right",
    paloalto: r.paloalto === true,
  };
}

/** Mapea data de historia_destileria (API). Acepta story_splits[] o datos de un solo bloque. */
export function mapHistoriaDestileriaFromCms(raw: Record<string, unknown>): DestileriaStorySplitData | { storySplits: DestileriaStorySplitData[] } {
  const lista = (raw.story_splits ?? raw.lista_story_splits ?? []) as unknown[];
  if (Array.isArray(lista) && lista.length > 0) {
    return {
      storySplits: lista.map((item) => mapSingleStorySplitFromCms((item ?? {}) as Record<string, unknown>)),
    };
  }
  return mapSingleStorySplitFromCms(raw);
}

/** Mapea data de manifest (API) a DestileriaManifestoData. Acepta data bajo manifesto. */
export function mapManifestFromCms(raw: Record<string, unknown>): DestileriaManifestoData {
  const manifestoRaw = (raw.manifesto ?? raw) as Record<string, unknown>;
  const listaLineas = (manifestoRaw.lista_lineas ?? manifestoRaw.lines ?? []) as string[];
  const galleryImgs = (manifestoRaw.gallery_imagenes ?? manifestoRaw.lista_imagenes ?? manifestoRaw.images ?? []) as unknown[];
  const images = galleryImgs
    .map((img) => {
      const r = (img ?? {}) as Record<string, unknown>;
      return {
        imageSrc: String(r.url ?? r.img_src ?? ""),
        imageAlt: String(r.alt ?? r.txt_alt ?? ""),
      };
    })
    .filter((x) => x.imageSrc);
  return {
    lines: listaLineas,
    images: images.length > 0 ? images : undefined,
  };
}

/** Mapea data de mission_vision_values (API) a DestileriaMissionVisionData. Acepta data directa o bajo mission_vision. */
export function mapMissionVisionValuesFromCms(raw: Record<string, unknown>): DestileriaMissionVisionData {
  const mvRaw = (raw.mission_vision ?? raw.missionVision ?? raw) as Record<string, unknown>;
  const mvConf = (mvRaw._configuracion ?? {}) as Record<string, unknown>;
  const listaValues = (mvRaw.lista_values ?? mvRaw.values ?? []) as unknown[];
  const values = listaValues.map((v) => {
    const r = (v ?? {}) as Record<string, unknown>;
    return {
      key: String(r.key ?? ""),
      title: String(r.txt_titulo ?? r.title ?? ""),
      description: String(r.txt_descripcion ?? r.description ?? ""),
    };
  });
  const rawTabLabels = mvConf.tab_labels as { mission?: string; vision?: string; values?: string } | undefined;
  const tabLabels =
    rawTabLabels &&
    rawTabLabels.mission != null &&
    rawTabLabels.vision != null &&
    rawTabLabels.values != null
      ? {
          mission: String(rawTabLabels.mission),
          vision: String(rawTabLabels.vision),
          values: String(rawTabLabels.values),
        }
      : undefined;
  const layoutVal = mvConf.layout as string | undefined;
  const layout = layoutVal === "blocks" || layoutVal === "tabs" ? layoutVal : layoutVal === "default" ? "blocks" : undefined;
  return {
    mission: String(mvRaw.txt_mission ?? mvRaw.mission ?? ""),
    vision: String(mvRaw.txt_vision ?? mvRaw.vision ?? ""),
    values,
    tabLabels,
    layout: layout ?? undefined,
  };
}

/** Mapea data de banner_full (highlights individuales, API) a DestileriaTextHighlightData. Busca highlights_1, highlights_2, highlights_3... */
export function mapBannerFullToHighlightFromCms(raw: Record<string, unknown>): DestileriaTextHighlightData {
  const highlightKey = Object.keys(raw).find((k) => k.startsWith("highlights_") && typeof (raw[k] as unknown) === "object");
  const r = (highlightKey ? (raw[highlightKey] as Record<string, unknown>) : raw) as Record<string, unknown>;
  const conf = (r._configuracion ?? {}) as Record<string, unknown>;
  const rawParrafos = (r.lista_parrafos ?? r.list_parrafos ?? []) as unknown[];
  const bodyFromParrafos =
    Array.isArray(rawParrafos) && rawParrafos.length > 0
      ? rawParrafos
          .map((p) =>
            typeof p === "string" ? p : (p && typeof p === "object" && "txt_parrafo" in (p as object) ? String((p as { txt_parrafo?: unknown }).txt_parrafo ?? "") : "")
          )
          .filter(Boolean)
          .join("\n\n")
      : "";
  const body = String(r.txt_body ?? "").trim() || bodyFromParrafos;
  return {
    title: r.txt_titulo != null ? String(r.txt_titulo) : undefined,
    body,
    highlightQuote: r.txt_quote_optional != null ? String(r.txt_quote_optional) : undefined,
    backgroundImage: r.img_fondo_optional != null ? String(r.img_fondo_optional) : undefined,
    backgroundImageAlt: r.txt_alt_fondo_optional != null ? String(r.txt_alt_fondo_optional) : undefined,
    parallax: conf.parallax === true,
    textAlign: (conf.textAlign as "left" | "center" | "right") ?? "left",
  };
}

export function getContactPageData(locale?: string): ContactPageData {
  const loc = normalizeLocale(locale);
  return (loc === "en" ? contactPageEn : contactPageEs) as unknown as ContactPageData;
}
