import { HomePageWithCMS } from "@/components/home/HomePageWithCMS";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { redirect } from "next/navigation";

const useCmsLayout = process.env.NEXT_PUBLIC_USE_CMS_LAYOUT === "true";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}`);
  }

  return <HomePageWithCMS useCmsLayout={useCmsLayout} />;
}
