/**
 * Skeleton alineado con la página real de destilería para evitar CLS cuando
 * DynamicLayout espera el CMS (placeholder corto → salto grande al contenido).
 */
export function DestileriaPageSkeleton(_props?: { type?: string }) {
  return (
    <div className="min-h-[4200px] animate-pulse">
      <div className="min-h-screen w-full bg-zinc-300/20" />

      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border-b border-zinc-300/10 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="h-8 w-64 rounded bg-zinc-300/25" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-zinc-300/15" />
              <div className="h-4 w-11/12 rounded bg-zinc-300/15" />
              <div className="h-4 w-10/12 rounded bg-zinc-300/15" />
            </div>
          </div>
        </div>
      ))}

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="mb-6 h-6 w-48 rounded bg-zinc-300/20" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-zinc-300/10">
              <div className="h-48 w-full bg-zinc-300/20" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-2/3 rounded bg-zinc-300/20" />
                <div className="h-3 w-full rounded bg-zinc-300/15" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
