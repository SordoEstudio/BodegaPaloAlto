import { getContactPageData } from "@/lib/data";
import { ContactPageSection } from "@/components/contact/ContactPageSection";
import { ContactSplit } from "@/components/contact/ContactSplit";
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
    title: isEn ? "Contact | Bodega Palo Alto" : "Contacto | Bodega Palo Alto",
    description: isEn
      ? "Get in touch. Bodega Palo Alto and Magic Stone Distillery, Mendoza."
      : "Escribinos. Bodega Palo Alto y Destilería Magic Stone, Mendoza. Ubicación, redes y formulario de contacto.",
  };
}

export default async function ContactoPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/contacto`);
  }

  const data = getContactPageData(locale);

  return (
    <>
      <ContactPageSection data={data} locale={locale} sourcePage="contacto" />
    </>
  );
}
