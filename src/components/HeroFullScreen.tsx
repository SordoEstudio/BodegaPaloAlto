"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface HeroSlide {
  imageSrc: string;
  imageAlt: string;
}

type HeroFullScreenProps = {
  /** Carrusel de imágenes. Si tiene un solo ítem, se muestra fijo; si tiene varios, rota automáticamente. */
  slides?: HeroSlide[];
  /** Una sola imagen (alternativa a slides). Si no hay slides ni imageSrc, se usa gradiente. */
  imageSrc?: string;
  imageAlt?: string;
  /** Contenido sobre el hero (título, subtítulo). Se muestra sobre un overlay para legibilidad. */
  children: React.ReactNode;
  contentClassName?: string;
};

const ROTATE_INTERVAL_MS = 5000;

/**
 * Hero a pantalla completa: carrusel de imágenes o imagen única, con overlay para el texto.
 */
export function HeroFullScreen({
  slides,
  imageSrc,
  imageAlt = "Bodega Palo Alto",
  children,
  contentClassName = "",
}: HeroFullScreenProps) {
  const hasCarousel = slides && slides.length > 1;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!hasCarousel || !slides?.length) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % slides.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasCarousel, slides?.length]);

  const effectiveSlides: HeroSlide[] =
    slides?.length
      ? slides
      : imageSrc
        ? [{ imageSrc, imageAlt }]
        : [];

  return (
    <section
      className="relative flex min-h-[calc(100dvh-4.5rem)] w-full flex-col overflow-hidden pb-[22rem]"
      aria-label="Sección principal"
    >
      {/* Fondo: gradiente por defecto */}
      <div
        className="absolute inset-0 bg-palo-alto-secondary"
        aria-hidden
      />

      {/* Imágenes: carrusel o única */}
      {effectiveSlides.length > 0 ? (
        effectiveSlides.map((slide, i) => (
          <div
            key={`${slide.imageSrc}-${i}`}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: hasCarousel ? (i === currentIndex ? 1 : 0) : 1,
              zIndex: 0,
            }}
            aria-hidden={hasCarousel ? i !== currentIndex : false}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))
      ) : (
        <div
          className="absolute inset-0 opacity-85"
          style={{
            background:
              "linear-gradient(160deg, var(--palo-alto-secondary) 0%, #5c3526 40%, var(--palo-alto-primary) 100%)",
          }}
          aria-hidden
        />
      )}

      {/* Overlay para legibilidad del texto (sin glassmorphism) */}
      <div
        className="absolute inset-0 bg-black/70"
        aria-hidden
      />

      {/* Contenido centrado en el espacio entre header y carrusel */}
      <div
        className={`relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12 text-center ${contentClassName}`}
      >
        <div className="w-full max-w-2xl">{children}</div>
      </div>

      {/* Indicadores del carrusel (solo si hay más de una imagen) */}
      {hasCarousel && slides && slides.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2"
          role="tablist"
          aria-label="Diapositivas del carrusel"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Ir a imagen ${i + 1}`}
              className="h-2 w-2 rounded-full transition-colors sm:h-2.5 sm:w-2.5"
              style={{
                backgroundColor: i === currentIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
              }}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
