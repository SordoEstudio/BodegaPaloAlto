"use client";

import type { PublicProduct } from "@/hooks/usePublicProducts";
import type { ProductFiltersState } from "@/lib/product-utils";
import { getUniqueAttributeValues, getUniqueSingleVarietals } from "@/lib/product-utils";
import { getColorDisplayLabel, type ProductosTranslations } from "@/lib/ui-translations";

interface ProductFiltersProps {
  products: PublicProduct[];
  locale: string;
  ui: ProductosTranslations;
  filters: ProductFiltersState;
  onFiltersChange: (updates: Partial<ProductFiltersState>) => void;
}

export function ProductFilters({ products, locale, ui, filters, onFiltersChange }: ProductFiltersProps) {
  const colors = getUniqueAttributeValues(products, "color");
  const varietals = getUniqueSingleVarietals(products);
  const crianzas = getUniqueAttributeValues(products, "crianza");

  const hasBlends = products.some((p) => {
    const v = String(p.attributes?.varietal ?? "");
    return v.includes(",") || p.attributes?.corte === "Sí";
  });

  const currentProductType = filters.productType ?? "";
  const currentColor = filters.color ?? "";
  const currentVarietal = filters.varietal ?? "";
  const currentBlend = filters.blend === true;
  const currentCrianza = filters.crianza ?? "";

  const hasActiveFilters =
    currentProductType ||
    currentColor ||
    currentVarietal ||
    currentBlend ||
    currentCrianza;

  return (
    <div
      className="sticky top-16 z-40 w-full border-b border-white/10 bg-header-bg px-6 py-4 shadow-lg shadow-black/20 sm:top-18"
      role="search"
      aria-label="Filtros de productos"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-end gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-white/70">
            {ui.filters.productType}:
          </span>
          {(["vinos", "espumantes", "gin"] as const).map((key) => {
            const selected = currentProductType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  onFiltersChange({ productType: selected ? undefined : key })
                }
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition focus:outline-none ${
                  selected
                    ? "bg-palo-alto-primary text-palo-alto-secondary"
                    : "border border-white/20 bg-white/5 text-white/90 backdrop-blur-sm hover:bg-white/10 hover:border-white/30"
                }`}
              >
                {ui.productTypes[key]}
              </button>
            );
          })}
        </div>

        {colors.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-white/70">
              {ui.filters.color}:
            </span>
            {colors.map((c) => {
              const slug = c.toLowerCase().replace(/\s+/g, "-");
              const selected = currentColor === slug || currentColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    onFiltersChange({ color: selected ? undefined : slug })
                  }
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition focus:outline-none ${
                    selected
                      ? "bg-palo-alto-primary text-palo-alto-secondary"
                      : "border border-white/20 bg-white/5 text-white/90 backdrop-blur-sm hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  {getColorDisplayLabel(c, locale)}
                </button>
              );
            })}
          </div>
        )}

        {(varietals.length > 0 || hasBlends) && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-white/70">
              {ui.filters.varietal}:
            </label>
            <select
              value={currentBlend ? "__blend__" : currentVarietal}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "__blend__") {
                  onFiltersChange({ varietal: undefined, blend: true });
                } else if (val) {
                  onFiltersChange({ varietal: val, blend: undefined });
                } else {
                  onFiltersChange({ varietal: undefined, blend: undefined });
                }
              }}
              className="rounded border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white backdrop-blur-sm focus:border-palo-alto-primary focus:outline-none [&>option]:bg-header-bg [&>option]:text-white"
            >
              <option value="">{locale === "es" ? "Todos" : "All"}</option>
              {hasBlends && (
                <option value="__blend__">{ui.filters.blend}</option>
              )}
              {varietals.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        )}

        {crianzas.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-white/70">
              {ui.filters.crianza}:
            </label>
            <select
              value={currentCrianza}
              onChange={(e) =>
                onFiltersChange({ crianza: e.target.value || undefined })
              }
              className="rounded border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white backdrop-blur-sm focus:border-palo-alto-primary focus:outline-none [&>option]:bg-header-bg [&>option]:text-white"
            >
              <option value="">{locale === "es" ? "Todas" : "All"}</option>
              {crianzas.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() =>
              onFiltersChange({
                productType: undefined,
                color: undefined,
                varietal: undefined,
                blend: undefined,
                crianza: undefined,
              })
            }
            className="text-sm text-palo-alto-primary underline hover:no-underline focus:outline-none"
          >
            {ui.filters.clearAll}
          </button>
        )}
      </div>
    </div>
  );
}
