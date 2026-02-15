import { HeroFullScreen } from "@/components/HeroFullScreen";
import type { HomeHeroData } from "@/types/sections";

interface HomeHeroProps {
  data: HomeHeroData;
}

export function HomeHero({ data }: HomeHeroProps) {
  const { slides, title, subtitle, logoImage, logoAlt } = data;

  return (
    <HeroFullScreen
      slides={slides}
      contentClassName="text-white"
      dark={true}
    >
      <div >
        {logoImage && (
          <div className="flex justify-center">
            <img src={logoImage} alt={logoAlt} width={400} height={400} className="object-contain" />
          </div>
        )}
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/95">
          {subtitle}
        </p>
      </div>
    </HeroFullScreen>
  );
}
