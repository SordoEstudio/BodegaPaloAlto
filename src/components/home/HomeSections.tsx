import { HomeHero } from "@/components/home/HomeHero";
import { HomeCarouselLineas } from "@/components/home/HomeCarouselLineas";
import { HomeBanner } from "@/components/home/HomeBanner";
import { HomeProductosDestacados } from "@/components/home/HomeProductosDestacados";
import {
  mapHeroFromCms,
  mapCarouselLineasFromCms,
  mapBannerFromCms,
  mapProductosDestacadosFromCms,
} from "@/lib/data";
import { getCmsComponents, filterByPage, sortByOrder } from "@/lib/cms-fetch";

const BANNER_TYPES = new Set(["home_banner", "banner_con_imagen_de_fondo_2"]);
const CAROUSEL_TYPES = new Set(["home_carrousel_lineas", "home_carousel_lineas"]);

interface HomeSectionsProps {
  locale: string;
}

export async function HomeSections({ locale }: HomeSectionsProps) {
  const all = await getCmsComponents(locale);
  const pageComps = sortByOrder(filterByPage(all, "Inicio"));
  if (pageComps.length === 0) return null;

  const hero = pageComps.find((c) => c.type === "home_hero");
  const carousel = pageComps.find((c) => CAROUSEL_TYPES.has(c.type));
  const banners = pageComps.filter((c) => BANNER_TYPES.has(c.type));
  const destacados = pageComps.find((c) => c.type === "home_productos_destacados");

  return (
    <>
      {(hero || carousel) && (
        <div className="relative min-h-[calc(100dvh-4.5rem)]">
          {hero && <HomeHero data={mapHeroFromCms(hero.data as Record<string, unknown>)} />}
          {carousel && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <HomeCarouselLineas data={mapCarouselLineasFromCms(carousel.data as Record<string, unknown>)} />
            </div>
          )}
        </div>
      )}
      {banners.map((b, i) => (
        <HomeBanner key={b._id ?? `banner-${i}`} data={mapBannerFromCms(b.data as Record<string, unknown>)} />
      ))}
      <HomeProductosDestacados
        data={
          destacados
            ? mapProductosDestacadosFromCms(destacados.data as Record<string, unknown>)
            : { sectionTitle: "", products: [] }
        }
      />
    </>
  );
}
