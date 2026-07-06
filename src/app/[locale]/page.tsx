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
  const title = isEn
    ? "Palo Alto Winery & Distillery – Mendoza, Argentina"
    : "Bodega Palo Alto – Vinos y Espumantes | Mendoza, Argentina";
  const description = isEn
    ? "Palo Alto winery in Mendoza, Argentina. Author-crafted wines, sparkling wines and Magic Stone craft spirits from estate vineyards."
    : "Bodega Palo Alto en Mendoza, Argentina. Vinos y espumantes de autor elaborados en fincas propias, junto a la destilería artesanal Magic Stone.";

  return {
    title,
    description,
    alternates: getLocalizedAlternates("/", loc),
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
