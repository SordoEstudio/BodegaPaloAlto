"use client";

import { ProductCard } from "./ProductCard";
import type { PublicProduct } from "@/hooks/usePublicProducts";

interface ProductGridProps {
  products: PublicProduct[];
  locale: string;
  featuredLabel?: string;
}

export function ProductGrid({ products, locale, featuredLabel }: ProductGridProps) {
  if (!products.length) return null;

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 [&>*]:min-w-0"
      role="list"
    >
      {products.map((product) => (
        <article key={product._id} className="flex min-w-0" role="listitem">
          <ProductCard
            product={product}
            locale={locale}
            featuredLabel={featuredLabel}
          />
        </article>
      ))}
    </div>
  );
}
