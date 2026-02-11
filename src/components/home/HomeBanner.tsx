"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomeBannerData } from "@/types/sections";

interface HomeBannerProps {
  data: HomeBannerData;
}

const bannerContentClass =
  "relative block w-full overflow-hidden min-h-[200px] sm:min-h-[280px]";

export function HomeBanner({ data }: HomeBannerProps) {
  const { imageSrc, imageAlt, title, href, config } = data;
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

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none focus:ring-0"
      >
        {content}
      </Link>
    );
  }

  return content;
}
