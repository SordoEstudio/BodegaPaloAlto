import { getBodegaData } from "@/lib/data";
import { BodegaQuienesSomos } from "@/components/bodega/BodegaQuienesSomos";
import { BodegaEquipoFichas } from "@/components/bodega/BodegaEquipoFichas";
import { BodegaFincasSection } from "@/components/bodega/BodegaFincasSection";
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
    title: isEn ? "Winery | Bodega Palo Alto" : "Bodega | Bodega Palo Alto",
    description: isEn
      ? "Who we are, our team and our estates: Alto Ugarteche and Palo Alto, Mendoza, Argentina."
      : "Quiénes somos, nuestro equipo y nuestras fincas: Alto Ugarteche y Palo Alto en Mendoza, Argentina.",
  };
}

export default async function BodegaPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/bodega`);
  }

  const data = getBodegaData(locale);

  return (
    <>
      <BodegaQuienesSomos data={data.quienesSomos} equipo={data.equipo} />
      {!data.quienesSomos.showEquipo && <BodegaEquipoFichas data={data.equipo} />}
      <BodegaFincasSection
        data={data.fincasSection}
        finca1={data.finca1}
        finca2={data.finca2}
      />
    </>
  );
}
