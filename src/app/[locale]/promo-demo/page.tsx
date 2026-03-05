import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { redirect } from "next/navigation";
import { mapPromoCarouselFromCms } from "@/lib/data";
import { PromoCarousel } from "@/components/promo/PromoCarousel";
import carouselMock from "@/data/carousel-promociones-mock.json";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata = {
  title: "Demo carrusel promociones | Bodega Palo Alto",
  description: "Vista previa del carrusel de promociones con ambos tipos de slide.",
};

export default async function PromoDemoPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/promo-demo`);
  }

  const data = mapPromoCarouselFromCms(carouselMock.data as Record<string, unknown>);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading mb-2 text-2xl font-bold text-palo-alto-secondary">
        Demo: Carrusel de promociones
      </h1>
      <p className="mb-8 text-foreground/80">
        Ambos tipos de slide (solo imagen + imagen con texto). Flechas e indicadores visibles al hacer hover.
      </p>
      <PromoCarousel data={data} minHeight="50vh" className="border border-palo-alto-secondary/20" />
    </div>
  );
}
