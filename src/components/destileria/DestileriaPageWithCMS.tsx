"use client";

import { useParams } from "next/navigation";
import { DynamicLayout } from "@/portable-dynamic-cms";
import {
  cmsTypeToLayoutName,
  destileriaComponentMap as componentMap,
  getDestileriaComponentProps,
} from "@/lib/cms-destileria-map";
import { getDestileriaData } from "@/lib/data";
import { DestileriaHero } from "@/components/destileria/DestileriaHero";
import { DestileriaStorySplit } from "@/components/destileria/DestileriaStorySplit";
import { DestileriaTextHighlight } from "@/components/destileria/DestileriaTextHighlight";
import { DestileriaMissionVision } from "@/components/destileria/DestileriaMissionVision";
import { DestileriaManifesto } from "@/components/destileria/DestileriaManifesto";
import { DestileriaPageSkeleton } from "@/components/destileria/DestileriaPageSkeleton";
import { isValidLocale } from "@/lib/i18n";
import { getUITranslations } from "@/lib/ui-translations";

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
  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : "es";
  const locale = isValidLocale(rawLocale) ? rawLocale : "es";
  const t = getUITranslations(locale);
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-muted-foreground">
        {t.cms.emptyPagePrefix} &quot;{pageType ?? "Destilería"}&quot;.
      </p>
      <p className="text-sm text-muted-foreground/80">{t.cms.destileriaEmptyHelp}</p>
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
      LoadingComponent={DestileriaPageSkeleton}
    />
  );
}
