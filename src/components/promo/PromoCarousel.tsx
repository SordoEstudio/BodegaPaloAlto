"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PromoCarouselData, PromoCarouselSlide } from "@/types/sections";

interface PromoCarouselProps {
  data: PromoCarouselData;
  /** Altura mínima del carrusel (ej. "400px" o "50vh") */
  minHeight?: string;
  className?: string;
}

function SlideSoloImagen({
  slide,
}: {
  slide: Extract<PromoCarouselSlide, { tipo_slide: "solo_imagen" }>;
}) {
  const content = (
    <div className="relative h-full w-full">
      <Image
        src={slide.imageSrc}
        alt={slide.imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );

  if (slide.url) {
    return (
      <Link
        href={slide.url}
        className="block h-full w-full focus:outline-none"
        aria-label={slide.linkLabel ?? slide.imageAlt}
      >
        {content}
      </Link>
    );
  }
  return content;
}

function SlideImagenConTexto({
  slide,
  esDestileria,
}: {
  slide: Extract<PromoCarouselSlide, { tipo_slide: "imagen_con_texto" }>;
  esDestileria?: boolean;
}) {
  const hasText =
    slide.title || slide.subtitle || slide.detail || (slide.buttonLabel && slide.buttonUrl);

  const titleClass = esDestileria
    ? "font-destileria-hero text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl md:text-4xl"
    : "font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl";
  const buttonClass = esDestileria
    ? "mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-magic-stone-primary px-8 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 hover:shadow-xl focus:outline-none"
    : "mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-palo-alto-primary px-8 py-3 font-semibold text-palo-alto-secondary shadow-lg transition hover:opacity-90 hover:shadow-xl focus:outline-none";

  return (
    <div className="relative h-full w-full">
      {slide.imageSrc ? (
        <Image
          src={slide.imageSrc}
          alt={slide.imageAlt ?? ""}
          fill
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div
          className={`absolute inset-0 ${esDestileria ? "bg-magic-stone-bg" : "bg-palo-alto-secondary"}`}
          aria-hidden
        />
      )}
      {/* Overlay para legibilidad */}
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
      />
      {hasText && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 py-10 text-center text-white">
          {slide.title && (
            <h2 className={titleClass}>
              {slide.title}
            </h2>
          )}
          {slide.subtitle && (
            <p className="mt-2 text-lg font-medium opacity-95 sm:text-xl">
              {slide.subtitle}
            </p>
          )}
          {slide.detail && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed opacity-90 sm:text-lg">
              {slide.detail}
            </p>
          )}
          {slide.buttonLabel && slide.buttonUrl && (
            <Link
              href={slide.buttonUrl}
              className={buttonClass}
            >
              {slide.buttonLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function PromoCarousel({ data, minHeight = "400px", className = "" }: PromoCarouselProps) {
  const { slides, config } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalMs = (config.intervalo_segundos ?? 5) * 1000;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    if (!config.autoplay || slides.length <= 1) return;
    const id = setInterval(goNext, intervalMs);
    return () => clearInterval(id);
  }, [config.autoplay, slides.length, intervalMs, goNext]);

  if (!slides.length) return null;

  const showControls = slides.length > 1;

  return (
    <section
      className={`group/carousel relative w-full overflow-hidden rounded-xl ${className}`}
      aria-label="Carrusel de promociones"
      style={{ minHeight, height: minHeight }}
    >
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              opacity: i === currentIndex ? 1 : 0,
              pointerEvents: i === currentIndex ? "auto" : "none",
              zIndex: i === currentIndex ? 1 : 0,
            }}
            aria-hidden={i !== currentIndex}
          >
            {slide.tipo_slide === "solo_imagen" ? (
              <SlideSoloImagen slide={slide} />
            ) : (
              <SlideImagenConTexto slide={slide} esDestileria={slide.esDestileria} />
            )}
          </div>
        ))}
      </div>

      {showControls && (
        <>
          {/* Flechas: solo visibles en hover */}
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white opacity-0 transition-opacity duration-200 hover:bg-black/70 focus:opacity-100 focus:outline-none group-hover/carousel:opacity-100"
            aria-label="Slide anterior"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white opacity-0 transition-opacity duration-200 hover:bg-black/70 focus:opacity-100 focus:outline-none group-hover/carousel:opacity-100"
            aria-label="Slide siguiente"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicadores: solo visibles en hover */}
          <div
            className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100"
            role="tablist"
            aria-label="Diapositivas"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Ir a slide ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                className="h-2.5 w-2.5 rounded-full transition-colors focus:outline-none"
                style={{
                  backgroundColor: i === currentIndex ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
