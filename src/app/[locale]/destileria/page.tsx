import { DestileriaPageWithCMS } from "@/components/destileria/DestileriaPageWithCMS";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { getLocalizedAlternates, getDefaultOgImage } from "@/lib/seo";
import { redirect } from "next/navigation";

const useCmsLayout = process.env.NEXT_PUBLIC_USE_CMS_LAYOUT === "true";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const isEn = loc === "en";
  const title = isEn ? "Magic Stone Distillery | Palo Alto Argentina" : "Magic Stone | Destilería Artesanal – Palo Alto Argentina";
  const description = isEn
    ? "Magic Stone craft distillery by Bodega Palo Alto, Argentina. Author-crafted spirits born in Tandil with technical craftsmanship and local identity."
    : "Destilería artesanal Magic Stone de Bodega Palo Alto, Argentina. Destilados de autor nacidos en Tandil, con identidad local y artesanía técnica.";
  return {
    title,
    description,
    alternates: getLocalizedAlternates("/destileria", loc),
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${loc}/destileria`,
      images: [{ url: getDefaultOgImage() }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getDefaultOgImage()],
    },
  };
}

export default async function DestileriaPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/destileria`);
  }

  return <DestileriaPageWithCMS useCmsLayout={useCmsLayout} />;
}
