/**
 * Mapeo de tipos de componentes CMS a nombres de layout.
 * Archivo sin dependencias de React/componentes para no introducir
 * imports cruzados entre mapas de página.
 */
export const cmsTypeToLayoutName: Record<string, string> = {
  home_hero: "home-hero",
  home_carrousel_lineas: "home-carousel-lineas",
  home_banner: "home-banner",
  /** Mismo bloque visual que home_banner (contrato alineado en mapBannerFromCms). */
  banner_con_imagen_de_fondo_2: "home-banner",
  home_productos_destacados: "home-productos-destacados",
  carrusel_promocional: "promo-carousel",
  slider_banner: "promo-carousel",
  carrusel_bodega: "promo-carousel",
  carrusel_destileria: "promo-carousel",
  carrusel_contacto: "promo-carousel",
  portada_destileria: "portada-destileria",
  historia_destileria: "historia-destileria",
  destileria_historia: "historia-destileria",
  banner_full: "highlight-destileria",
  banner_1: "highlight-destileria",
  banner_2: "highlight-destileria",
  banner_3: "highlight-destileria",
  mission_vision_values: "mission-vision-values",
  mision_vision_values: "mission-vision-values",
  mision_vision_valores: "mission-vision-values",
  manifest: "manifest-destileria",
  manifiesto: "manifest-destileria",
  hero_banner: "home-banner",
  about: "about-bodega",
  quienes_somos: "about-bodega",
  team: "team-bodega",
  fincas: "fincas-bodega",
};
