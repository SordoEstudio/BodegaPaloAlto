export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-header-bg animate-pulse">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-8 h-4 w-48 rounded bg-white/10" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Imagen */}
          <div className="aspect-square w-full rounded-xl bg-white/10" />

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div className="h-8 w-3/4 rounded bg-white/15" />
            <div className="h-5 w-1/2 rounded bg-white/10" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-11/12 rounded bg-white/10" />
              <div className="h-4 w-9/12 rounded bg-white/10" />
              <div className="h-4 w-10/12 rounded bg-white/10" />
            </div>
            {/* Ficha técnica */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-white/5 p-3">
                  <div className="mb-1 h-3 w-1/2 rounded bg-white/10" />
                  <div className="h-4 w-2/3 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
