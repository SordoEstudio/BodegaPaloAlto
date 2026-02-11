import Link from "next/link";
import Image from "next/image";
import { HeroFullScreen } from "@/components/HeroFullScreen";
import type { DestileriaHeroData } from "@/types/sections";

interface DestileriaHeroProps {
  data: DestileriaHeroData;
}

/** Hero destilería: misma lógica que HeroFullScreen del sitio, con overlay oscuro y acento Magic Stone. */
export function DestileriaHero({ data }: DestileriaHeroProps) {
  const { title, subtitle, ctaLabel, ctaUrl, backgroundImage, logoImage } = data;
  const hasImage = Boolean(backgroundImage?.trim());
  const hasLogo = Boolean(logoImage?.trim());

  return (
    <HeroFullScreen
      imageSrc={hasImage ? backgroundImage : undefined}
      imageAlt="Magic Stone Destilería"
      contentClassName="text-black"
      dark={false}
    >
      <div className="flex flex-col items-center gap-8">
        {hasLogo && (
          <div className="animate-rock-stone inline-flex origin-bottom">
            <Image
              src={logoImage!}
              alt="Magic Stone Destilería"
              width={120}
              height={120}
              className="h-24 w-24 object-contain sm:h-28 sm:w-28"
              priority
            />
          </div>
        )}
        <div className="text-center">
          <h1 className="font-destileria-hero text-3xl uppercase tracking-tight text-magic-stone-primary sm:text-4xl md:text-5xl">
            {title}
          </h1>
        <p className="mt-4 text-lg font-light opacity-95 sm:text-xl">
          {subtitle}
        </p>
        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl}
            className="mt-8 inline-block rounded-full bg-magic-stone-primary px-8 py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-0"
          >
            {ctaLabel}
          </Link>
        )}
        </div>
      </div>
    </HeroFullScreen>
  );
}
