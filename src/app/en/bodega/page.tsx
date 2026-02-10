import { getBodegaData } from "@/lib/data";
import { BodegaQuienesSomos } from "@/components/bodega/BodegaQuienesSomos";
import { BodegaEquipoFichas } from "@/components/bodega/BodegaEquipoFichas";
import { BodegaFincasSection } from "@/components/bodega/BodegaFincasSection";

export const metadata = {
  title: "The Winery | Bodega Palo Alto",
  description:
    "About us, our team and our estates: Alto Ugarteche and Palo Alto in Mendoza, Argentina.",
};

export default async function BodegaEnPage() {
  const data = getBodegaData("en");

  return (
    <>
      <BodegaQuienesSomos data={data.quienesSomos} equipo={data.equipo} />
      {!data.quienesSomos.showEquipo && (
        <BodegaEquipoFichas data={data.equipo} />
      )}
      <BodegaFincasSection
        data={data.fincasSection}
        finca1={data.finca1}
        finca2={data.finca2}
      />
    </>
  );
}
