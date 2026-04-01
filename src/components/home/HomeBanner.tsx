"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HomeBannerData } from "@/types/sections";
import { getLocaleFromPathname, type Locale } from "@/lib/i18n";

interface HomeBannerProps {
  data: HomeBannerData;
}

/** Enlaces internos del CMS sin prefijo (/bodega) → /es/bodega | /en/bodega */
function localizeBannerHref(href: string, locale: Locale): string {
  const trimmed = href.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed) || trimmed.startsWith("//")) {
    return href;
  }
  if (/^\/(es|en)(\/|$)/.test(trimmed)) {
    return trimmed;
  }
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `/${locale}${path === "/" ? "" : path}`;
}

const bannerContentClass =
  "relative block w-full overflow-hidden min-h-[200px] sm:min-h-[280px]";

export function HomeBanner({ data }: HomeBannerProps) {
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPathname(pathname);
  const { imageSrc, imageAlt, title, href, config } = data;
  const resolvedHref = href ? localizeBannerHref(href, locale) : undefined;
  const useParallax = config?.parallax === true;

  const content = useParallax ? (
    <span className={`${bannerContentClass} aspect-[21/9] sm:aspect-[3/1]`}>
      {/* Parallax: fondo fijo al scroll */}
      <span
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundAttachment: "fixed",
        }}
        aria-hidden
      />
      {title && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="text-center text-xl font-bold text-white drop-shadow sm:text-2xl">
            {title}
          </span>
        </span>
      )}
    </span>
  ) : (
    <span className={`${bannerContentClass} aspect-[21/9] sm:aspect-[3/1]`}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      {title && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="text-center text-xl font-bold text-white drop-shadow sm:text-2xl">
            {title}
          </span>
        </span>
      )}
    </span>
  );

  if (resolvedHref) {
    return (
      <Link
        href={resolvedHref}
        className="block focus:outline-none focus:ring-0"
      >
        {content}
      </Link>
    );
  }

  return content;
}
