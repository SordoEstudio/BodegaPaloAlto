/**
 * Skeleton alto para la página bodega (CMS): evita el salto de ~40vh → página completa
 * que dispara CLS en el footer.
 */
export function BodegaPageSkeleton(_props?: { type?: string }) {
  return (
    <div className="min-h-[3400px] animate-pulse">
      <div className="min-h-screen w-full bg-zinc-300/20" />

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="mx-auto h-80 w-full max-w-xs rounded-lg bg-zinc-300/25 lg:col-span-4" />
          <div className="space-y-4 lg:col-span-8">
            <div className="h-9 w-2/3 rounded bg-zinc-300/25" />
            <div className="h-4 w-full rounded bg-zinc-300/15" />
            <div className="h-4 w-11/12 rounded bg-zinc-300/15" />
            <div className="h-4 w-10/12 rounded bg-zinc-300/15" />
          </div>
        </div>
      </div>

      <div className="h-48 w-full bg-zinc-300/15" />

      <div className="border-t border-zinc-300/10 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-8 h-8 w-48 rounded bg-zinc-300/25" />
          <div className="flex justify-center gap-4">
            <div className="h-10 w-40 rounded-full bg-zinc-300/20" />
            <div className="h-10 w-40 rounded-full bg-zinc-300/15" />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="mt-12 grid gap-10 lg:grid-cols-2">
              <div className="aspect-4/3 w-full rounded-lg bg-zinc-300/20" />
              <div className="space-y-3 pt-4">
                <div className="h-6 w-1/2 rounded bg-zinc-300/20" />
                <div className="h-4 w-full rounded bg-zinc-300/15" />
                <div className="h-4 w-5/6 rounded bg-zinc-300/15" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
