import Image from "next/image";
import type { BodegaEquipoData } from "@/types/sections";

interface BodegaEquipoFichasProps {
  data: BodegaEquipoData;
}

export function BodegaEquipoFichas({ data }: BodegaEquipoFichasProps) {
  const { sectionTitle, members, avatarLayout } = data;
  if (!members?.length) return null;
  const avatarLeft = avatarLayout === "left";

  return (
    <section
      className="bg-background border-t border-zinc-200 px-6 py-16"
      aria-labelledby="equipo-heading"
    >
      <div className="mx-auto max-w-6xl">
        {sectionTitle ? (
          <h2
            id="equipo-heading"
            className="font-heading text-center text-2xl font-bold text-palo-alto-secondary sm:text-3xl"
          >
            {sectionTitle}
          </h2>
        ) : null}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.id}
              className={`flex overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md ${
                avatarLeft ? "flex-row" : "flex-col"
              }`}
            >
              <div
                className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-zinc-50 ${
                  avatarLeft ? "aspect-square w-28" : "aspect-square w-full"
                }`}
              >
                {member.imageSrc ? (
                  <Image
                    src={member.imageSrc}
                    alt={member.imageAlt ?? member.name}
                    fill
                    className="object-cover"
                    sizes={avatarLeft ? "112px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                  />
                ) : (
                  <span
                    className="font-heading text-4xl font-semibold text-palo-alto-primary/60"
                    aria-hidden
                  >
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center p-4">
                <h3 className="font-heading text-lg font-semibold text-palo-alto-secondary">
                  {member.name}
                </h3>
                {member.role ? (
                  <p className="mt-1 text-sm font-medium text-palo-alto-primary">
                    {member.role}
                  </p>
                ) : null}
                {member.bio ? (
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                    {member.bio}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
