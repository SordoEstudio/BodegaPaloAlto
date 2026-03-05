"use client";

import { useParams } from "next/navigation";
import { DynamicLayout } from "@/portable-dynamic-cms";
import {
  cmsTypeToLayoutName,
  componentMap,
  getDestileriaComponentProps,
} from "@/lib/cms-layout-map";
import { getDestileriaData } from "@/lib/data";
import { DestileriaHero } from "@/components/destileria/DestileriaHero";
import { DestileriaStorySplit } from "@/components/destileria/DestileriaStorySplit";
import { DestileriaTextHighlight } from "@/components/destileria/DestileriaTextHighlight";
import { DestileriaMissionVision } from "@/components/destileria/DestileriaMissionVision";
import { DestileriaManifesto } from "@/components/destileria/DestileriaManifesto";
import { isValidLocale } from "@/lib/i18n";

function DestileriaStaticContent() {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "es";
  const loc = isValidLocale(locale) ? locale : "es";
  const data = getDestileriaData(loc);

  return (
    <>
      <DestileriaHero data={data.hero} />
      {data.storySplits.map((section, i) => (
        <DestileriaStorySplit key={section.title ?? `story-${i}`} data={section} />
      ))}
      {data.textHighlights.map((section, i) => (
        <DestileriaTextHighlight key={section.title ?? i} data={section} />
      ))}
      <DestileriaMissionVision data={data.missionVision} />
      <DestileriaTextHighlight data={data.textPromises} />
      <DestileriaManifesto data={data.manifesto} />
    </>
  );
}

function DestileriaEmptyFallback({ pageType }: { pageType?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-muted-foreground">
        No hay componentes de destilería configurados para la página &quot;{pageType ?? "Destilería"}&quot;.
      </p>
      <p className="text-sm text-muted-foreground/80">
        Conecta la API del CMS y configura componentes <code className="rounded bg-muted px-1.5 py-0.5">portada_destileria</code>, <code className="rounded bg-muted px-1.5 py-0.5">historia_destileria</code>, <code className="rounded bg-muted px-1.5 py-0.5">banner_full</code>, <code className="rounded bg-muted px-1.5 py-0.5">mision_vision_values</code>, <code className="rounded bg-muted px-1.5 py-0.5">manifest</code> con <code className="rounded bg-muted px-1.5 py-0.5">page: &quot;destileria&quot;</code>.
      </p>
    </div>
  );
}

interface DestileriaPageWithCMSProps {
  useCmsLayout: boolean;
}

export function DestileriaPageWithCMS({ useCmsLayout }: DestileriaPageWithCMSProps) {
  if (!useCmsLayout) {
    return <DestileriaStaticContent />;
  }

  return (
    <DynamicLayout
      pageType="destileria"
      cmsTypeToLayoutName={cmsTypeToLayoutName}
      componentMap={componentMap}
      getComponentProps={getDestileriaComponentProps}
      EmptyComponent={DestileriaEmptyFallback}
    />
  );
}
