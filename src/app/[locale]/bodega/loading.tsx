export default function BodegaLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero */}
      <div className="h-[55vh] w-full bg-zinc-300/20" />

      {/* Contenido principal */}
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-14">
        <div className="h-8 w-64 rounded bg-zinc-300/30" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-zinc-300/20" />
          <div className="h-4 w-11/12 rounded bg-zinc-300/20" />
          <div className="h-4 w-10/12 rounded bg-zinc-300/20" />
          <div className="h-4 w-9/12 rounded bg-zinc-300/20" />
        </div>
      </div>

      {/* Sección secundaria */}
      <div className="bg-zinc-100/10 py-14">
        <div className="mx-auto max-w-4xl space-y-6 px-6">
          <div className="h-6 w-48 rounded bg-zinc-300/20" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-zinc-300/10 p-6">
                <div className="mb-3 h-5 w-1/2 rounded bg-zinc-300/20" />
                <div className="h-3 w-full rounded bg-zinc-300/15" />
                <div className="mt-2 h-3 w-4/5 rounded bg-zinc-300/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
