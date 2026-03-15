"use client";

import Image from "next/image";
import type { LineaItem } from "@/types/sections";
import { lineaToSlug } from "@/lib/product-utils";

const DEFAULT_HEADER_IMAGE = "/1.jpg";

interface ProductosLineasSectionProps {
  lineas: LineaItem[];
  currentLinea?: string;
  onLineaClick?: (slug: string | null) => void;
  pageTitle?: string;
  pageSubtitle?: string;
  /** Imagen de fondo del header. Si no se pasa, usa gradiente. */
  backgroundImage?: string | null;
}

export function ProductosLineasSection({
  lineas,
  currentLinea,
  onLineaClick,
  pageTitle,
  pageSubtitle,
  backgroundImage = DEFAULT_HEADER_IMAGE,
}: ProductosLineasSectionProps) {
  if (!lineas?.length && !pageTitle) return null;

  const hasBgImage = backgroundImage?.trim();

  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-header-bg px-6 py-12 sm:py-16"
      aria-label="Líneas de productos"
    >
      {/* Imagen de fondo o gradiente oscuro */}
      <div className="absolute inset-0">
        {hasBgImage ? (
          <Image
            src={backgroundImage!}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(160deg, var(--header-bg) 0%, var(--palo-alto-secondary) 40%, #1a1412 100%)",
            }}
          />
        )}
      </div>
      {/* Overlay igual que hero home: bg-black/70 */}
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      {/* Contenido */}
      <div className="relative z-10 mx-auto max-w-6xl">
        {(pageTitle || pageSubtitle) && (
          <div className="mb-6">
            {pageTitle && (
              <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                {pageTitle}
              </h1>
            )}
            {pageSubtitle && (
              <p className="mt-2 text-white/95">{pageSubtitle}</p>
            )}
          </div>
        )}
        {lineas?.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {lineas.map((linea) => {
            const slug = lineaToSlug(linea.name);
            const isActive = currentLinea === slug;
            const handleClick = () => {
              if (onLineaClick) onLineaClick(isActive ? null : slug);
            };
            return (
              <button
                key={linea.id}
                type="button"
                onClick={handleClick}
                className={`group flex items-center justify-center rounded-xl border p-2 transition focus:outline-none ${
                  isActive
                    ? "border-palo-alto-primary bg-white/10 shadow ring-1 ring-palo-alto-primary/30 backdrop-blur-sm"
                    : "border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30"
                }`}
              >
                <span className="relative block h-[50px] w-[80px] overflow-hidden rounded sm:h-[60px] sm:w-[100px]">
                  <Image
                    src={linea.imageSrc}
                    alt={linea.imageAlt}
                    width={100}
                    height={60}
                    className="object-contain transition group-hover:scale-105"
                  />
                </span>
              </button>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
