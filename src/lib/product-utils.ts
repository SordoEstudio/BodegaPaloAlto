import type { PublicProduct } from "@/hooks/usePublicProducts";

/** Normaliza "Benito A." → "benito-a" para URLs de filtro */
export function lineaToSlug(linea: string): string {
  return linea
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Convierte slug "benito-a" → busca en lista de líneas para match (o devuelve el slug) */
export function slugToLinea(slug: string, lineas: string[]): string | null {
  const normalized = slug.toLowerCase().replace(/-/g, " ");
  const found = lineas.find(
    (l) => lineaToSlug(l) === slug || l.toLowerCase().replace(/\s+/g, "-") === slug
  );
  return found ?? null;
}

/** Detecta si un producto es espumante (productType sparkling o tiene dosaje) */
export function isEspumante(product: PublicProduct): boolean {
  const pt = (product.productType ?? "").toLowerCase();
  if (pt.includes("sparkling") || pt.includes("espumante")) return true;
  const dosaje = String(product.attributes?.dosaje ?? "").trim();
  return dosaje.length > 0;
}

/** Detecta si un producto es blend (corte: "Sí" o blend: true o varietal con comas) */
export function isBlend(product: PublicProduct): boolean {
  const attrs = product.attributes ?? {};
  if (attrs.blend === true) return true;
  if (attrs.corte === "Sí" || attrs.corte === "sí" || attrs.corte === true) return true;
  const varietal = String(attrs.varietal ?? "");
  return varietal.includes(",");
}

/** Comprueba si el producto coincide con el varietal (incluye blends que contienen ese varietal) */
export function matchesVarietal(product: PublicProduct, varietalFilter: string): boolean {
  const varietal = String(product.attributes?.varietal ?? "").toLowerCase();
  const filter = varietalFilter.toLowerCase().trim();
  if (!filter) return true;
  return varietal.includes(filter);
}

export interface ProductFiltersState {
  linea?: string;
  productType?: string;
  color?: string;
  varietal?: string;
  blend?: boolean;
  crianza?: string;
}

/** Filtra productos según el estado de filtros */
export function filterProducts(
  products: PublicProduct[],
  filters: ProductFiltersState
): PublicProduct[] {
  return products.filter((p) => {
    if (filters.linea) {
      const slug = lineaToSlug(String(p.attributes?.linea ?? ""));
      if (slug !== filters.linea) return false;
    }
    if (filters.productType) {
      const pt = (p.productType ?? "").toLowerCase();
      const isSparkling = isEspumante(p);
      if (filters.productType === "vinos") {
        if (isSparkling || pt.includes("gin")) return false;
        if (!pt.includes("wine") && !pt.includes("vino")) return false;
      } else if (filters.productType === "espumantes") {
        if (!isSparkling) return false;
      } else if (filters.productType === "gin") {
        if (!pt.includes("gin")) return false;
      } else {
        const map: Record<string, string[]> = {
          vinos: ["wine", "vinos"],
          espumantes: ["sparkling", "espumantes"],
          gin: ["gin"],
        };
        const allowed = map[filters.productType] ?? [filters.productType];
        if (!allowed.some((a) => pt.includes(a))) return false;
      }
    }
    if (filters.color) {
      const c = String(p.attributes?.color ?? "").toLowerCase();
      if (c !== filters.color.toLowerCase()) return false;
    }
    if (filters.varietal && !matchesVarietal(p, filters.varietal)) return false;
    if (filters.blend === true && !isBlend(p)) return false;
    if (filters.crianza) {
      const cr = String(p.attributes?.crianza ?? "").toLowerCase();
      if (cr !== filters.crianza.toLowerCase()) return false;
    }
    return true;
  });
}

/** Ordena: destacados primero, luego por order, luego createdAt */
export function sortProductsWithFeatured(products: PublicProduct[]): PublicProduct[] {
  return [...products].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });
}

/** Extrae valores únicos de un atributo de la lista de productos */
export function getUniqueAttributeValues(
  products: PublicProduct[],
  key: string
): string[] {
  const set = new Set<string>();
  const normalize = key === "color";
  for (const p of products) {
    const v = p.attributes?.[key];
    if (v == null) continue;
    const s = String(v).trim();
    if (!s) continue;
    set.add(normalize ? s.toLowerCase() : s);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Solo varietales simples (sin comas, excluye blends como "Malbec, Cabernet") */
export function getUniqueSingleVarietals(products: PublicProduct[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    const v = String(p.attributes?.varietal ?? "").trim();
    if (!v || v.includes(",")) continue;
    set.add(v);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
