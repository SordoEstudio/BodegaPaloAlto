"use client";

import { useParams } from "next/navigation";
import { DynamicLayout } from "@/portable-dynamic-cms";
import {
  cmsTypeToLayoutName,
  homeComponentMap as componentMap,
  getHomeComponentProps,
} from "@/lib/cms-home-map";
import { HomeProductosDestacados } from "@/components/home/HomeProductosDestacados";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { isValidLocale } from "@/lib/i18n";
import { getUITranslations } from "@/lib/ui-translations";

interface HomePageWithCMSProps {
  useCmsLayout: boolean;
}

export function HomePageWithCMS({ useCmsLayout }: HomePageWithCMSProps) {
  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : "es";
  const locale = isValidLocale(rawLocale) ? rawLocale : "es";
  const t = getUITranslations(locale);
  const HomeLoadingSkeleton = () => <PageSkeleton compact />;

  if (!useCmsLayout) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-center text-foreground/80">
        <p>{t.cms.enableCmsLayoutHint}</p>
      </div>
    );
  }

  return (
    <>
      <DynamicLayout
        pageType="Inicio"
        cmsTypeToLayoutName={cmsTypeToLayoutName}
        componentMap={componentMap}
        getComponentProps={getHomeComponentProps}
        overlayGroup={{ first: "home-hero", second: "home-carousel-lineas" }}
        LoadingComponent={HomeLoadingSkeleton}
      />
      {/* Fallback global: mostrar destacados aunque el CMS no envíe el bloque específico */}
      <HomeProductosDestacados data={{ sectionTitle: "", products: [] }} />
    </>
  );
}
