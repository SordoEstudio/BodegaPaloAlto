export default function DestileriaLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero */}
      <div className="h-[55vh] w-full bg-zinc-300/20" />

      {/* Contenido principal */}
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-14">
        <div className="h-8 w-72 rounded bg-zinc-300/30" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-zinc-300/20" />
          <div className="h-4 w-11/12 rounded bg-zinc-300/20" />
          <div className="h-4 w-10/12 rounded bg-zinc-300/20" />
          <div className="h-4 w-9/12 rounded bg-zinc-300/20" />
        </div>
      </div>

      {/* Productos destilería */}
      <div className="mx-auto max-w-4xl px-6 pb-14">
        <div className="mb-6 h-6 w-40 rounded bg-zinc-300/20" />
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
