import Image from "next/image";
import type { BodegaFincaData } from "@/types/sections";

interface BodegaFincaProps {
  data: BodegaFincaData;
}

export function BodegaFinca({ data }: BodegaFincaProps) {
  const {
    id,
    title,
    location,
    description,
    features,
    imageSrc,
    imageAlt,
    backgroundImage,
    parallax,
  } = data;
  if (!title) return null;

  const hasBg = !!backgroundImage?.imageSrc;
  const useParallax = hasBg && parallax === true;

  const content = (
    <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 ">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {imageSrc ? (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-zinc-100">
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ) : null}
        <div className={imageSrc ? "" : "lg:col-span-2"}>
          <h2
            id={`finca-${id}-heading`}
            className={`font-heading text-2xl font-bold sm:text-3xl ${hasBg ? "text-white" : "text-palo-alto-secondary"}`}
          >
            {title}
          </h2>
          {location ? (
            <p
              className={`mt-2 text-sm font-medium ${hasBg ? "text-white/90" : "text-palo-alto-primary"}`}
            >
              {location}
            </p>
          ) : null}
          {description ? (
            <p
              className={`mt-3 text-base leading-relaxed ${hasBg ? "text-white/95" : "text-foreground/90"}`}
            >
              {description}
            </p>
          ) : null}
          {features?.length ? (
            <dl className="mt-4 space-y-2">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:gap-2">
                  <dt
                    className={`shrink-0 font-medium ${hasBg ? "text-white/90" : "text-palo-alto-secondary"}`}
                  >
                    {f.label}:
                  </dt>
                  <dd className={hasBg ? "text-white/95" : "text-foreground/90"}>
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (hasBg) {
    return (
      <section
        id={id}
        className="relative overflow-hidden border-t border-zinc-200 bg-palo-alto-secondary"
        aria-labelledby={`finca-${id}-heading`}
      >
        {useParallax ? (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage!.imageSrc})`,
              backgroundAttachment: "fixed",
            }}
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 z-0" aria-hidden>
            <Image
              src={backgroundImage!.imageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        <div className="absolute inset-0 z-1 bg-black/70" aria-hidden />
        {content}
      </section>
    );
  }

  return (
    <section
      id={id}
      className="bg-background border-t border-zinc-200"
      aria-labelledby={`finca-${id}-heading`}
    >
      {content}
    </section>
  );
}
