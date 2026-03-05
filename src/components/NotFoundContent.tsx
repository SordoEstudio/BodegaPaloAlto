"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/i18n";

const copy = {
  es: {
    title: "Página no encontrada",
    description:
      "La ruta que buscás no existe o fue movida. Volvé al inicio para seguir navegando.",
    cta: "Volver al inicio",
  },
  en: {
    title: "Page not found",
    description:
      "The page you're looking for doesn't exist or has been moved. Head back home to continue.",
    cta: "Back to home",
  },
};

export function NotFoundContent() {
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPathname(pathname);
  const t = copy[locale];

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <p
        className="font-heading text-8xl font-bold tracking-tight text-palo-alto-primary/90 sm:text-9xl"
        aria-hidden
      >
        404
      </p>
      <h1 className="mt-4 font-heading text-2xl font-semibold text-palo-alto-secondary sm:text-3xl">
        {t.title}
      </h1>
      <p className="mt-3 max-w-md text-foreground/90">{t.description}</p>
      <Link
        href={locale === "en" ? "/en" : "/es"}
        className="mt-8 inline-flex items-center rounded-md bg-palo-alto-secondary px-6 py-3 font-medium text-white transition hover:bg-palo-alto-secondary/90 focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2"
      >
        {t.cta}
      </Link>
    </div>
  );
}
