import { DEFAULT_LOCALE, isValidLocale, type Locale } from "@/lib/i18n";

export interface ProductosTranslations {
  pageTitle: string;
  pageSubtitle: string;
  filters: {
    title: string;
    linea: string;
    productType: string;
    color: string;
    colorLabels?: Record<string, string>;
    varietal: string;
    blend: string;
    crianza: string;
    clearAll: string;
  };
  productTypes: {
    vinos: string;
    espumantes: string;
    gin: string;
  };
  pagination: {
    previous: string;
    next: string;
    pageOf: string;
  };
  detail: {
    notasCata: string;
    vista: string;
    nariz: string;
    boca: string;
    atributos: string;
    descripcion: string;
    fichaTecnica: string;
  };
      empty: string;
  loading: string;
  featured: string;
  backToProducts: string;
}

export interface UITranslations {
  header: {
    mainNavigation: string;
    mobileNavigation: string;
    languageSelector: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    allRightsReserved: string;
  };
  productos: ProductosTranslations;
  cms: {
    enableCmsLayoutHint: string;
    loadingConfig: string;
    loadingComponents: string;
    emptyPagePrefix: string;
    contactLoading: string;
    contactMissingData: string;
    bodegaEmptyHelp: string;
    destileriaEmptyHelp: string;
  };
}

const UI_TEXT: Record<Locale, UITranslations> = {
  es: {
    header: {
      mainNavigation: "Navegacion principal",
      mobileNavigation: "Navegacion movil",
      languageSelector: "Idioma",
      openMenu: "Abrir menu",
      closeMenu: "Cerrar menu",
    },
    footer: {
      allRightsReserved: "Todos los derechos reservados",
    },
    productos: {
      pageTitle: "Nuestros productos",
      pageSubtitle: "Descubrí nuestra selección de vinos y espumantes.",
      filters: {
        title: "Filtros",
        linea: "Línea",
        productType: "Tipo",
        color: "Color",
        colorLabels: { tinto: "Tinto", blanco: "Blanco", rose: "Rosé", rosé: "Rosé" },
        varietal: "Varietal",
        blend: "Blend",
        crianza: "Crianza",
        clearAll: "Limpiar filtros",
      },
      productTypes: {
        vinos: "Vinos",
        espumantes: "Espumantes",
        gin: "Gin",
      },
      pagination: {
        previous: "Anterior",
        next: "Siguiente",
        pageOf: "Página {page} de {total}",
      },
      detail: {
        notasCata: "Notas de cata",
        vista: "Vista",
        nariz: "Nariz",
        boca: "Boca",
        atributos: "Atributos",
        descripcion: "Descripción",
        fichaTecnica: "Ficha técnica",
      },
      empty: "No hay productos que coincidan con los filtros.",
      loading: "Cargando productos...",
      featured: "Destacado",
      backToProducts: "Volver a productos",
    },
    cms: {
      enableCmsLayoutHint: "Activa NEXT_PUBLIC_USE_CMS_LAYOUT=true para cargar el contenido desde la API.",
      loadingConfig: "Cargando configuracion...",
      loadingComponents: "Cargando componentes...",
      emptyPagePrefix: 'No hay componentes configurados para la pagina',
      contactLoading: "Cargando formulario de contacto...",
      contactMissingData:
        'No hay datos de contacto configurados. Configura los componentes "formulario_contacto" y "contacto_redes" en el CMS para la pagina contacto.',
      bodegaEmptyHelp:
        'Conecta la API del CMS y configura "about" (con equipo opcional integrado) y "fincas" con page: "bodega".',
      destileriaEmptyHelp:
        'Conecta la API del CMS y configura componentes "portada_destileria", "historia_destileria", "banner_full", "mision_vision_values", "manifest" con page: "destileria".',
    },
  },
  en: {
    header: {
      mainNavigation: "Main navigation",
      mobileNavigation: "Mobile navigation",
      languageSelector: "Language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    footer: {
      allRightsReserved: "All rights reserved",
    },
    productos: {
      pageTitle: "Our products",
      pageSubtitle: "Discover our selection of wines and sparkling wines.",
      filters: {
        title: "Filters",
        linea: "Line",
        productType: "Type",
        color: "Color",
        colorLabels: { tinto: "Red", blanco: "White", rose: "Rosé", rosé: "Rosé" },
        varietal: "Varietal",
        blend: "Blend",
        crianza: "Aging",
        clearAll: "Clear filters",
      },
      productTypes: {
        vinos: "Wines",
        espumantes: "Sparkling",
        gin: "Gin",
      },
      pagination: {
        previous: "Previous",
        next: "Next",
        pageOf: "Page {page} of {total}",
      },
      detail: {
        notasCata: "Tasting notes",
        vista: "Sight",
        nariz: "Nose",
        boca: "Palate",
        atributos: "Attributes",
        descripcion: "Description",
        fichaTecnica: "Technical sheet",
      },
      empty: "No products match the filters.",
      loading: "Loading products...",
      featured: "Featured",
      backToProducts: "Back to products",
    },
    cms: {
      enableCmsLayoutHint: "Enable NEXT_PUBLIC_USE_CMS_LAYOUT=true to load content from the API.",
      loadingConfig: "Loading configuration...",
      loadingComponents: "Loading components...",
      emptyPagePrefix: "No components configured for page",
      contactLoading: "Loading contact form...",
      contactMissingData:
        'No contact data configured. Set up "formulario_contacto" and "contacto_redes" CMS components for the contacto page.',
      bodegaEmptyHelp:
        'Connect the CMS API and configure "about" (with optional embedded team) and "fincas" with page: "bodega".',
      destileriaEmptyHelp:
        'Connect the CMS API and configure "portada_destileria", "historia_destileria", "banner_full", "mision_vision_values", "manifest" components with page: "destileria".',
    },
  },
};

export function getUITranslations(locale: string): UITranslations {
  const loc = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  return UI_TEXT[loc];
}

/** Etiqueta de color para mostrar (tinto→Red en EN, etc.). Fallback: capitalizar. */
export function getColorDisplayLabel(colorValue: string, locale: string): string {
  const key = colorValue.toLowerCase().trim();
  const labels = getUITranslations(locale).productos.filters.colorLabels;
  if (labels?.[key]) return labels[key];
  return key ? key.charAt(0).toUpperCase() + key.slice(1) : colorValue;
}

