import Image from "next/image";
import type { DestileriaPromiseData } from "@/types/sections";

interface DestileriaPromiseProps {
  data: DestileriaPromiseData;
}

/** Bloque centrado; fondo oscuro o imagen de fondo con overlay (parallax opcional). */
export function DestileriaPromise({ data }: DestileriaPromiseProps) {
  const { title, subtitle, lines, backgroundImage, backgroundImageAlt, parallax = false } = data;
  const hasBg = Boolean(backgroundImage?.trim());

  const content = (
    <div className="mx-auto max-w-3xl px-6 text-center">
      <h2
        id="destileria-promise-heading"
        className="font-heading text-2xl font-bold text-white sm:text-3xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg font-light italic text-white/95 sm:text-xl">{subtitle}</p>
      )}
      <div className="mt-10 space-y-6">
        {lines.map((line, i) => (
          <p key={i} className="text-xl font-light text-white/95 sm:text-2xl">
            {line}
          </p>
        ))}
      </div>
    </div>
  );

  if (hasBg) {
    return (
      <section
        className="destileria-section relative overflow-hidden py-16 md:py-24"
        aria-labelledby="destileria-promise-heading"
      >
        {parallax ? (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundAttachment: "fixed",
            }}
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 z-0" aria-hidden>
            <Image
              src={backgroundImage!}
              alt={backgroundImageAlt ?? ""}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        <div className="absolute inset-0 z-10 bg-magic-stone-bg/85" aria-hidden />
        <div className="relative z-20 py-20">{content}</div>
      </section>
    );
  }

  return (
    <section
      className="destileria-section py-16 md:py-24"
      aria-labelledby="destileria-promise-heading"
    >
      <div className="bg-background py-20">{content}</div>
    </section>
  );
}
