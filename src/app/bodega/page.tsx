import { getBodegaData } from "@/lib/data";
import { BodegaQuienesSomos } from "@/components/bodega/BodegaQuienesSomos";
import { BodegaEquipoFichas } from "@/components/bodega/BodegaEquipoFichas";
import { BodegaFincasSection } from "@/components/bodega/BodegaFincasSection";

export const metadata = {
  title: "Bodega | Bodega Palo Alto",
  description:
    "Quiénes somos, nuestro equipo y nuestras fincas: Alto Ugarteche y Palo Alto en Mendoza, Argentina.",
};

export default async function BodegaPage() {
  const data = getBodegaData("es");

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
