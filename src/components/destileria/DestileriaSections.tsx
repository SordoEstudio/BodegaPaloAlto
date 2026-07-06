import { DestileriaHero } from "@/components/destileria/DestileriaHero";
import { DestileriaStorySplit } from "@/components/destileria/DestileriaStorySplit";
import { DestileriaTextHighlight } from "@/components/destileria/DestileriaTextHighlight";
import { DestileriaMissionVision } from "@/components/destileria/DestileriaMissionVision";
import { DestileriaManifesto } from "@/components/destileria/DestileriaManifesto";
import { HomeBanner } from "@/components/home/HomeBanner";
import {
  mapPortadaDestileriaFromCms,
  mapHistoriaDestileriaFromCms,
  mapBannerFullToHighlightFromCms,
  mapMissionVisionValuesFromCms,
  mapManifestFromCms,
  mapBannerFromCms,
} from "@/lib/data";
import { getCmsComponents, filterByPage, sortByOrder } from "@/lib/cms-fetch";
import type { DestileriaStorySplitData } from "@/types/sections";
import type { CMSComponent } from "@/portable-dynamic-cms/types/cms-components";
import type { ReactNode } from "react";

const HISTORIA_TYPES = new Set(["historia_destileria", "destileria_historia"]);
const HIGHLIGHT_TYPES = new Set(["banner_full", "banner_1", "banner_2", "banner_3"]);
const MISSION_TYPES = new Set(["mission_vision_values", "mision_vision_values", "mision_vision_valores"]);
const MANIFEST_TYPES = new Set(["manifest", "manifiesto"]);

function renderComponent(c: CMSComponent, key: string): ReactNode {
  const raw = (c.data ?? {}) as Record<string, unknown>;

  if (c.type === "portada_destileria") {
    return <DestileriaHero key={key} data={mapPortadaDestileriaFromCms(raw)} />;
  }
  if (HISTORIA_TYPES.has(c.type)) {
    const mapped = mapHistoriaDestileriaFromCms(raw);
    if ("storySplits" in mapped && Array.isArray(mapped.storySplits)) {
      return (
        <div key={key}>
          {mapped.storySplits.map((section: DestileriaStorySplitData, i: number) => (
            <DestileriaStorySplit key={section.title ?? `${key}-${i}`} data={section} />
          ))}
        </div>
      );
    }
    return <DestileriaStorySplit key={key} data={mapped as DestileriaStorySplitData} />;
  }
  if (HIGHLIGHT_TYPES.has(c.type)) {
    return <DestileriaTextHighlight key={key} data={mapBannerFullToHighlightFromCms(raw)} />;
  }
  if (MISSION_TYPES.has(c.type)) {
    return <DestileriaMissionVision key={key} data={mapMissionVisionValuesFromCms(raw)} />;
  }
  if (MANIFEST_TYPES.has(c.type)) {
    return <DestileriaManifesto key={key} data={mapManifestFromCms(raw)} />;
  }
  if (c.type === "home_banner" || c.type === "banner_con_imagen_de_fondo_2") {
    return <HomeBanner key={key} data={mapBannerFromCms(raw)} />;
  }
  return null;
}

interface DestileriaSectionsProps {
  locale: string;
}

export async function DestileriaSections({ locale }: DestileriaSectionsProps) {
  const all = await getCmsComponents(locale);
  const pageComps = sortByOrder(filterByPage(all, "destileria"));
  if (pageComps.length === 0) return null;

  return <>{pageComps.map((c, i) => renderComponent(c, c._id ?? `dest-${i}`))}</>;
}
