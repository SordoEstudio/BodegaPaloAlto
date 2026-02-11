import Image from "next/image";
import type { DestileriaTextHighlightData } from "@/types/sections";

interface DestileriaTextHighlightProps {
  data: DestileriaTextHighlightData;
}

/** Bloque de texto: título opcional, párrafo(s), cita opcional. Fondo con imagen y parallax opcionales; alineación opcional. */
export function DestileriaTextHighlight({ data }: DestileriaTextHighlightProps) {
  const {
    title,
    body,
    highlightQuote,
    backgroundImage,
    backgroundImageAlt,
    parallax = false,
    textAlign = "left",
  } = data;

  const hasBg = Boolean(backgroundImage?.trim());
  const alignClass =
    textAlign === "center" ? "text-center" : textAlign === "right" ? "text-right" : "text-left";
  const sectionId = title
    ? `highlight-${title.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "")}`
    : undefined;

  const content = (
    <div className={`mx-auto max-w-3xl px-6 ${alignClass}`}>
      {title && (
        <h2
          id={sectionId}
          className="font-heading text-2xl font-bold text-magic-stone-primary sm:text-3xl"
        >
          {title}
        </h2>
      )}
      <div className={`mt-6 space-y-4 leading-relaxed text-foreground/90`}>
        {body?.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {highlightQuote && (
        <blockquote
          className="mt-10 border-l-4 border-magic-stone-primary pl-6 font-heading text-lg italic text-foreground sm:text-xl"
          cite=""
        >
          {highlightQuote}
        </blockquote>
      )}
    </div>
  );

  if (hasBg) {
    return (
      <section
        className="destileria-section relative overflow-hidden py-16 md:py-24"
        aria-labelledby={sectionId}
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
        <div className="absolute inset-0 z-10 bg-black/60" aria-hidden />
          <div className={`relative z-20 [&_h2]:text-white! [&_p]:text-white/95! [&_blockquote]:text-white/95! ${
            textAlign === "right"
              ? "[&_blockquote]:border-r-4 [&_blockquote]:border-r-magic-stone-primary! [&_blockquote]:border-l-0"
              : "[&_blockquote]:border-l-4 [&_blockquote]:border-l-magic-stone-primary! [&_blockquote]:border-r-0"
          }`}>
          {content}
        </div>
      </section>
    );
  }

  return (
    <section
      className="destileria-section bg-background py-16 md:py-24"
      aria-labelledby={sectionId}
    >
      {content}
    </section>
  );
}
