import type { DestileriaMomentsGridData } from "@/types/sections";

interface DestileriaMomentsGridProps {
  data: DestileriaMomentsGridData;
}

/** Grid 2x2 de “momentos” (tarjetas con hover). Misma estética de tarjetas del sitio. */
export function DestileriaMomentsGrid({ data }: DestileriaMomentsGridProps) {
  const { title, moments } = data;

  return (
    <section className="destileria-section overflow-hidden py-16 md:py-24" aria-labelledby="destileria-moments-heading">
      <div className="relative bg-magic-stone-bg py-16">
        <div className="absolute inset-0 bg-magic-stone-bg/95" aria-hidden />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <h2
            id="destileria-moments-heading"
            className="font-heading text-center text-2xl font-bold text-magic-stone-primary sm:text-3xl"
          >
            {title}
          </h2>
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2" role="list">
            {moments.map((moment, i) => (
              <li key={i} role="listitem">
                <div className="rounded-xl border border-magic-stone-primary/30 bg-white/5 px-6 py-8 text-center font-medium text-white/95 shadow-lg transition hover:-translate-y-0.5 hover:border-magic-stone-primary/60 hover:bg-white/10 hover:shadow-xl">
                  {moment}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
