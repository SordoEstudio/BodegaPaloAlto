export default function ContactoLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero / banner */}
      <div className="h-40 w-full bg-zinc-300/20" />

      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Info de contacto */}
          <div className="space-y-6">
            <div className="h-7 w-48 rounded bg-zinc-300/30" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-300/20" />
                  <div className="h-4 w-48 rounded bg-zinc-300/20" />
                </div>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div className="space-y-5">
            <div className="h-7 w-40 rounded bg-zinc-300/30" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 rounded bg-zinc-300/20" />
                <div className="h-11 w-full rounded-lg bg-zinc-300/15" />
              </div>
            ))}
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-zinc-300/20" />
              <div className="h-28 w-full rounded-lg bg-zinc-300/15" />
            </div>
            <div className="h-11 w-full rounded-lg bg-zinc-300/25" />
          </div>
        </div>
      </div>
    </div>
  );
}
