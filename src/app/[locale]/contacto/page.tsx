import { ContactPageWithCMS } from "@/components/contact/ContactPageWithCMS";
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
  const title = isEn ? "Contact Bodega Palo Alto" : "Contacto – Bodega Palo Alto";
  const description = isEn
    ? "Contact Bodega Palo Alto and Magic Stone Distillery in Mendoza, Argentina. Find our location, social channels, and reach us via our contact form."
    : "Escribinos. Bodega Palo Alto y Destilería Magic Stone, Mendoza. Ubicación, redes y formulario de contacto.";
  return {
    title,
    description,
    alternates: getLocalizedAlternates("/contacto", loc),
    openGraph: {
      title,
      description,
      type: "website",
      url: `${getSiteUrl()}/${loc}/contacto`,
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

export default async function ContactoPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/contacto`);
  }

  return <ContactPageWithCMS locale={locale} sourcePage="contacto" />;
}
