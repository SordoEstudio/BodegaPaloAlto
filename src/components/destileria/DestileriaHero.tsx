import Image from "next/image";
import { HeroFullScreen } from "@/components/HeroFullScreen";
import type { DestileriaHeroData } from "@/types/sections";

interface DestileriaHeroProps {
  data: DestileriaHeroData;
}

/** Hero destilería: misma lógica que HeroFullScreen del sitio, con overlay oscuro y acento Magic Stone. */
export function DestileriaHero({ data }: DestileriaHeroProps) {
  const { title, subtitle, backgroundImage, logoImage, position } = data;
  const hasImage = Boolean(backgroundImage?.trim());
  const hasLogo = Boolean(logoImage?.trim());

  return (
    <HeroFullScreen
      imageSrc={hasImage ? backgroundImage : undefined}
      imageAlt="Magic Stone Destilería"
      contentClassName="text-black"
      dark={false}
      contentPosition={position ?? "top"}
    >
      <div className="flex flex-col items-center gap-8">
        {hasLogo && (
          <div className="animate-rock-stone inline-flex h-24 w-24 shrink-0 origin-bottom sm:h-28 sm:w-28">
            <Image
              src={logoImage!}
              alt="Magic Stone Destilería"
              width={112}
              height={112}
              sizes="(max-width: 640px) 96px, 112px"
              quality={68}
              className="h-full w-full object-contain"
              fetchPriority="low"
            />
          </div>
        )}
        <div className="flex min-h-[3.75rem] flex-col justify-center text-center sm:min-h-[4.5rem] md:min-h-[5rem]">
          <h1 className="font-destileria-hero text-3xl uppercase tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>
        <p className="mt-4 text-lg font-light opacity-95 sm:text-xl">
          {subtitle}
        </p>
        </div>
      </div>
    </HeroFullScreen>
  );
}
