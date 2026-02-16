"use client";

import type { ComponentType } from "react";
import type { CMSComponent } from "@/portable-dynamic-cms/types/cms-components";
import type { DynamicLayoutComponentProps } from "@/portable-dynamic-cms/components/DynamicLayout";
import { usePageCMS } from "@/portable-dynamic-cms";
import {
  mapHeroFromCms,
  mapCarouselLineasFromCms,
  mapBannerFromCms,
  mapProductosDestacadosFromCms,
} from "@/lib/data";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCarouselLineas } from "@/components/home/HomeCarouselLineas";
import { HomeBanner } from "@/components/home/HomeBanner";
import { HomeProductosDestacados } from "@/components/home/HomeProductosDestacados";
import type { HomeHeroData, HomeCarouselLineasData, HomeBannerData, HomeProductosDestacadosData } from "@/types/sections";

export const cmsTypeToLayoutName: Record<string, string> = {
  home_hero: "home-hero",
  home_carousel_lineas: "home-carousel-lineas",
  home_banner: "home-banner",
  home_productos_destacados: "home-productos-destacados",
};

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

export const componentMap: Record<string, ComponentType<DynamicLayoutComponentProps>> = {
  "home-hero": HomeHeroWrapper,
  "home-carousel-lineas": HomeCarouselLineasWrapper,
  "home-banner": HomeBannerWrapper,
  "home-productos-destacados": HomeProductosDestacadosWrapper,
};

type GetComponentPropsContext = {
  cmsLoading: boolean;
  cmsError: string | null;
  pageCMS: ReturnType<typeof usePageCMS>;
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
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapHeroFromCms(raw) as unknown as Record<string, unknown>,
      };
    case "home-carousel-lineas":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapCarouselLineasFromCms(raw) as unknown as Record<string, unknown>,
      };
    case "home-banner":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapBannerFromCms(raw) as unknown as Record<string, unknown>,
      };
    case "home-productos-destacados":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapProductosDestacadosFromCms(raw) as unknown as Record<string, unknown>,
      };
    default:
      return {
        loading: cmsLoading,
        error: cmsError,
        data: raw,
      };
  }
}
