"use client";

import Image from "next/image";
import { useState } from "react";
import type { BodegaFincaData } from "@/types/sections";
import { ChevronRight } from "lucide-react";

interface BodegaFincasTabsProps {
  finca1: BodegaFincaData;
  finca2: BodegaFincaData;
  /** Si la sección tiene fondo oscuro (para colores de texto) */
  hasDarkBg?: boolean;
}

interface ImageExpandZoneProps {
  imageSrc: string | undefined;
  imageAlt: string | undefined;
  title: string;
  hasDarkBg: boolean;
}

const GUARDA_WIDTH = 180;

function ImageExpandZone({ imageSrc, imageAlt, title, hasDarkBg }: ImageExpandZoneProps) {
  const [expanded, setExpanded] = useState(false);

  const clipPathCollapsed = `inset(0 calc(100% - ${GUARDA_WIDTH}px) 0 0 round 0.5rem)`;
  const clipPathExpanded = "inset(0 0 0 0 round 0.5rem)";

  return (
    <div
      className="group/zone relative z-10 flex shrink-0 lg:absolute lg:left-0 lg:right-0 lg:top-6 lg:bottom-6 lg:flex-none"
      onMouseLeave={() => setExpanded(false)}
    >
      {imageSrc ? (
        <>
          {/* Una sola imagen: se muestra como guarda (solo los primeros 180px) y se extiende desde ahí hacia la derecha */}
          <div
            className="relative hidden h-full overflow-hidden rounded-lg bg-zinc-100 shadow-lg ring-1 ring-black/5 lg:absolute lg:left-6 lg:top-6 lg:bottom-6 lg:block"
            style={{
              width: "calc(100% - 1.5rem)",
              clipPath: expanded ? clipPathExpanded : clipPathCollapsed,
              transition: "clip-path 0.5s ease-out",
              pointerEvents: expanded ? "auto" : "none",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image
                src={imageSrc}
                alt={imageAlt ?? title}
                fill
                className="object-cover object-left"
                sizes="100vw"
              />
            </div>
          </div>
          {/* Chevron sobre el borde derecho de la guarda; se oculta en hover o al expandir */}
          <span
            className={`absolute left-51 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white/80 drop-shadow-md transition-opacity duration-200 lg:flex ${expanded ? "opacity-0" : "opacity-100 group-hover/zone:opacity-0"}`}
            aria-hidden
          >
            <ChevronRight className="h-5 w-5 opacity-90" />
          </span>
          {/* Zona de interacción guarda (primeros 180px): hover/clic extiende */}
          <div
            className="absolute left-6 top-6 bottom-6 z-20 hidden w-[180px] cursor-pointer lg:block"
            onMouseEnter={() => setExpanded(true)}
            role="button"
            tabIndex={0}
            onClick={() => setExpanded((e) => !e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setExpanded((x) => !x);
              }
            }}
            aria-label="Extender imagen hacia la derecha"
          />
          {/* En móvil: misma imagen como bloque de 180px sin extender */}
          <div className="relative h-[280px] w-full max-w-[200px] overflow-hidden rounded-lg bg-zinc-100 shadow-lg ring-1 ring-black/5 lg:hidden">
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              className="object-cover object-left"
              sizes={`${GUARDA_WIDTH}px`}
            />
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2 text-white/80 drop-shadow-md lg:hidden" aria-hidden>
              <ChevronRight className="h-5 w-5 opacity-90" />
            </span>
          </div>
        </>
      ) : (
        <div
          className={`relative flex h-[280px] w-full max-w-[200px] items-center justify-center rounded-lg lg:absolute lg:left-6 lg:top-6 lg:bottom-6 lg:h-auto lg:w-[180px] ${hasDarkBg ? "bg-white/10" : "bg-zinc-100"}`}
          aria-hidden
        >
          <span className={`font-heading text-2xl font-semibold ${hasDarkBg ? "text-white/50" : "text-palo-alto-primary/40"}`}>
            {title}
          </span>
        </div>
      )}
    </div>
  );
}

export function BodegaFincasTabs({
  finca1,
  finca2,
  hasDarkBg = false,
}: BodegaFincasTabsProps) {
  const [activeId, setActiveId] = useState<string>(finca1.id);
  const active = activeId === finca1.id ? finca1 : finca2;
  const titleClass = hasDarkBg
    ? "text-white"
    : "text-palo-alto-secondary";
  const metaClass = hasDarkBg ? "text-white/90" : "text-palo-alto-primary";
  const textClass = hasDarkBg ? "text-white/95" : "text-foreground/90";
  const tabBase =
    "font-heading px-5 py-3 text-lg font-semibold transition-colors duration-200 rounded-t-xl focus:outline-none focus:ring-0";
  const tabInactive = hasDarkBg
    ? "text-white/80 hover:text-white hover:bg-white/10"
    : "text-palo-alto-secondary/80 hover:text-palo-alto-secondary hover:bg-palo-alto-primary/10";
  const tabActive = hasDarkBg
    ? "text-white bg-white/15"
    : "text-palo-alto-secondary bg-background -mb-px";

  return (
    <div
      className="relative z-10 mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/50 bg-white/75 py-6 shadow-xl shadow-palo-alto-secondary/10 backdrop-blur-md"
      style={{ boxShadow: "0 8px 32px rgba(59, 35, 25, 0.08), 0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="px-6">
        {/* Pestañas */}
        <div
          className="flex gap-1 border-b border-zinc-200/80"
          role="tablist"
          aria-label="Selección de fincas"
        >
        <button
          type="button"
          role="tab"
          aria-selected={activeId === finca1.id}
          aria-controls="finca-panel"
          id="tab-finca-1"
          className={`${tabBase} ${activeId === finca1.id ? tabActive : tabInactive}`}
          onClick={() => setActiveId(finca1.id)}
        >
          {finca1.title}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeId === finca2.id}
          aria-controls="finca-panel"
          id="tab-finca-2"
          className={`${tabBase} ${activeId === finca2.id ? tabActive : tabInactive}`}
          onClick={() => setActiveId(finca2.id)}
        >
          {finca2.title}
        </button>
      </div>

      {/* Contenido: imagen (guarda) a la izquierda, texto a la derecha; al hover en la guarda la imagen se extiende hacia la derecha sobre el texto */}
      <div
        id="finca-panel"
        role="tabpanel"
        aria-labelledby={activeId === finca1.id ? "tab-finca-1" : "tab-finca-2"}
        className="group/panel relative mt-0 flex flex-col gap-8 overflow-visible p-6 lg:flex-row lg:items-stretch"
      >
        {/* Zona de imagen a la izquierda (guarda que se extiende a la derecha) */}
        <ImageExpandZone
          imageSrc={active.imageSrc}
          imageAlt={active.imageAlt}
          title={active.title}
          hasDarkBg={hasDarkBg}
        />
        <div className="relative z-0 min-w-0 flex-1 lg:pl-[216px]">
          <h3 className={`font-heading text-xl font-bold sm:text-2xl ${titleClass} mb-2`}>
            {active.title}
          </h3>
          {active.location ? (
            <p className={`mt-2 text-sm font-medium ${metaClass}`}>
              {active.location}
            </p>
          ) : null}
          {active.description ? (
            <p className={`mt-3 text-base leading-relaxed ${textClass}`}>
              {active.description}
            </p>
          ) : null}
          {active.features?.length ? (
            <dl className="mt-4 space-y-2">
              {active.features.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-0.5 sm:flex-row sm:gap-2"
                >
                  <dt
                    className={`shrink-0 font-medium ${hasDarkBg ? "text-white/90" : "text-palo-alto-secondary"}`}
                  >
                    {f.label}:
                  </dt>
                  <dd className={textClass}>{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
      </div>
    </div>
  );
}
