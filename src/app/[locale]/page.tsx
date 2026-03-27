import { HomePageWithCMS } from "@/components/home/HomePageWithCMS";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { redirect } from "next/navigation";
import { getLocalizedAlternates, getDefaultOgImage } from "@/lib/seo";

const useCmsLayout = process.env.NEXT_PUBLIC_USE_CMS_LAYOUT === "true";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const isEn = loc === "en";
  const title = isEn ? "Winery and Distillery in Mendoza" : "Bodega y Destilería en Mendoza";
  const description = isEn
    ? "Bodega Palo Alto: wines and sparkling wines from Mendoza, plus Magic Stone craft distillery."
    : "Bodega Palo Alto: vinos y espumantes de Mendoza, junto a la destilería artesanal Magic Stone.";

  return {
    title,
    description,
    alternates: getLocalizedAlternates("/"),
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${loc}`,
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

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}`);
  }

  return <HomePageWithCMS useCmsLayout={useCmsLayout} />;
}
