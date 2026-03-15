"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "@/hooks/usePublicProducts";
import { getColorDisplayLabel, type ProductosTranslations } from "@/lib/ui-translations";

const PLACEHOLDER = "/placeholder-wine.svg";
const CAROUSEL_INTERVAL_MS = 5000;

interface ProductDetailProps {
  product: PublicProduct;
  locale: string;
  ui: ProductosTranslations;
}

export function ProductDetail({ product, locale, ui }: ProductDetailProps) {
  const attrs = product.attributes ?? {};
  const images = (product.images ?? []).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const vista = String(attrs.vista ?? "").trim();
  const nariz = String(attrs.nariz ?? "").trim();
  const boca = String(attrs.boca ?? "").trim();
  const hasNotasCata = vista || nariz || boca;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasCarousel = images.length > 1;

  useEffect(() => {
    if (!hasCarousel || !images.length) return;
    const id = setInterval(() => {
      setCurrentImageIndex((i) => (i + 1) % images.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasCarousel, images.length]);

  const attributeLabels: Record<string, string> = {
    linea: ui.filters.linea,
    color: ui.filters.color,
    varietal: ui.filters.varietal,
    crianza: ui.filters.crianza,
    corte: ui.filters.blend,
    dosaje: "Dosaje",
    metodo: "Método",
    metodo_elaboracion: "Método",
  };

  const attributeKeys = ["linea", "color", "varietal", "crianza", "corte", "dosaje", "metodo", "metodo_elaboracion"] as const;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href={`/${locale}/productos`}
        className="mb-6 inline-block text-sm text-palo-alto-primary underline hover:no-underline focus:outline-none"
      >
        ← {ui.backToProducts}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start lg:z-30">
          {images.length > 0 ? (
            <div className="space-y-4">
              <div className="relative aspect-3/4 w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80">
                {hasCarousel ? (
                  images.map((img, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                      style={{
                        opacity: i === currentImageIndex ? 1 : 0,
                        zIndex: i === currentImageIndex ? 1 : 0,
                      }}
                      aria-hidden={i !== currentImageIndex}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || product.locale?.title || ""}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 28rem"
                        priority={i === 0}
                        unoptimized={img.url.startsWith("http")}
                      />
                    </div>
                  ))
                ) : (
                  <Image
                    src={images[0].url}
                    alt={images[0].alt || product.locale?.title || ""}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 28rem"
                    priority
                    unoptimized={images[0].url.startsWith("http")}
                  />
                )}
                {hasCarousel && (
                  <>
                    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2" role="tablist">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          role="tab"
                          aria-selected={i === currentImageIndex}
                          aria-label={`Imagen ${i + 1}`}
                          onClick={() => setCurrentImageIndex(i)}
                          className="h-2 w-2 rounded-full transition-colors sm:h-2.5 sm:w-2.5"
                          style={{
                            backgroundColor:
                              i === currentImageIndex
                                ? "rgba(196, 153, 108, 0.9)"
                                : "rgba(255,255,255,0.4)",
                          }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)
                      }
                      className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/90 transition hover:bg-black/70 focus:outline-none"
                      aria-label="Anterior"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentImageIndex((i) => (i + 1) % images.length)
                      }
                      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/90 transition hover:bg-black/70 focus:outline-none"
                      aria-label="Siguiente"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="relative aspect-3/4 w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80">
              <Image
                src={PLACEHOLDER}
                alt=""
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 28rem"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              {product.locale?.title ?? ""}
            </h1>
            {(() => {
              const parts = [String(attrs.varietal ?? "")].filter(Boolean);
              return parts.length > 0 ? (
                <p className="mt-2 text-white/80">{parts.join(" · ")}</p>
              ) : null;
            })()}
          </div>

          {product.locale?.description && (
            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold text-white">
                {ui.detail.descripcion}
              </h2>
              <div className="prose prose-invert max-w-none text-sm">
                {product.locale.description.split("\n\n").map((p, i) => (
                  <p key={i} className="mb-2 text-white/90">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}

          {hasNotasCata && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h2 className="mb-3 font-heading text-lg font-semibold text-white">
                {ui.detail.notasCata}
              </h2>
              <dl className="space-y-3">
                {vista && (
                  <div>
                    <dt className="text-sm font-medium text-white/70">
                      {ui.detail.vista}
                    </dt>
                    <dd className="mt-1 text-sm text-white/90">{vista}</dd>
                  </div>
                )}
                {nariz && (
                  <div>
                    <dt className="text-sm font-medium text-white/70">
                      {ui.detail.nariz}
                    </dt>
                    <dd className="mt-1 text-sm text-white/90">{nariz}</dd>
                  </div>
                )}
                {boca && (
                  <div>
                    <dt className="text-sm font-medium text-white/70">
                      {ui.detail.boca}
                    </dt>
                    <dd className="mt-1 text-sm text-white/90">{boca}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              {ui.detail.atributos}
            </h2>
            <dl className="space-y-2">
              {attributeKeys.map((key) => {
                const val = attrs[key];
                if (val == null || String(val).trim() === "") return null;
                const label = attributeLabels[key] ?? key;
                const displayVal = key === "color" ? getColorDisplayLabel(String(val), locale) : String(val);
                return (
                  <div key={key} className="flex gap-2">
                    <dt className="w-24 shrink-0 text-sm font-medium text-white/70">
                      {label}:
                    </dt>
                    <dd className="text-sm text-white/90">{displayVal}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {product.attachments?.length ? (
            <div>
              <h2 className="mb-2 font-heading text-lg font-semibold text-white">
                {ui.detail.fichaTecnica}
              </h2>
              <div className="flex flex-wrap gap-2">
                {(product.attachments as { label?: string; external_url?: string; file_url?: string }[]).map(
                  (a, i) => {
                    const url = a.external_url ?? a.file_url;
                    if (!url) return null;
                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded bg-palo-alto-primary px-4 py-2 text-sm font-medium text-palo-alto-secondary hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 focus:ring-offset-zinc-900"
                      >
                        {a.label ?? "PDF"}
                      </a>
                    );
                  }
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
