import Image from "next/image";
import type { DestileriaStorySplitData } from "@/types/sections";

interface DestileriaStorySplitProps {
  data: DestileriaStorySplitData;
}

/** Texto + imagen 50/50 (desktop), stack en móvil. imagePosition: "right" = texto izq (default), "left" = imagen izq. */
export function DestileriaStorySplit({ data }: DestileriaStorySplitProps) {
  const { title, body, imageSrc, imageAlt, imagePosition = "right" } = data;
  const sectionId = `story-${title.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "")}`;
  const imageOnLeft = imagePosition === "left";
  const textOrder = imageOnLeft ? "lg:order-2" : "lg:order-1";
  const imageOrder = imageOnLeft ? "lg:order-1" : "lg:order-2";

  return (
    <section className="destileria-section bg-background py-16 md:py-24" aria-labelledby={sectionId}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className={`order-2 ${textOrder}`}>
            <h2
              id={sectionId}
              className="font-heading text-2xl font-bold text-magic-stone-primary sm:text-3xl"
            >
              {title}
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-foreground/90">
              {body.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          {imageSrc && (
            <div className={`relative order-1 aspect-4/3 overflow-hidden rounded-lg bg-zinc-100 ${imageOrder}`}>
              <Image
                src={imageSrc}
                alt={imageAlt ?? title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
