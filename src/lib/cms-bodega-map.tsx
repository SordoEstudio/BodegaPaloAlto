"use client";

import type { ComponentType } from "react";
import type { CMSComponent } from "@/portable-dynamic-cms/types/cms-components";
import type { DynamicLayoutComponentProps } from "@/portable-dynamic-cms/components/DynamicLayout";
import {
  mapAboutBodegaFromCms,
  mapTeamBodegaFromCms,
  mapFincasBodegaFromCms,
  mapPromoCarouselFromCms,
} from "@/lib/data";
import { BodegaQuienesSomos } from "@/components/bodega/BodegaQuienesSomos";
import { BodegaEquipoFichas } from "@/components/bodega/BodegaEquipoFichas";
import { BodegaFincasSection } from "@/components/bodega/BodegaFincasSection";
import { PromoCarousel } from "@/components/promo/PromoCarousel";
import type { BodegaQuienesSomosData, BodegaEquipoData, BodegaFincaData, PromoCarouselData } from "@/types/sections";

export { cmsTypeToLayoutName } from "@/lib/cms-type-map";

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
  const mapped = props.data as {
    section: { title: string; backgroundImage?: { imageSrc: string; imageAlt?: string } };
    finca1: BodegaFincaData;
    finca2: BodegaFincaData;
  } | undefined;
  if (!mapped) return null;
  return <BodegaFincasSection data={mapped.section} finca1={mapped.finca1} finca2={mapped.finca2} />;
}

function PromoCarouselWrapper(props: DynamicLayoutComponentProps) {
  const data = props.data as PromoCarouselData | undefined;
  if (!data?.slides?.length) return null;
  return <PromoCarousel data={data} minHeight="50vh" />;
}

export const bodegaComponentMap: Record<string, ComponentType<DynamicLayoutComponentProps>> = {
  "about-bodega": AboutBodegaWrapper,
  "team-bodega": TeamBodegaWrapper,
  "fincas-bodega": FincasBodegaWrapper,
  "promo-carousel": PromoCarouselWrapper,
};

type GetComponentPropsContext = {
  cmsLoading: boolean;
  cmsError: string | null;
  pageComponents?: CMSComponent[];
};

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
      return { loading: cmsLoading, error: cmsError, data: mapPromoCarouselFromCms(raw) as unknown as Record<string, unknown> };
    default:
      return { loading: cmsLoading, error: cmsError, data: raw };
  }
}
