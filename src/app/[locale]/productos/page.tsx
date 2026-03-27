import { ProductosPageClient } from "@/components/products/ProductosPageClient";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { getLocalizedAlternates, getDefaultOgImage } from "@/lib/seo";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const isEn = loc === "en";
  const title = isEn ? "Our Products" : "Nuestros Productos";
  const description = isEn
    ? "Discover our selection of wines and sparkling wines from Mendoza, Argentina."
    : "Descubrí nuestra selección de vinos y espumantes de Mendoza, Argentina.";
  return {
    title,
    description,
    alternates: getLocalizedAlternates("/productos"),
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${loc}/productos`,
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
