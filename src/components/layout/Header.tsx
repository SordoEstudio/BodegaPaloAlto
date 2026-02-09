"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { HeaderData } from "@/types/sections";

interface HeaderProps {
  dataEs: HeaderData;
  dataEn: HeaderData;
}

function getLocaleFromPathname(pathname: string): "es" | "en" {
  return pathname.startsWith("/en") ? "en" : "es";
}

function getLocalizedPath(pathname: string, newLocale: "es" | "en"): string {
  if (newLocale === "en") {
    if (pathname === "/" || pathname === "") return "/en";
    return pathname.startsWith("/en") ? pathname : `/en${pathname}`;
  }
  if (pathname.startsWith("/en")) {
    const withoutEn = pathname.slice(3) || "/";
    return withoutEn === "" ? "/" : withoutEn;
  }
  return pathname || "/";
}

export function Header({ dataEs, dataEn }: HeaderProps) {
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPathname(pathname);
  const data = locale === "en" ? dataEn : dataEs;
  const [menuOpen, setMenuOpen] = useState(false);

  const { logo, nav, shop, languages } = data;
  const otherLocale = locale === "en" ? "es" : "en";
  const switchPath = getLocalizedPath(pathname, otherLocale);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 bg-[var(--header-bg)] font-sans"
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6">
        {/* Logo – tipografía principal (Carleton / Cormorant) */}
        <Link
          href={logo.href}
          className="font-heading text-2xl font-semibold tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 focus:ring-offset-[var(--header-bg)] sm:text-3xl"
          aria-label={logo.imageAlt || logo.text}
        >
          {logo.imageSrc ? (
            <Image
              src={logo.imageSrc}
              alt={logo.imageAlt ?? logo.text}
              width={140}
              height={40}
              className="h-8 w-auto sm:h-10"
            />
          ) : (
            logo.text
          )}
        </Link>

        {/* Nav desktop */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navegación principal"
        >
          {nav.map((item) =>
            item.children?.length ? (
              <div key={item.label} className="relative group">
                <span className="cursor-default font-medium text-white">
                  {item.label}
                </span>
                <ul className="absolute left-0 top-full hidden min-w-[180px] rounded-lg border border-white/10 bg-[var(--header-bg)] py-2 shadow-lg group-hover:block" role="list">
                  {item.children.map((child) => (
                    <li key={child.href} role="listitem">
                      <Link
                        href={child.href}
                        className="block whitespace-nowrap px-4 py-2 text-sm text-white/95 hover:bg-white/10 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-white transition hover:text-palo-alto-primary focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 focus:ring-offset-[var(--header-bg)] rounded"
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href={shop.href}
            target={shop.external ? "_blank" : undefined}
            rel={shop.external ? "noopener noreferrer" : undefined}
            className="rounded-full bg-palo-alto-primary px-4 py-2 font-bold text-palo-alto-secondary transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 focus:ring-offset-[var(--header-bg)]"
          >
            {shop.label}
          </Link>
        </nav>

        {/* Idiomas + menú móvil */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1" role="group" aria-label="Idioma">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={lang.code === locale ? pathname : switchPath}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded px-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 focus:ring-offset-[var(--header-bg)] ${
                  lang.code === locale
                    ? "text-palo-alto-primary underline"
                    : "text-white/90 hover:text-white"
                }`}
                aria-current={lang.code === locale ? "true" : undefined}
              >
                {lang.label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded md:hidden text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 focus:ring-offset-[var(--header-bg)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <nav
          className="border-t border-white/10 bg-[var(--header-bg)] px-4 py-4 md:hidden"
          aria-label="Navegación móvil"
        >
          <ul className="flex flex-col gap-2" role="list">
            {nav.map((item) =>
              item.children?.length ? (
                <li key={item.label} role="listitem">
                  <span className="block py-2 font-medium text-white">
                    {item.label}
                  </span>
                  <ul className="ml-4 flex flex-col gap-1" role="list">
                    {item.children.map((child) => (
                      <li key={child.href} role="listitem">
                        <Link
                          href={child.href}
                          className="block py-2 text-sm text-white/90 hover:text-palo-alto-primary"
                          onClick={() => setMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href} role="listitem">
                  <Link
                    href={item.href}
                    className="block py-2 font-medium text-white hover:text-palo-alto-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
            <li role="listitem">
              <Link
                href={shop.href}
                target={shop.external ? "_blank" : undefined}
                rel={shop.external ? "noopener noreferrer" : undefined}
                className="block rounded-full bg-palo-alto-primary py-3 text-center font-bold text-palo-alto-secondary"
                onClick={() => setMenuOpen(false)}
              >
                {shop.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
