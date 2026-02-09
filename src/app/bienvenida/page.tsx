import { WelcomeContent } from "@/components/WelcomeContent";
import { getWelcomeData } from "@/lib/data";

interface PageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function BienvenidaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = getWelcomeData(params.locale);
  return <WelcomeContent data={data} />;
}
