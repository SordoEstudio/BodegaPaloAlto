"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductGrid } from "@/components/products/ProductGrid";
import { DEFAULT_CLIENT_SLUG, usePublicProducts } from "@/hooks/usePublicProducts";
import { getLocaleFromPathname } from "@/lib/i18n";
import { getUITranslations } from "@/lib/ui-translations";
import type { HomeProductosDestacadosData } from "@/types/sections";

interface HomeProductosDestacadosProps {
  data: HomeProductosDestacadosData;
}

export function HomeProductosDestacados({ data }: HomeProductosDestacadosProps) {
  const { sectionTitle } = data;
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPathname(pathname);
  const ui = getUITranslations(locale);
  const { products, loading } = usePublicProducts(DEFAULT_CLIENT_SLUG, {
    locale,
    limit: 8,
    featured: true,
  });

  const featuredProducts = products ?? [];
  if (!loading && featuredProducts.length === 0) return null;

  return (
    <section
      className="bg-header-bg px-6 py-16"
      aria-labelledby="productos-destacados-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="productos-destacados-heading"
          className="font-heading text-center text-2xl font-bold text-white sm:text-3xl"
        >
          {sectionTitle || (locale === "en" ? "Featured products" : "Productos destacados")}
        </h2>
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <div className="h-56 w-full animate-pulse bg-white/10" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-2/3 rounded bg-white/10" />
                    <div className="h-3 w-full rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid
              products={featuredProducts}
              locale={locale}
              featuredLabel={ui.productos.featured}
            />
          )}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/productos`}
            className="inline-flex text-sm font-semibold text-palo-alto-primary underline underline-offset-4 transition hover:opacity-80 focus:outline-none focus:ring-0"
          >
            {locale === "en" ? "View all products" : "Ver todos los productos"}
          </Link>
        </div>
      </div>
    </section>
  );
}
