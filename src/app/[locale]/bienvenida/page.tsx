import { WelcomeContent } from "@/components/WelcomeContent";
import { getWelcomeData } from "@/lib/data";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BienvenidaPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/bienvenida`);
  }

  const data = getWelcomeData(locale);
  return <WelcomeContent data={data} locale={locale} />;
}
