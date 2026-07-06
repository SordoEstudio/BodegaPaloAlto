"use client";

import { useParams } from "next/navigation";
import { DynamicLayout } from "@/portable-dynamic-cms";
import {
  cmsTypeToLayoutName,
  bodegaComponentMap as componentMap,
  getBodegaComponentProps,
} from "@/lib/cms-bodega-map";
import { getBodegaData } from "@/lib/data";
import { BodegaQuienesSomos } from "@/components/bodega/BodegaQuienesSomos";
import { BodegaFincasSection } from "@/components/bodega/BodegaFincasSection";
import { BodegaPageSkeleton } from "@/components/bodega/BodegaPageSkeleton";
import { isValidLocale } from "@/lib/i18n";
import { getUITranslations } from "@/lib/ui-translations";

function BodegaStaticContent() {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "es";
  const loc = isValidLocale(locale) ? locale : "es";
  const data = getBodegaData(loc);

  return (
    <>
      <BodegaQuienesSomos data={data.quienesSomos} equipo={data.equipo} />
      <BodegaFincasSection
        data={data.fincasSection}
        finca1={data.finca1}
        finca2={data.finca2}
      />
    </>
  );
}

function BodegaEmptyFallback({ pageType }: { pageType?: string }) {
  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : "es";
  const locale = isValidLocale(rawLocale) ? rawLocale : "es";
  const t = getUITranslations(locale);
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-muted-foreground">
        {t.cms.emptyPagePrefix} &quot;{pageType ?? "Bodega"}&quot;.
      </p>
      <p className="text-sm text-muted-foreground/80">{t.cms.bodegaEmptyHelp}</p>
    </div>
  );
}

interface BodegaPageWithCMSProps {
  useCmsLayout: boolean;
}

export function BodegaPageWithCMS({ useCmsLayout }: BodegaPageWithCMSProps) {
  if (!useCmsLayout) {
    return <BodegaStaticContent />;
  }

  return (
    <DynamicLayout
      pageType="bodega"
      cmsTypeToLayoutName={cmsTypeToLayoutName}
      componentMap={componentMap}
      getComponentProps={getBodegaComponentProps}
      excludeLayoutNames={["team-bodega"]}
      EmptyComponent={BodegaEmptyFallback}
      LoadingComponent={BodegaPageSkeleton}
    />
  );
}
