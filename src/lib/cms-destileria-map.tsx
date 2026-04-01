"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import type { CMSComponent } from "@/portable-dynamic-cms/types/cms-components";
import type { DynamicLayoutComponentProps } from "@/portable-dynamic-cms/components/DynamicLayout";
import {
  mapPortadaDestileriaFromCms,
  mapHistoriaDestileriaFromCms,
  mapBannerFullToHighlightFromCms,
  mapMissionVisionValuesFromCms,
  mapManifestFromCms,
  mapBannerFromCms,
  mapPromoCarouselFromCms,
} from "@/lib/data";
const DestileriaHero = dynamic(() =>
  import("@/components/destileria/DestileriaHero").then((mod) => mod.DestileriaHero)
);
const DestileriaStorySplit = dynamic(() =>
  import("@/components/destileria/DestileriaStorySplit").then((mod) => mod.DestileriaStorySplit)
);
const DestileriaTextHighlight = dynamic(() =>
  import("@/components/destileria/DestileriaTextHighlight").then((mod) => mod.DestileriaTextHighlight)
);
const DestileriaMissionVision = dynamic(() =>
  import("@/components/destileria/DestileriaMissionVision").then((mod) => mod.DestileriaMissionVision)
);
const DestileriaManifesto = dynamic(() =>
  import("@/components/destileria/DestileriaManifesto").then((mod) => mod.DestileriaManifesto)
);
const HomeBanner = dynamic(() => import("@/components/home/HomeBanner").then((mod) => mod.HomeBanner));
const PromoCarousel = dynamic(() =>
  import("@/components/promo/PromoCarousel").then((mod) => mod.PromoCarousel)
);
import type {
  DestileriaHeroData,
  DestileriaStorySplitData,
  DestileriaTextHighlightData,
  DestileriaMissionVisionData,
  DestileriaManifestoData,
  HomeBannerData,
  PromoCarouselData,
} from "@/types/sections";

export { cmsTypeToLayoutName } from "@/lib/cms-type-map";

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

function HomeBannerWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as HomeBannerData | undefined;
  if (!data) return null;
  return <HomeBanner data={data} />;
}

function PromoCarouselWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as PromoCarouselData | undefined;
  if (!data?.slides?.length) return null;
  return <PromoCarousel data={data} minHeight="50vh" />;
}

export const destileriaComponentMap: Record<string, ComponentType<DynamicLayoutComponentProps>> = {
  "portada-destileria": PortadaDestileriaWrapper,
  "historia-destileria": HistoriaDestileriaWrapper,
  "highlight-destileria": HighlightDestileriaWrapper,
  "mission-vision-values": MissionVisionValuesWrapper,
  "manifest-destileria": ManifestDestileriaWrapper,
  "home-banner": HomeBannerWrapper,
  "promo-carousel": PromoCarouselWrapper,
};

type GetComponentPropsContext = {
  cmsLoading: boolean;
  cmsError: string | null;
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
      return { loading: cmsLoading, error: cmsError, data: mapPortadaDestileriaFromCms(raw) as unknown as Record<string, unknown> };
    case "historia-destileria":
      return { loading: cmsLoading, error: cmsError, data: mapHistoriaDestileriaFromCms(raw) as unknown as Record<string, unknown> };
    case "highlight-destileria":
      return { loading: cmsLoading, error: cmsError, data: mapBannerFullToHighlightFromCms(raw) as unknown as Record<string, unknown> };
    case "mission-vision-values":
      return { loading: cmsLoading, error: cmsError, data: mapMissionVisionValuesFromCms(raw) as unknown as Record<string, unknown> };
    case "manifest-destileria":
      return { loading: cmsLoading, error: cmsError, data: mapManifestFromCms(raw) as unknown as Record<string, unknown> };
    case "home-banner":
      return { loading: cmsLoading, error: cmsError, data: mapBannerFromCms(raw) as unknown as Record<string, unknown> };
    case "promo-carousel":
      return { loading: cmsLoading, error: cmsError, data: mapPromoCarouselFromCms(raw) as unknown as Record<string, unknown> };
    default:
      return { loading: cmsLoading, error: cmsError, data: raw };
  }
}
