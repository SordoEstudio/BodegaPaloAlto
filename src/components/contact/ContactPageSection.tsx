"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { ContactForm } from "@/components/contact/ContactForm";
import type { ContactPageData } from "@/types/sections";

interface ContactPageSectionProps {
  data: ContactPageData;
  locale: string;
  sourcePage?: string;
}

/** Bloque de datos: título y enlaces/dirección uno debajo del otro */
function ContactBlockStack({
  block,
  onDark,
}: {
  block: { title: string; facebookUrl?: string; instagramUrl?: string; address?: string; addressUrl?: string };
  onDark: boolean;
}) {
  const titleClass = onDark
    ? "font-heading text-lg font-bold text-white sm:text-xl"
    : "font-heading text-lg font-bold text-palo-alto-secondary sm:text-xl";
  const textClass = onDark ? "text-white/95" : "text-foreground/90";
  const linkClass = onDark
    ? "inline-flex items-center gap-2 transition hover:text-palo-alto-primary focus:outline-none focus:ring-0"
    : "inline-flex items-center gap-2 text-foreground/90 transition hover:text-palo-alto-primary focus:outline-none focus:ring-0";

  return (
    <div className="mb-10 last:mb-0">
      <h3 className={titleClass}>{block.title}</h3>
      <div className="h-px w-full bg-zinc-200" />
      <ul className={`mt-3 space-y-2 text-sm ${textClass}`} role="list">
        {block.facebookUrl && (
          <li>
            <Link href={block.facebookUrl} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="Facebook">
              <FaFacebookF className="h-4 w-4 shrink-0" />
              <span>Facebook</span>
            </Link>
          </li>
        )}
        {block.instagramUrl && (
          <li>
            <Link href={block.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="Instagram">
              <FaInstagram className="h-4 w-4 shrink-0" />
              <span>Instagram</span>
            </Link>
          </li>
        )}
        {block.address && (
          <li>
            {block.addressUrl ? (
              <Link href={block.addressUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <FaMapMarkerAlt className="h-4 w-4 shrink-0" />
                {block.address}
              </Link>
            ) : (
              <span>{block.address}</span>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}

export function ContactPageSection({ data, locale, sourcePage = "contacto" }: ContactPageSectionProps) {
  const hasBg = Boolean(data.backgroundImage?.trim());
  const floatingCard = data.contactCardFloating === true;

  const cardGlassStyle = hasBg
    ? {
        background: "rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(12px)",
      }
    : {
        background: "rgba(255, 255, 255, 0.9)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 8px 32px rgba(59, 35, 25, 0.12)",
        backdropFilter: "blur(12px)",
      };

  const leftContent = (
    <>
      <ContactBlockStack block={data.bodega} onDark={hasBg} />
      <ContactBlockStack block={data.destileria} onDark={hasBg} />
    </>
  );

  const content = (
    <div className="grid min-h-[480px] grid-cols-1 lg:grid-cols-2">
            {/* Mitad izquierda: overlay + formulario */}
            <div className="relative flex flex-col justify-center px-6 py-12 lg:px-12 lg:py-16 border-r">
        {hasBg && <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm " aria-hidden />}
        {!hasBg && (
          <div className="absolute inset-0 z-0 bg-zinc-100" aria-hidden />
        )}
        <div className="relative z-10">
          <ContactForm
            data={data.form}
            locale={locale}
            sourcePage={sourcePage}
            onDark={hasBg}
          />
        </div>
      </div>
      {/* Mitad derecha: glassmorphism + datos de contacto (full height o card flotante) */}
      <div
        className={
          floatingCard
            ? "flex items-center justify-center px-6 py-12 lg:px-12 lg:py-16"
            : hasBg
              ? "flex flex-col justify-center px-6 py-12 backdrop-blur-md lg:px-12 lg:py-16"
              : "flex flex-col justify-center px-6 py-12 lg:px-12 lg:py-16"
        }
        style={
          !floatingCard && hasBg
            ? {
                background: "rgba(0, 0, 0, 0.4)",
                borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 4px 32px rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(10px)",
              }
            : undefined
        }
      >
        {!hasBg && !floatingCard && (
          <div className="absolute inset-0 -z-10 border-r border-zinc-200 bg-white/95 backdrop-blur-sm" aria-hidden />
        )}
        {floatingCard ? (
          <div
            className="w-full max-w-md rounded-2xl px-6 py-8 lg:px-8 lg:py-10"
            style={cardGlassStyle}
          >
            {leftContent}
          </div>
        ) : (
          leftContent
        )}
      </div>


    </div>
  );

  if (hasBg) {
    return (
      <section
        className="relative overflow-hidden"
        aria-labelledby="contact-form-heading"
      >
        {data.parallax ? (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${data.backgroundImage})`,
              backgroundAttachment: "fixed",
            }}
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 z-0" aria-hidden>
            <Image
              src={data.backgroundImage!}
              alt={data.backgroundImageAlt ?? ""}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        <div className="relative z-10">{content}</div>
      </section>
    );
  }

  return (
    <section className="relative bg-background" aria-labelledby="contact-form-heading">
      {content}
    </section>
  );
}
