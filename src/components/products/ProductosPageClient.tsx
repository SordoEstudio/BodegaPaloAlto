"use client";

import { useState, useCallback } from "react";
import { usePublicProducts, DEFAULT_CLIENT_SLUG } from "@/hooks/usePublicProducts";
import { getUITranslations } from "@/lib/ui-translations";
import { getHomeCarouselLineasData } from "@/lib/data";
import {
  filterProducts,
  sortProductsWithFeatured,
  type ProductFiltersState,
} from "@/lib/product-utils";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters } from "./ProductFilters";
import { ProductPagination } from "./ProductPagination";
import { ProductosLineasSection } from "./ProductosLineasSection";
import { isValidLocale } from "@/lib/i18n";

const LIMIT = 50;

const initialFilters: ProductFiltersState = {};

export function ProductosPageClient({ locale }: { locale: string }) {
  const loc = isValidLocale(locale) ? locale : "es";
  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);
  const [page, setPage] = useState(1);

  const updateFilters = useCallback((updates: Partial<ProductFiltersState>) => {
    setFilters((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined || v === "") delete next[k as keyof ProductFiltersState];
        else (next as Record<string, unknown>)[k] = v;
      }
      return next;
    });
    setPage(1);
  }, []);

  const { products, pagination, loading, error } = usePublicProducts(
    DEFAULT_CLIENT_SLUG,
    {
      locale: loc,
      page,
      limit: LIMIT,
    }
  );

  const ui = getUITranslations(loc);

  const rawProducts = products ?? [];
  const filteredProducts = filterProducts(rawProducts, filters);
  const sortedProducts = sortProductsWithFeatured(filteredProducts);

  if (error) {
    return (
      <div className="min-h-screen bg-header-bg">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const lineasData = getHomeCarouselLineasData(loc);

  return (
    <div className="min-h-screen bg-header-bg">
      <ProductosLineasSection
        pageTitle={ui.productos.pageTitle}
        pageSubtitle={ui.productos.pageSubtitle}
        lineas={lineasData.lineas}
        currentLinea={filters.linea}
        onLineaClick={(slug) => updateFilters({ linea: slug ?? undefined })}
      />

      <ProductFilters
        products={rawProducts}
        locale={loc}
        ui={ui.productos}
        filters={filters}
        onFiltersChange={updateFilters}
      />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="min-w-0">
            {loading ? (
              <p className="py-12 text-center text-white/70">
                {ui.productos.loading}
              </p>
            ) : sortedProducts.length === 0 ? (
              <p className="py-12 text-center text-white/80">
                {ui.productos.empty}
              </p>
            ) : (
              <>
                <ProductGrid
                  products={sortedProducts}
                  locale={loc}
                  featuredLabel={ui.productos.featured}
                />
                {pagination && (
                  <ProductPagination
                    pagination={pagination}
                    locale={loc}
                    ui={ui.productos}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
}
