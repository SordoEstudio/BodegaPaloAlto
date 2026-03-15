import { ProductosPageClient } from "@/components/products/ProductosPageClient";
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
    title: isEn ? "Our Products | Bodega Palo Alto" : "Nuestros Productos | Bodega Palo Alto",
    description: isEn
      ? "Discover our selection of wines and sparkling wines from Mendoza, Argentina."
      : "Descubrí nuestra selección de vinos y espumantes de Mendoza, Argentina.",
  };
}

export default async function ProductosPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/productos`);
  }

  return <ProductosPageClient locale={locale} />;
}
