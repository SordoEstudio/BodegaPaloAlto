"use client";

import Image from "next/image";
import type { PublicProduct } from "@/hooks/usePublicProducts";

const PLACEHOLDER = "/placeholder-wine.svg";

interface ProductDetailHeroProps {
  product: PublicProduct;
}

export function ProductDetailHero({ product }: ProductDetailHeroProps) {
  const img = product.images?.[0];
  const src = img?.url || PLACEHOLDER;
  const alt = img?.alt || product.locale?.title || "";

  return (
    <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg bg-zinc-100">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-4"
        sizes="(max-width: 768px) 100vw, 28rem"
        priority
        unoptimized={src.startsWith("http")}
      />
    </div>
  );
}
