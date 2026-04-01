"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { HeaderData } from "@/types/sections";
import { getLocaleFromPathname, getLocalizedPath, getPathWithoutLocale, isValidLocale, type Locale } from "@/lib/i18n";

interface HeaderProps {
  dataEs: HeaderData;
  dataEn: HeaderData;
}

const PREFERRED_LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

function setPreferredLocaleCookie(next: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `preferredLocale=${next}; path=/; max-age=${PREFERRED_LOCALE_MAX_AGE}; SameSite=Lax`;
}

export function Header({ dataEs, dataEn }: HeaderProps) {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const querySuffix = (() => {
    const q = searchParams.toString();
    return q ? `?${q}` : "";
  })();
  const locale = getLocaleFromPathname(pathname);
  const data = locale === "en" ? dataEn : dataEs;
  const [menuOpen, setMenuOpen] = useState(false);

  const { logo, nav, languages } = data;
  const currentPath = getPathWithoutLocale(pathname);

  const isActive = (href: string) => {
    const hrefPath = getPathWithoutLocale(href);
    if (hrefPath === "/") return currentPath === "/";
    return currentPath.startsWith(hrefPath);
  };

  return (
    <>
      {/* Backdrop para cerrar el menú mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <header
        className="sticky top-0 z-50 border-b border-white/10 bg-[var(--header-bg)] font-sans"
        role="banner"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6">
          {/* Logo */}
          <Link
            href={logo.href}
            className="font-heading text-2xl font-semibold tracking-tight text-white focus:outline-none focus:ring-0 sm:text-3xl"
            aria-label={logo.imageAlt || logo.text}
          >
            {logo.imageSrc ? (
              <Image
                src={logo.imageSrc}
                alt={logo.imageAlt ?? logo.text}
                width={140}
                height={20}
                sizes="140px"
                className="h-5 w-[140px] object-contain object-left"
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
                          className={`block whitespace-nowrap px-4 py-2 text-sm hover:bg-white/10 hover:text-white ${
                            isActive(child.href) ? "text-palo-alto-primary font-semibold" : "text-white/95"
                          }`}
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
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`font-medium transition focus:outline-none focus:ring-0 rounded ${
                    isActive(item.href)
                      ? "text-palo-alto-primary"
                      : "text-white hover:text-palo-alto-primary"
                  }`}
                  target={
                    item.label.toLowerCase() === "shop" || item.href.startsWith("http")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    item.label.toLowerCase() === "shop" || item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Idiomas + menú móvil */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1" role="group" aria-label="Idioma">
              {languages.map((lang) => {
                const langCodeRaw = String(lang.code).toLowerCase();
                const langCode: Locale = isValidLocale(langCodeRaw) ? langCodeRaw : locale;
                const isActive = langCode === locale;
                const href = isActive
                  ? `${pathname}${querySuffix}`
                  : `${getLocalizedPath(pathname, langCode)}${querySuffix}`;
                return (
                  <Link
                    key={lang.code}
                    href={href}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded px-2 text-sm font-bold transition focus:outline-none focus:ring-0 ${
                      isActive
                        ? "text-palo-alto-primary"
                        : "text-white/90 hover:text-white"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => {
                      if (!isActive) setPreferredLocaleCookie(langCode);
                    }}
                  >
                    {lang.label}
                  </Link>
                );
              })}
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded md:hidden text-white hover:bg-white/10 focus:outline-none focus:ring-0"
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
                            className={`block py-2 text-sm hover:text-palo-alto-primary ${
                              isActive(child.href) ? "text-palo-alto-primary font-semibold" : "text-white/90"
                            }`}
                            aria-current={isActive(child.href) ? "page" : undefined}
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
                      className={`block py-2 font-medium hover:text-palo-alto-primary ${
                        isActive(item.href) ? "text-palo-alto-primary font-semibold" : "text-white"
                      }`}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
