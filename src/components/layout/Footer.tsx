"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { useCMSComponentsFromContext } from "@/portable-dynamic-cms";
import { mapContactoRedesToFooterLinks } from "@/lib/data";
import { Tooltip } from "@/components/ui/Tooltip";
import type { FooterData } from "@/types/sections";
import type { FooterLinkItem } from "@/lib/data";

interface FooterProps {
  dataEs: FooterData;
  dataEn: FooterData;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
  Ubicación: FaMapMarkerAlt,
};

function getLocaleFromPathname(pathname: string): "es" | "en" {
  return pathname.startsWith("/en") ? "en" : "es";
}

function SocialIconLink({
  link,
  variant = "default",
}: {
  link: FooterLinkItem;
  variant?: "default" | "destileria";
}) {
  const Icon = iconMap[link.label];
  const tooltipContent = link.value || link.ariaLabel;
  const linkClass =
    variant === "destileria"
      ? "flex h-11 w-11 items-center justify-center rounded-full bg-white/50 border border-white/30 text-white/95 transition hover:border-palo-alto-primary hover:bg-white/80 hover:text-white focus:outline-none focus:ring-0"
      : "flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/95 transition hover:border-palo-alto-primary hover:bg-palo-alto-primary/20 hover:text-white focus:outline-none focus:ring-0";

  const inner = (
    <Link
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.ariaLabel}
      className={linkClass}
    >
      {Icon ? (
        <Icon className={variant === "destileria" ? "h-5 w-5 text-magic-stone-primary" : "h-5 w-5"} />
      ) : (
        link.label
      )}
    </Link>
  );

  return (
    <Tooltip content={tooltipContent} side="top">
      {inner}
    </Tooltip>
  );
}

export function Footer({ dataEs, dataEn }: FooterProps) {
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPathname(pathname);
  const data = locale === "en" ? dataEn : dataEs;
  const { components, getComponentByType } = useCMSComponentsFromContext();

  const contactoRedes = components ? getComponentByType("contacto_redes") : null;
  const redesFromContacto =
    contactoRedes?.data != null
      ? mapContactoRedesToFooterLinks(contactoRedes.data as Record<string, unknown>)
      : null;

  const socialLinks = redesFromContacto?.socialLinks ?? data.socialLinks;
  const lista_contacto_destileria = redesFromContacto?.lista_contacto_destileria ?? data.lista_contacto_destileria ?? [];

  const {
    logo,
    disclaimer,
    developedBy,
    developedByUrl,
  } = data;

  return (
    <footer
      className="bg-palo-alto-secondary text-white"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 pb-4">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Redes: fuente única desde API contacto (contacto_redes) */}
          <div className="">
            <h3 className="font-heading mb-4 text-xs font-bold uppercase tracking-wider text-palo-alto-primary/90 ">
              {locale === "en" ? "Follow us" : "Seguinos"}
            </h3>
            <ul className="flex flex-wrap gap-3" role="list">
              {socialLinks.map((link) => (
                <li key={`${link.label}-${link.href}`} role="listitem">
                  <SocialIconLink link={link} variant="default" />
                </li>
              ))}
              <span className="text-xs border-r border-white/30 pr-2 text-white/95" />
              {lista_contacto_destileria.map((link) => (
                <li key={`${link.label}-${link.href}`} role="listitem">
                  <SocialIconLink link={link} variant="destileria" />
                </li>
              ))}
            </ul>
          </div>
          {/* Logo */}
          <div className="sm:col-span-2 lg:col-span-1 text-center">
            <Link
              href={logo.href}
              className="font-heading inline-block text-2xl font-semibold tracking-tight focus:outline-none focus:ring-0"
              aria-label={logo.imageAlt || logo.text}
            >
              {logo.imageSrc ? (
                <Image
                  src={logo.imageSrc}
                  alt={logo.imageAlt ?? logo.text}
                  width={200}
                  height={36}
                />
              ) : (
                logo.text
              )}
            </Link>
          </div>
{/* Destilería */}
{/* <div className="sm:col-span-2 lg:col-span-1 ">
<h3 className="font-heading mb-4 text-xs font-bold uppercase tracking-wider text-palo-alto-primary/90 ">{locale === "en" ? "Destilería" : "Destilería"}</h3>
<ul className="flex flex-wrap gap-3" role="list">
  {(lista_contacto_destileria ?? []).map((link) => {
    const Icon = iconMap[link.label];
    return (
      <li key={link.label} role="listitem">
        <Link
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.ariaLabel}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/95 transition hover:border-palo-alto-primary hover:bg-palo-alto-primary/20 hover:text-white focus:outline-none focus:ring-0"
        >
          {Icon ? <Icon className="h-5 w-5" /> : link.label}
          
        </Link>
        
      </li>
    );
  })}
</ul>
</div> */}
          {/* Contacto */}
{/*           <div>
            <h3 className="font-heading mb-4 text-xs font-bold uppercase tracking-wider text-palo-alto-primary/90">
              {locale === "en" ? "Contact" : "Contacto"}
            </h3>
            <address className="not-italic">
              {address && (
                <p className="text-sm leading-relaxed text-white/95">
                  {addressUrl ? (
                    <Link
                      href={addressUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-palo-alto-primary underline transition focus:outline-none focus:ring-0 rounded"
                    >
                      {address}
                    </Link>
                  ) : (
                    address
                  )}
                </p>
              )}
              {phone && (
                <p className="mt-2 text-sm text-white/95">
                  <a href={`tel:${phone}`} className="hover:text-palo-alto-primary transition">
                    {phone}
                  </a>
                </p>
              )}
              {email && (
                <p className="mt-2 text-sm text-white/95">
                  <a href={`mailto:${email}`} className="hover:text-palo-alto-primary transition">
                    {email}
                  </a>
                </p>
              )}
              {whatsapp && (
                <p className="mt-2">
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/95 hover:text-palo-alto-primary transition"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                    WhatsApp
                  </a>
                </p>
              )}
            </address>
          </div> */}


        </div>

        {/* Disclaimer, privacidad y desarrollado por */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/15 pt-8 text-center sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="text-sm font-medium text-white/90">
              {disclaimer}
            </p>
            <Link
              href={`/${locale}/politica-de-privacidad`}
              className="text-sm text-white/80 underline transition hover:text-palo-alto-primary focus:outline-none focus:ring-0 rounded"
            >
              {locale === "en" ? "Privacy Policy" : "Política de Privacidad"}
            </Link>
          </div>
          <p className="text-sm font-medium text-white/90">
            Bodega Palo Alto - Todos los derechos reservados - 2026
          </p>
          <p className="text-sm text-white/70">
            {developedByUrl ? (
              <a
                href={developedByUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-palo-alto-primary transition focus:outline-none focus:ring-0 rounded"
              >
                {locale === "en" ? "Developed by" : "Desarrollado por"}{" "}
                {developedBy}
              </a>
            ) : (
              <>
                {locale === "en" ? "Developed by" : "Desarrollado por"}{" "}
                {developedBy}
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
