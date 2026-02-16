"use client";

import { useState } from "react";
import Image from "next/image";
import type { BodegaFincasSectionData, BodegaFincaData } from "@/types/sections";
import { DestileriaStorySplit } from "@/components/destileria/DestileriaStorySplit";

type FincaKey = "finca1" | "finca2";

interface BodegaFincasSectionProps {
  data: BodegaFincasSectionData;
  finca1: BodegaFincaData;
  finca2: BodegaFincaData;
}

/** Divide los párrafos en dos mitades para mostrar en dos bloques (imagen derecha → imagen izquierda). */
function splitParagraphs(paragraphs: string[]): [string[], string[]] {
  if (paragraphs.length <= 1) return [paragraphs, []];
  const mid = Math.ceil(paragraphs.length / 2);
  return [paragraphs.slice(0, mid), paragraphs.slice(mid)];
}

export function BodegaFincasSection({
  data,
  finca1,
  finca2,
}: BodegaFincasSectionProps) {
  const [selectedFinca, setSelectedFinca] = useState<FincaKey>("finca1");
  const { title, backgroundImage } = data;
  const hasBg = !!backgroundImage?.imageSrc;

  const fincas = { finca1, finca2 };
  const current = fincas[selectedFinca];
  const [firstHalf, secondHalf] = splitParagraphs(current.paragraphs);

  const content = (
    <>
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-6">
        <h2
          id="fincas-heading"
          className={`font-heading text-center text-2xl font-bold sm:text-3xl ${hasBg ? "text-white" : "text-palo-alto-secondary"}`}
        >
          {title}
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4" role="tablist" aria-label="Seleccionar finca">
          <button
            type="button"
            role="tab"
            aria-selected={selectedFinca === "finca1"}
            aria-controls="fincas-content"
            id="tab-finca1"
            onClick={() => setSelectedFinca("finca1")}
            className={`rounded-full px-6 py-2.5 font-medium transition-colors ${selectedFinca === "finca1"
              ? "bg-palo-alto-secondary text-white"
              : "bg-white/90 text-palo-alto-secondary hover:bg-white"
            }`}
          >
            {finca1.title}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedFinca === "finca2"}
            aria-controls="fincas-content"
            id="tab-finca2"
            onClick={() => setSelectedFinca("finca2")}
            className={`rounded-full px-6 py-2.5 font-medium transition-colors ${selectedFinca === "finca2"
              ? "bg-palo-alto-secondary text-white"
              : "bg-white/90 text-palo-alto-secondary hover:bg-white"
            }`}
          >
            {finca2.title}
          </button>
        </div>
      </div>
      <div id="fincas-content" role="tabpanel" aria-labelledby={`tab-${selectedFinca}`}>
        {firstHalf.length > 0 && (
          <DestileriaStorySplit
            data={{
              title: current.title,
              paragraphs: firstHalf,
              imageSrc: current.imageSrc,
              imageAlt: current.imageAlt,
              imagePosition: "right",
              paloalto: true,
            }}
          />
        )}
        {secondHalf.length > 0 && (
          <DestileriaStorySplit
            data={{
              paragraphs: secondHalf,
              paloalto: true,
              imageSrc: current.imageSrc2 ?? current.imageSrc,
              imageAlt: current.imageAlt2 ?? current.imageAlt,
              imagePosition: "left",
            }}
          />
        )}
      </div>
    </>
  );

  if (hasBg) {
    return (
      <section
        className="relative overflow-hidden bg-palo-alto-secondary"
        aria-labelledby="fincas-heading"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          aria-hidden
        >
          <Image
            src={backgroundImage!.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-1 bg-black/70" aria-hidden />
        {content}
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden py-16"
      aria-labelledby="fincas-heading"
    >
      <div
        className="absolute inset-0 bg-linear-to-b from-palo-alto-primary/5 to-palo-alto-secondary/5"
        aria-hidden
      />
      <div className="relative z-10">{content}</div>
    </section>
  );
}
