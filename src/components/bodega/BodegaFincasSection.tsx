import Image from "next/image";
import type { BodegaFincasSectionData, BodegaFincaData } from "@/types/sections";
import { BodegaFinca } from "./BodegaFinca";

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
  const { title, backgroundImage } = data;
  const hasBg = !!backgroundImage?.imageSrc;

  const content = (
    <>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 ">
        <h2
          id="fincas-heading"
          className={`font-heading text-center text-2xl font-bold sm:text-3xl text-white`}
        >
          {title}
        </h2>
      </div>
      <BodegaFinca data={finca1} />
      <BodegaFinca data={finca2} />
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
        {/* Overlay oscuro, misma estética que Quiénes somos / hero */}
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
