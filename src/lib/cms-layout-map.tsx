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
  mapPortadaDestileriaFromCms,
  mapHistoriaDestileriaFromCms,
  mapBannerFullToHighlightFromCms,
  mapMissionVisionValuesFromCms,
  mapManifestFromCms,
  mapAboutBodegaFromCms,
  mapTeamBodegaFromCms,
  mapFincasBodegaFromCms,
  mapPromoCarouselFromCms,
} from "@/lib/data";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCarouselLineas } from "@/components/home/HomeCarouselLineas";
import { HomeBanner } from "@/components/home/HomeBanner";
import { HomeProductosDestacados } from "@/components/home/HomeProductosDestacados";
import { DestileriaHero } from "@/components/destileria/DestileriaHero";
import { DestileriaStorySplit } from "@/components/destileria/DestileriaStorySplit";
import { DestileriaTextHighlight } from "@/components/destileria/DestileriaTextHighlight";
import { DestileriaMissionVision } from "@/components/destileria/DestileriaMissionVision";
import { DestileriaManifesto } from "@/components/destileria/DestileriaManifesto";
import { BodegaQuienesSomos } from "@/components/bodega/BodegaQuienesSomos";
import { BodegaEquipoFichas } from "@/components/bodega/BodegaEquipoFichas";
import { BodegaFincasSection } from "@/components/bodega/BodegaFincasSection";
import { PromoCarousel } from "@/components/promo/PromoCarousel";
import type { HomeHeroData, HomeCarouselLineasData, HomeBannerData, HomeProductosDestacadosData } from "@/types/sections";
import type { DestileriaHeroData, DestileriaStorySplitData, DestileriaTextHighlightData, DestileriaMissionVisionData, DestileriaManifestoData } from "@/types/sections";
import type { BodegaQuienesSomosData, BodegaEquipoData } from "@/types/sections";
import type { PromoCarouselData } from "@/types/sections";

export const cmsTypeToLayoutName: Record<string, string> = {
  home_hero: "home-hero",
  home_carrousel_lineas: "home-carousel-lineas",
  home_banner: "home-banner",
  home_productos_destacados: "home-productos-destacados",
  carrusel_promocional: "promo-carousel",
  carrusel_bodega: "promo-carousel",
  carrusel_destileria: "promo-carousel",
  carrusel_contacto: "promo-carousel",
  portada_destileria: "portada-destileria",
  historia_destileria: "historia-destileria",
  destileria_historia: "historia-destileria",
  banner_full: "highlight-destileria",
  banner_1: "highlight-destileria",
  banner_2: "highlight-destileria",
  banner_3: "highlight-destileria",
  mission_vision_values: "mission-vision-values",
  mision_vision_values: "mission-vision-values",
  mision_vision_valores: "mission-vision-values",
  manifest: "manifest-destileria",
  manifiesto: "manifest-destileria",
  hero_banner: "home-banner",
  about: "about-bodega",
  quienes_somos: "about-bodega",
  team: "team-bodega",
  fincas: "fincas-bodega",
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

function PortadaDestileriaWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as DestileriaHeroData | undefined;
  if (!data) return null;
  return <DestileriaHero data={data} />;
}

function HistoriaDestileriaWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as DestileriaStorySplitData | { storySplits: DestileriaStorySplitData[] } | undefined;
  if (!data) return null;
  if ("storySplits" in data && Array.isArray(data.storySplits)) {
    return (
      <>
        {data.storySplits.map((section, i) => (
          <DestileriaStorySplit key={section.title ?? `story-${i}`} data={section} />
        ))}
      </>
    );
  }
  return <DestileriaStorySplit data={data as DestileriaStorySplitData} />;
}

function HighlightDestileriaWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as DestileriaTextHighlightData | undefined;
  if (!data) return null;
  return <DestileriaTextHighlight data={data} />;
}

function MissionVisionValuesWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as DestileriaMissionVisionData | undefined;
  if (!data) return null;
  return <DestileriaMissionVision data={data} />;
}

function ManifestDestileriaWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as DestileriaManifestoData | undefined;
  if (!data) return null;
  return <DestileriaManifesto data={data} />;
}

function AboutBodegaWrapper(props: DynamicLayoutComponentProps) {
  const mapped = props.data as (BodegaQuienesSomosData & { equipo?: BodegaEquipoData }) | undefined;
  if (!mapped) return null;
  const { equipo, ...quienesSomosData } = mapped;
  return <BodegaQuienesSomos data={quienesSomosData} equipo={equipo ?? null} />;
}

function TeamBodegaWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as BodegaEquipoData | undefined;
  if (!data) return null;
  return <BodegaEquipoFichas data={data} />;
}

function FincasBodegaWrapper(props: DynamicLayoutComponentProps) {
  const mapped = props.data as { section: { title: string; backgroundImage?: { imageSrc: string; imageAlt?: string } }; finca1: import("@/types/sections").BodegaFincaData; finca2: import("@/types/sections").BodegaFincaData } | undefined;
  if (!mapped) return null;
  return (
    <BodegaFincasSection
      data={mapped.section}
      finca1={mapped.finca1}
      finca2={mapped.finca2}
    />
  );
}

function PromoCarouselWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as PromoCarouselData | undefined;
  if (!data?.slides?.length) return null;
  return <PromoCarousel data={data} minHeight="50vh" />;
}

export const componentMap: Record<string, ComponentType<DynamicLayoutComponentProps>> = {
  "home-hero": HomeHeroWrapper,
  "home-carousel-lineas": HomeCarouselLineasWrapper,
  "home-banner": HomeBannerWrapper,
  "home-productos-destacados": HomeProductosDestacadosWrapper,
  "portada-destileria": PortadaDestileriaWrapper,
  "historia-destileria": HistoriaDestileriaWrapper,
  "highlight-destileria": HighlightDestileriaWrapper,
  "mission-vision-values": MissionVisionValuesWrapper,
  "manifest-destileria": ManifestDestileriaWrapper,
  "about-bodega": AboutBodegaWrapper,
  "team-bodega": TeamBodegaWrapper,
  "fincas-bodega": FincasBodegaWrapper,
  "promo-carousel": PromoCarouselWrapper,
};

type GetComponentPropsContext = {
  cmsLoading: boolean;
  cmsError: string | null;
  pageCMS: ReturnType<typeof usePageCMS>;
  pageComponents?: import("@/portable-dynamic-cms/types/cms-components").CMSComponent[];
};

export function getDestileriaComponentProps(
  layoutName: string,
  cmsComponent: CMSComponent,
  context: GetComponentPropsContext
): DynamicLayoutComponentProps {
  const raw = (cmsComponent?.data ?? {}) as Record<string, unknown>;
  const { cmsLoading, cmsError } = context;

  switch (layoutName) {
    case "portada-destileria":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapPortadaDestileriaFromCms(raw) as unknown as Record<string, unknown>,
      };
    case "historia-destileria":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapHistoriaDestileriaFromCms(raw) as unknown as Record<string, unknown>,
      };
    case "highlight-destileria":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapBannerFullToHighlightFromCms(raw) as unknown as Record<string, unknown>,
      };
    case "mission-vision-values":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapMissionVisionValuesFromCms(raw) as unknown as Record<string, unknown>,
      };
    case "manifest-destileria":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapManifestFromCms(raw) as unknown as Record<string, unknown>,
      };
    case "home-banner":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapBannerFromCms(raw) as unknown as Record<string, unknown>,
      };
    case "promo-carousel":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapPromoCarouselFromCms(raw) as unknown as Record<string, unknown>,
      };
    default:
      return {
        loading: cmsLoading,
        error: cmsError,
        data: raw,
      };
  }
}

export function getBodegaComponentProps(
  layoutName: string,
  cmsComponent: CMSComponent,
  context: GetComponentPropsContext
): DynamicLayoutComponentProps {
  const raw = (cmsComponent?.data ?? {}) as Record<string, unknown>;
  const { cmsLoading, cmsError, pageComponents } = context;
  switch (layoutName) {
    case "about-bodega": {
      const mapped = mapAboutBodegaFromCms(raw) as BodegaQuienesSomosData & { equipo?: BodegaEquipoData };
      if (!mapped.equipo?.members?.length && pageComponents) {
        const teamComp = pageComponents.find((c) => c.type === "team");
        if (teamComp?.data) {
          mapped.equipo = mapTeamBodegaFromCms(teamComp.data as Record<string, unknown>);
        }
      }
      return { loading: cmsLoading, error: cmsError, data: mapped as unknown as Record<string, unknown> };
    }
    case "team-bodega":
      return { loading: cmsLoading, error: cmsError, data: mapTeamBodegaFromCms(raw) as unknown as Record<string, unknown> };
    case "fincas-bodega":
      return { loading: cmsLoading, error: cmsError, data: mapFincasBodegaFromCms(raw) as unknown as Record<string, unknown> };
    case "promo-carousel":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapPromoCarouselFromCms(raw) as unknown as Record<string, unknown>,
      };
    default:
      return { loading: cmsLoading, error: cmsError, data: raw };
  }
}

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
    case "promo-carousel":
      return {
        loading: cmsLoading,
        error: cmsError,
        data: mapPromoCarouselFromCms(raw) as unknown as Record<string, unknown>,
      };
    default:
      return {
        loading: cmsLoading,
        error: cmsError,
        data: raw,
      };
  }
}
