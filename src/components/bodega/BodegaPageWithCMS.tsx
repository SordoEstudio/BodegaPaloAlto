"use client";

import { useParams } from "next/navigation";
import { DynamicLayout } from "@/portable-dynamic-cms";
import {
  cmsTypeToLayoutName,
  componentMap,
  getBodegaComponentProps,
} from "@/lib/cms-layout-map";
import { getBodegaData } from "@/lib/data";
import { BodegaQuienesSomos } from "@/components/bodega/BodegaQuienesSomos";
import { BodegaFincasSection } from "@/components/bodega/BodegaFincasSection";
import { isValidLocale } from "@/lib/i18n";

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
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-muted-foreground">
        No hay componentes de bodega configurados para la página &quot;{pageType ?? "Bodega"}&quot;.
      </p>
      <p className="text-sm text-muted-foreground/80">
        Conecta la API del CMS y configura <code className="rounded bg-muted px-1.5 py-0.5">about</code> (con equipo opcional integrado) y <code className="rounded bg-muted px-1.5 py-0.5">fincas</code> con <code className="rounded bg-muted px-1.5 py-0.5">page: &quot;bodega&quot;</code>.
      </p>
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
    />
  );
}
