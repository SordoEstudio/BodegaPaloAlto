import { ContactPageWithCMS } from "@/components/contact/ContactPageWithCMS";
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
  const title = isEn ? "Contact" : "Contacto";
  const description = isEn
    ? "Get in touch. Bodega Palo Alto and Magic Stone Distillery, Mendoza."
    : "Escribinos. Bodega Palo Alto y Destilería Magic Stone, Mendoza. Ubicación, redes y formulario de contacto.";
  return {
    title,
    description,
    alternates: getLocalizedAlternates("/contacto"),
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${loc}/contacto`,
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
