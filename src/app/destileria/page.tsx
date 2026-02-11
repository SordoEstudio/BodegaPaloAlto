import { getDestileriaData } from "@/lib/data";
import { DestileriaHero } from "@/components/destileria/DestileriaHero";
import { DestileriaStorySplit } from "@/components/destileria/DestileriaStorySplit";
import { DestileriaTextHighlight } from "@/components/destileria/DestileriaTextHighlight";
import { DestileriaMissionVision } from "@/components/destileria/DestileriaMissionVision";
import { DestileriaManifesto } from "@/components/destileria/DestileriaManifesto";

export const metadata = {
  title: "Magic Stone | Destilería Tandil | Bodega Palo Alto",
  description:
    "Destilados de autor nacidos en Tandil. Artesanía técnica, identidad local y bebidas pensadas para el encuentro.",
};

export default async function DestileriaPage() {
  const data = getDestileriaData("es");

  return (
    <>
      <DestileriaHero data={data.hero} />
      {data.storySplits.map((section) => (
        <DestileriaStorySplit key={section.title} data={section} />
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
