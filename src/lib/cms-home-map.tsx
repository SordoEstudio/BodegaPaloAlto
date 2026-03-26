"use client";

import type { ComponentType } from "react";
import type { CMSComponent } from "@/portable-dynamic-cms/types/cms-components";
import type { DynamicLayoutComponentProps } from "@/portable-dynamic-cms/components/DynamicLayout";
import {
  mapHeroFromCms,
  mapCarouselLineasFromCms,
  mapBannerFromCms,
  mapProductosDestacadosFromCms,
  mapPromoCarouselFromCms,
} from "@/lib/data";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCarouselLineas } from "@/components/home/HomeCarouselLineas";
import { HomeBanner } from "@/components/home/HomeBanner";
import { HomeProductosDestacados } from "@/components/home/HomeProductosDestacados";
import { PromoCarousel } from "@/components/promo/PromoCarousel";
import type {
  HomeHeroData,
  HomeCarouselLineasData,
  HomeBannerData,
  HomeProductosDestacadosData,
  PromoCarouselData,
} from "@/types/sections";

export { cmsTypeToLayoutName } from "@/lib/cms-type-map";

function HomeHeroWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as HomeHeroData | undefined;
  if (!data) return null;
  return <HomeHero data={data} />;
}

function HomeCarouselLineasWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as HomeCarouselLineasData | undefined;
  if (!data) return null;
  return <HomeCarouselLineas data={data} />;
}

function HomeBannerWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as HomeBannerData | undefined;
  if (!data) return null;
  return <HomeBanner data={data} />;
}

function HomeProductosDestacadosWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as HomeProductosDestacadosData | undefined;
  if (!data) return null;
  return <HomeProductosDestacados data={data} />;
}

function PromoCarouselWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as PromoCarouselData | undefined;
  if (!data?.slides?.length) return null;
  return <PromoCarousel data={data} minHeight="50vh" />;
}

export const homeComponentMap: Record<string, ComponentType<DynamicLayoutComponentProps>> = {
  "home-hero": HomeHeroWrapper,
  "home-carousel-lineas": HomeCarouselLineasWrapper,
  "home-banner": HomeBannerWrapper,
  "home-productos-destacados": HomeProductosDestacadosWrapper,
  "promo-carousel": PromoCarouselWrapper,
};

type GetComponentPropsContext = {
  cmsLoading: boolean;
  cmsError: string | null;
};

export function getHomeComponentProps(
  layoutName: string,
  cmsComponent: CMSComponent,
  context: GetComponentPropsContext
): DynamicLayoutComponentProps {
  const raw = (cmsComponent?.data ?? {}) as Record<string, unknown>;
  const { cmsLoading, cmsError } = context;

  switch (layoutName) {
    case "home-hero":
      return { loading: cmsLoading, error: cmsError, data: mapHeroFromCms(raw) as unknown as Record<string, unknown> };
    case "home-carousel-lineas":
      return { loading: cmsLoading, error: cmsError, data: mapCarouselLineasFromCms(raw) as unknown as Record<string, unknown> };
    case "home-banner":
      return { loading: cmsLoading, error: cmsError, data: mapBannerFromCms(raw) as unknown as Record<string, unknown> };
    case "home-productos-destacados":
      return { loading: cmsLoading, error: cmsError, data: mapProductosDestacadosFromCms(raw) as unknown as Record<string, unknown> };
    case "promo-carousel":
      return { loading: cmsLoading, error: cmsError, data: mapPromoCarouselFromCms(raw) as unknown as Record<string, unknown> };
    default:
      return { loading: cmsLoading, error: cmsError, data: raw };
  }
}
