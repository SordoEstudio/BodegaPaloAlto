import {
  getHomeHeroData,
  getHomeCarouselLineasData,
  getHomeBanner1Data,
  getHomeBanner2Data,
  getHomeProductosDestacadosData
} from "@/lib/data";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCarouselLineas } from "@/components/home/HomeCarouselLineas";
import { HomeBanner } from "@/components/home/HomeBanner";
import { HomeProductosDestacados } from "@/components/home/HomeProductosDestacados";

interface PageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const locale = params.locale ?? "es";

  const heroData = getHomeHeroData(locale);
  const carouselData = getHomeCarouselLineasData(locale);
  const banner1Data = getHomeBanner1Data(locale);
  const banner2Data = getHomeBanner2Data(locale);
  const productosData = getHomeProductosDestacadosData(locale);

  return (
    <>
      <div className="relative min-h-[calc(100dvh-4.5rem)]">
        <HomeHero data={heroData} />
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <HomeCarouselLineas data={carouselData} />
        </div>
      </div>
      <HomeBanner data={banner1Data} />
      <HomeBanner data={banner2Data} />
      <HomeProductosDestacados data={productosData} />
    </>
  );
}
