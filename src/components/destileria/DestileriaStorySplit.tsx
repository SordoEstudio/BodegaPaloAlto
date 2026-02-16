import Image from "next/image";
import type { DestileriaStorySplitData } from "@/types/sections";

interface DestileriaStorySplitProps {
  data: DestileriaStorySplitData;
}

/** Texto + imagen 50/50 (desktop), stack en móvil. imagePosition: "right" = texto izq (default), "left" = imagen izq. */
export function DestileriaStorySplit({ data }: DestileriaStorySplitProps) {
  const { title, paragraphs, imageSrc, imageAlt, paloalto = false, imagePosition = "right" } = data;
  const hasTitle = typeof title === "string" && title.trim().length > 0;
  const sectionId = hasTitle ? `story-${title!.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "")}` : undefined;
  const imageAltText: string = (imageAlt ?? (typeof title === "string" ? title : "")) || "";
  const imageOnLeft = imagePosition === "left";
  const textOrder = imageOnLeft ? "lg:order-2" : "lg:order-1";
  const imageOrder = imageOnLeft ? "lg:order-1" : "lg:order-2";
  const textColor = paloalto ? "text-palo-alto-secondary" : "text-magic-stone-primary"

  return (
    <section className="destileria-section bg-background py-16 md:py-24" {...(sectionId ? { "aria-labelledby": sectionId } : {})}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className={`order-2 ${textOrder}`}>
            {hasTitle && (
              <h2
                id={sectionId}
                className={`font-heading text-2xl font-bold ${textColor} sm:text-3xl`}
              >
                {title}
              </h2>
            )}
            <div className={hasTitle ? "mt-6 space-y-4 leading-relaxed text-foreground/90" : "space-y-4 leading-relaxed text-foreground/90"}>
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          {imageSrc && (
            <div className={`relative order-1 aspect-4/3 overflow-hidden rounded-lg bg-zinc-100 ${imageOrder}`}>
              <Image
                src={imageSrc}
                alt={imageAltText}
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
