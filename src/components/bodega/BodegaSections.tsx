import { BodegaQuienesSomos } from "@/components/bodega/BodegaQuienesSomos";
import { BodegaFincasSection } from "@/components/bodega/BodegaFincasSection";
import {
  mapAboutBodegaFromCms,
  mapTeamBodegaFromCms,
  mapFincasBodegaFromCms,
} from "@/lib/data";
import { getCmsComponents, filterByPage, sortByOrder } from "@/lib/cms-fetch";

const ABOUT_TYPES = new Set(["about", "quienes_somos"]);
const TEAM_TYPES = new Set(["team", "equipo", "nuestro_equipo"]);
const FINCAS_TYPES = new Set(["fincas"]);

interface BodegaSectionsProps {
  locale: string;
}

export async function BodegaSections({ locale }: BodegaSectionsProps) {
  const all = await getCmsComponents(locale);
  const pageComps = sortByOrder(filterByPage(all, "bodega"));
  if (pageComps.length === 0) return null;

  const aboutComp = pageComps.find((c) => ABOUT_TYPES.has(c.type));
  const teamComp = pageComps.find((c) => TEAM_TYPES.has(c.type));
  const fincasComp = pageComps.find((c) => FINCAS_TYPES.has(c.type));

  const aboutMapped = aboutComp
    ? mapAboutBodegaFromCms(aboutComp.data as Record<string, unknown>)
    : null;
  const fincas = fincasComp
    ? mapFincasBodegaFromCms(fincasComp.data as Record<string, unknown>, locale)
    : null;

  let aboutNode = null;
  if (aboutMapped) {
    const { equipo: aboutEquipo, ...quienesSomos } = aboutMapped;
    const teamData = aboutEquipo ?? (teamComp ? mapTeamBodegaFromCms(teamComp.data as Record<string, unknown>) : null);
    aboutNode = <BodegaQuienesSomos data={quienesSomos} equipo={teamData ?? null} />;
  }

  return (
    <>
      {aboutNode}
      {fincas && (
        <BodegaFincasSection data={fincas.section} finca1={fincas.finca1} finca2={fincas.finca2} />
      )}
    </>
  );
}
