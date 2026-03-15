"use client";

import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "@/hooks/usePublicProducts";
import { isBlend, isEspumante } from "@/lib/product-utils";

interface ProductCardProps {
  product: PublicProduct;
  locale: string;
  featuredLabel?: string;
  blendLabel?: string;
}

const PLACEHOLDER_IMAGE = "/placeholder-wine.svg";

export function ProductCard({ product, locale, featuredLabel = "Destacado", blendLabel = "Blend" }: ProductCardProps) {
  const img = product.images?.[0];
  const src = img?.url || PLACEHOLDER_IMAGE;
  const alt = img?.alt || product.locale?.title || "";
  const attrs = product.attributes ?? {};
  const linea = String(attrs.linea ?? "").trim();
  const varietalRaw = String(attrs.varietal ?? "").trim();
  const dosaje = String(attrs.dosaje ?? "").trim();
  const espumante = isEspumante(product);
  const varietal = espumante
    ? varietalRaw.replace(/, /g, " · ")
    : isBlend(product)
      ? blendLabel
      : varietalRaw.replace(/, /g, " · ");
  const crianza = String(attrs.crianza ?? "").trim();

  return (
    <Link
      href={`/${locale}/productos/${product.slug}`}
      className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:border-palo-alto-primary/60 hover:bg-white/10 hover:shadow-xl hover:shadow-black/30 focus:outline-none"
    >
      <span className="relative flex aspect-[3/4] w-full shrink-0 items-center justify-center overflow-hidden bg-zinc-900/80">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-2 transition group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized={src.startsWith("http")}
        />
        {product.featured && (
          <span className="absolute right-2 top-2 rounded bg-palo-alto-primary px-2 py-0.5 text-xs font-semibold text-palo-alto-secondary">
            {featuredLabel}
          </span>
        )}
      </span>
      <div className="flex min-h-[88px] flex-col justify-end p-3">
        {linea && (
          <p className="mt-1 text-base font-semibold text-white/95">
            {linea}
          </p>
        )}
        {varietal && (
          <p className="mt-0.5 text-sm text-white/80">
            {varietal}
          </p>
        )}
        {espumante && dosaje && (
          <p className="mt-0.5 text-xs text-white/70">
            {dosaje}
          </p>
        )}
        {crianza && (
          <p className="mt-0.5 text-xs text-white/60">
            {crianza}
          </p>
        )}
      </div>
    </Link>
  );
}
