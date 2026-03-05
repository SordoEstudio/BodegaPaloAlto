import { DestileriaPageWithCMS } from "@/components/destileria/DestileriaPageWithCMS";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { redirect } from "next/navigation";

const useCmsLayout = process.env.NEXT_PUBLIC_USE_CMS_LAYOUT === "true";

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

  return <DestileriaPageWithCMS useCmsLayout={useCmsLayout} />;
}
