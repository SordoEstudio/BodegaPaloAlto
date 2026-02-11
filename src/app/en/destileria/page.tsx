import { getDestileriaData } from "@/lib/data";
import { DestileriaHero } from "@/components/destileria/DestileriaHero";
import { DestileriaStorySplit } from "@/components/destileria/DestileriaStorySplit";
import { DestileriaTextHighlight } from "@/components/destileria/DestileriaTextHighlight";
import { DestileriaMissionVision } from "@/components/destileria/DestileriaMissionVision";
import { DestileriaManifesto } from "@/components/destileria/DestileriaManifesto";

export const metadata = {
  title: "Magic Stone | Tandil Distillery | Bodega Palo Alto",
  description:
    "Author-crafted spirits born in Tandil. Technical craftsmanship and locally rooted identity.",
};

export default async function DestileriaEnPage() {
  const data = getDestileriaData("en");

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
      <DestileriaManifesto data={data.manifesto} />
    </>
  );
}
