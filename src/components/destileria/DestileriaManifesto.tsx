"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { DestileriaManifestoData } from "@/types/sections";

interface DestileriaManifestoProps {
  data: DestileriaManifestoData;
}

/** Full width, fondo oscuro, texto centrado; opcional carousel vertical de imágenes con bullets sutiles. */
export function DestileriaManifesto({ data }: DestileriaManifestoProps) {
  const { lines, images } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const count = images?.length ?? 0;

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setActiveIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(t);
  }, [count]);

  return (
    <section className="destileria-section bg-black " aria-label="Manifiesto Magic Stone">
      <div className="bg-white py-16 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 md:flex-row md:items-stretch md:gap-14">
          {images && images.length > 0 && (
            <div className="flex w-full shrink-0 flex-row items-center justify-center gap-3 md:order-1 md:w-[380px] md:max-w-[380px] md:justify-end">
              <div
                className="relative h-[280px] w-[210px] overflow-hidden rounded-lg sm:h-[320px] sm:w-[240px] md:h-[380px] md:w-[285px]"
                aria-roledescription="carousel"
                aria-label="Galería manifiesto"
              >
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateY(${(i - activeIndex) * 100}%)`,
                    }}
                    aria-hidden={i !== activeIndex}
                  >
                    <Image
                      src={img.imageSrc}
                      alt={img.imageAlt}
                      fill
                      className="object-cover"
                      sizes="285px"
                    />
                  </div>
                ))}
              </div>
              <div
                className="flex flex-col gap-1.5"
                role="tablist"
                aria-label="Seleccionar imagen"
              >
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Imagen ${i + 1}`}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-magic-stone-bg ${
                      i === activeIndex ? "scale-125 bg-magic-stone-primary/90" : "bg-black/20 hover:bg-black/40"
                    }`}  bg-magic-stone-primary 
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col justify-center text-center md:order-2 md:text-left border-l-2 border-magic-stone-primary pl-6">
            <ul className="space-y-4" role="list">
              {lines.map((line, i) => (
                <li
                  key={i}
                  className="font-heading text-xl font-medium text-black sm:text-2xl"
                  role="listitem"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
