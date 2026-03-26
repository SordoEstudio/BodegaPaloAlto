export default function ProductosLoading() {
  return (
    <div className="min-h-screen bg-header-bg animate-pulse">
      {/* Hero / lineas skeleton */}
      <div className="h-48 w-full bg-white/5" />

      {/* Filtros skeleton */}
      <div className="mx-auto max-w-6xl px-6 py-6 flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-white/10" />
        ))}
      </div>

      {/* Grid de productos skeleton */}
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <div className="h-56 w-full bg-white/10" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-4/5 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
