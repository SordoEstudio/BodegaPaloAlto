import Image from "next/image";
import type { BodegaQuienesSomosData, BodegaEquipoData } from "@/types/sections";

interface BodegaQuienesSomosProps {
  data: BodegaQuienesSomosData;
  equipo?: BodegaEquipoData | null;
}

/** Grid cols en desktop según cantidad de miembros (máx 4 por fila). */
const DESKTOP_GRID_COLS = ["lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"] as const;
function getDesktopGridCols(memberCount: number): string {
  const n = Math.min(4, Math.max(1, memberCount));
  return DESKTOP_GRID_COLS[n - 1];
}

export function BodegaQuienesSomos({ data, equipo }: BodegaQuienesSomosProps) {
  const {
    title,
    paragraphs,
    highlight,
    imageLeft,
    backgroundImage,
    showEquipo,
  } = data;

  const showTeam = showEquipo && equipo?.members?.length;
  const hasLeft = !!imageLeft?.imageSrc;
  const hasBg = !!backgroundImage?.imageSrc;

  if (!title && !paragraphs.length && !highlight && !hasLeft && !showTeam)
    return null;

  const paragraphClass = hasBg
    ? "text-white/95"
    : "text-foreground/90";
  const highlightClass = hasBg
    ? "text-palo-alto-primary font-semibold" // destaque claro sobre overlay
    : "text-palo-alto-primary font-semibold";

  const content = (
    <>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Columna izquierda: imagen opcional */}
          {hasLeft ? (
            <div className="flex items-start justify-center lg:col-span-4 lg:justify-start">
              <div className="relative aspect-2/3 w-full max-w-xs overflow-hidden rounded-lg bg-zinc-100 shadow-md">
                <Image
                  src={imageLeft.imageSrc}
                  alt={imageLeft.imageAlt ?? ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </div>
          ) : null}

          {/* Columna central: Quiénes somos (colores igualados al hero cuando hay fondo) */}
          <div
            className={
              hasLeft ? "lg:col-span-6" : "lg:col-span-12"
            }
          >
            {title ? (
              <h2
                id="quienes-somos-heading"
                className={`font-heading text-2xl font-bold sm:text-3xl ${hasBg ? "text-white" : "text-palo-alto-secondary"}`}
              >
                {title}
              </h2>
            ) : null}
            <div className="mt-6 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className={`text-base leading-relaxed ${paragraphClass}`}>
                  {p}
                </p>
              ))}
              {highlight ? (
                <p className={`font-heading pt-2 text-lg sm:text-xl ${highlightClass}`}>
                  {highlight}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Fila de equipo abajo: misma estética que carousel de líneas (cards hero), hasta 4 en fila en desktop */}
      {showTeam ? (
        <div
          className="relative z-10 px-6 pb-16 pt-0"
          aria-labelledby="equipo-quienes-somos-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h3
              id="equipo-quienes-somos-heading"
              className={`mb-8 font-heading text-xl font-bold sm:text-2xl ${hasBg ? "text-white" : "text-palo-alto-secondary"}`}
            >
              {equipo!.sectionTitle}
            </h3>
            <div
              className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 ${getDesktopGridCols(equipo!.members.length)}`}
            >
              {equipo!.members.map((member) => {
                const avatarLeft = equipo!.avatarLayout === "left";
                return (
                  <div
                    key={member.id}
                    className={`group flex rounded-xl border p-4 backdrop-blur-sm transition ${
                      avatarLeft ? "flex-row items-center gap-4" : "flex-col items-center"
                    } ${
                      hasBg
                        ? "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10"
                        : "border-palo-alto-secondary/20 bg-white/80 hover:border-palo-alto-primary/30 hover:bg-white/90"
                    }`}
                  >
                    <div
                      className={`relative shrink-0 overflow-hidden rounded-full border-2 ${
                        avatarLeft ? "h-14 w-14" : "h-20 w-20"
                      } ${
                        hasBg
                          ? "border-white/30 bg-white/10"
                          : "border-palo-alto-primary/20 bg-palo-alto-primary/10"
                      }`}
                    >
                      {member.imageSrc ? (
                        <Image
                          src={member.imageSrc}
                          alt={member.imageAlt ?? member.name}
                          fill
                          className="object-cover transition group-hover:scale-105"
                          sizes={avatarLeft ? "56px" : "80px"}
                        />
                      ) : (
                        <span
                          className={`flex h-full w-full items-center justify-center font-heading text-xl font-semibold ${avatarLeft ? "sm:text-2xl" : "text-2xl"} ${hasBg ? "text-white/90" : "text-palo-alto-primary"}`}
                          aria-hidden
                        >
                          {member.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className={avatarLeft ? "min-w-0 flex-1" : "w-full"}>
                      <p
                        className={`font-semibold ${hasBg ? "text-white" : "text-palo-alto-secondary"} ${avatarLeft ? "mt-0 text-left" : "mt-3 text-center"}`}
                      >
                        {member.name}
                      </p>
                      {member.role ? (
                        <p
                          className={`text-sm ${hasBg ? "text-white/90" : "text-palo-alto-primary"} ${avatarLeft ? "mt-0.5 text-left" : "mt-0.5 text-center"}`}
                        >
                          {member.role}
                        </p>
                      ) : null}
                      {member.bio ? (
                        <p
                          className={`mt-2 line-clamp-3 text-sm leading-relaxed ${avatarLeft ? "text-left" : "text-center"} ${hasBg ? "text-white/85" : "text-foreground/90"}`}
                        >
                          {member.bio}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );

  if (hasBg) {
    return (
      <section
        className="relative overflow-hidden bg-palo-alto-secondary"
        aria-labelledby="quienes-somos-heading"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          aria-hidden
        >
          <Image
            src={backgroundImage!.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {/* Overlay igual que hero: bg-black/70 */}
        <div className="absolute inset-0 z-1 bg-black/70" aria-hidden />
        {content}
      </section>
    );
  }

  return (
    <section
      className="bg-background"
      aria-labelledby="quienes-somos-heading"
    >
      {content}
    </section>
  );
}
