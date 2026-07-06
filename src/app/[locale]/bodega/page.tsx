import { BodegaPageWithCMS } from "@/components/bodega/BodegaPageWithCMS";
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
  const title = isEn ? "Palo Alto Winery – Who We Are" : "Bodega Palo Alto – Quiénes Somos";
  const description = isEn
    ? "Palo Alto winery in Mendoza, Argentina. Our story, team and estate vineyards: Alto Ugarteche and Palo Alto."
    : "Bodega Palo Alto en Mendoza, Argentina. Nuestra historia, equipo y fincas: Alto Ugarteche y Palo Alto.";
  return {
    title,
    description,
    alternates: getLocalizedAlternates("/bodega", loc),
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${loc}/bodega`,
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

export default async function BodegaPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/bodega`);
  }

  return <BodegaPageWithCMS useCmsLayout={useCmsLayout} />;
}
