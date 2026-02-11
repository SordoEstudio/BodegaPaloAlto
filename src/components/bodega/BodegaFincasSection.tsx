import Image from "next/image";
import type { BodegaFincasSectionData, BodegaFincaData } from "@/types/sections";
import { BodegaFinca } from "./BodegaFinca";
import { BodegaFincasTabs } from "./BodegaFincasTabs";

interface BodegaFincasSectionProps {
  data: BodegaFincasSectionData;
  finca1: BodegaFincaData;
  finca2: BodegaFincaData;
}

export function BodegaFincasSection({
  data,
  finca1,
  finca2,
}: BodegaFincasSectionProps) {
  const { title, backgroundImage, layout } = data;
  const hasBg = !!backgroundImage?.imageSrc;
  const useTabs = layout === "tabs";
  const useTabsLightGlass = useTabs;

  const content = useTabs ? (
    <>
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-4">
        <h2
          id="fincas-heading"
          className="font-heading text-center text-2xl font-bold text-palo-alto-secondary sm:text-3xl"
        >
          {title}
        </h2>
      </div>
      <BodegaFincasTabs finca1={finca1} finca2={finca2} hasDarkBg={false} />
    </>
  ) : (
    <>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <h2
          id="fincas-heading"
          className={`font-heading text-center text-2xl font-bold sm:text-3xl ${hasBg ? "text-white" : "text-palo-alto-secondary"}`}
        >
          {title}
        </h2>
      </div>
      <BodegaFinca data={finca1} />
      <BodegaFinca data={finca2} />
    </>
  );

  if (useTabsLightGlass) {
    return (
      <section
        className="relative overflow-hidden py-16"
        aria-labelledby="fincas-heading"
      >
        <div
          className="absolute inset-0 bg-linear-to-b from-palo-alto-primary/5 to-palo-alto-secondary/5"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          {content}
        </div>
      </section>
    );
  }

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
      className="bg-palo-alto-secondary"
      aria-labelledby="fincas-heading"
    >
      {content}
    </section>
  );
}
