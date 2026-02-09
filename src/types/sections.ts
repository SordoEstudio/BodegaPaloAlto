/**
 * Tipos por sección. Mismo contrato para datos JSON (fase actual) y API del CMS (fase producción).
 */

export type Locale = "es" | "en";

/** Welcome (bienvenida / verificación de edad) */
export interface WelcomeData {
  hero: {
    imageSrc?: string;
    imageAlt: string;
  };
  title: string;
  message: string;
  legalNotice: string;
  buttons: {
    confirm: string;
    confirmAriaLabel: string;
    decline: string;
    declineAriaLabel: string;
    declineUrl: string;
  };
}

/** Home - Hero (carrusel de imágenes + overlay para texto) */
export interface HomeHeroSlide {
  imageSrc: string;
  imageAlt: string;
}

export interface HomeHeroData {
  slides: HomeHeroSlide[];
  title: string;
  subtitle: string;
}

/** Home - Carousel líneas (6 líneas) */
export interface LineaItem {
  id: string;
  name: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

export interface HomeCarouselLineasData {
  sectionTitle: string;
  lineas: LineaItem[];
}

/** Home - Banner genérico */
export interface HomeBannerData {
  imageSrc: string;
  imageAlt: string;
  title?: string;
  href?: string;
}

/** Home - Productos destacados */
export interface ProductoDestacado {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

export interface HomeProductosDestacadosData {
  sectionTitle: string;
  products: ProductoDestacado[];
}

/** Home - Contacto */
export interface HomeContactoData {
  sectionTitle: string;
  address: string;
  addressUrl?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  socialLinks: { label: string; href: string; ariaLabel: string }[];
}

export interface HomeData {
  hero: HomeHeroData;
  carouselLineas: HomeCarouselLineasData;
  banner1: HomeBannerData;
  banner2: HomeBannerData;
  productosDestacados: HomeProductosDestacadosData;
  contacto: HomeContactoData;
}

/** Header: logo y navegación (compartido por todas las páginas) */
export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface HeaderData {
  logo: {
    text: string;
    imageSrc?: string;
    imageAlt?: string;
    href: string;
  };
  nav: NavItem[];
  shop: { label: string; href: string; external?: boolean };
  languages: { code: Locale; label: string }[];
}

/** Footer (pie de página) */
export interface FooterData {
  logo: {
    text: string;
    imageSrc?: string;
    imageAlt?: string;
    href: string;
  };
  address: string;
  addressUrl?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  socialLinks: { label: string; href: string; ariaLabel: string }[];
  disclaimer: string;
  developedBy: string;
  developedByUrl?: string;
}
