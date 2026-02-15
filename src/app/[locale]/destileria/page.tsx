import { getDestileriaData } from "@/lib/data";
import { DestileriaHero } from "@/components/destileria/DestileriaHero";
import { DestileriaStorySplit } from "@/components/destileria/DestileriaStorySplit";
import { DestileriaTextHighlight } from "@/components/destileria/DestileriaTextHighlight";
import { DestileriaMissionVision } from "@/components/destileria/DestileriaMissionVision";
import { DestileriaManifesto } from "@/components/destileria/DestileriaManifesto";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const isEn = loc === "en";
  return {
    title: isEn
      ? "Magic Stone | Tandil Distillery | Bodega Palo Alto"
      : "Magic Stone | Destilería Tandil | Bodega Palo Alto",
    description: isEn
      ? "Author-crafted spirits born in Tandil. Technical craftsmanship and locally rooted identity."
      : "Destilados de autor nacidos en Tandil. Artesanía técnica, identidad local y bebidas pensadas para el encuentro.",
  };
}

export default async function DestileriaPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/destileria`);
  }

  const data = getDestileriaData(locale);

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
