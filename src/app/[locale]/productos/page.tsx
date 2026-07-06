import { ProductosPageClient } from "@/components/products/ProductosPageClient";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { getLocalizedAlternates, getDefaultOgImage, getSiteUrl } from "@/lib/seo";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const isEn = loc === "en";
  const title = isEn ? "Our Products" : "Nuestros Productos";
  const description = isEn
    ? "Discover Bodega Palo Alto's selection of wines and sparkling wines from Mendoza, Argentina. Palo Alto – author-crafted wines from estate vineyards."
    : "Descubrí la selección de vinos y espumantes de Bodega Palo Alto, elaborados en fincas propias en Mendoza, Argentina.";
  return {
    title,
    description,
    alternates: getLocalizedAlternates("/productos", loc),
    openGraph: {
      title,
      description,
      type: "website",
      url: `${getSiteUrl()}/${loc}/productos`,
      locale: isEn ? "en_US" : "es_AR",
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

export default async function ProductosPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/productos`);
  }

  return <ProductosPageClient locale={locale} />;
}
