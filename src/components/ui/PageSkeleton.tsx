"use client";

interface PageSkeletonProps {
  compact?: boolean;
}

export function PageSkeleton({ compact = false }: PageSkeletonProps) {
  return (
    <div className="animate-pulse">
      <section className={`${compact ? "h-[32vh]" : "h-[46vh]"} w-full bg-zinc-300/40`} />

      <section className="mx-auto w-full max-w-6xl space-y-6 px-6 py-10 md:py-14">
        <div className="h-8 w-56 rounded bg-zinc-300/40" />
        <div className="h-4 w-full rounded bg-zinc-300/30" />
        <div className="h-4 w-11/12 rounded bg-zinc-300/30" />
        <div className="h-4 w-9/12 rounded bg-zinc-300/30" />
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 pb-12 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: compact ? 3 : 6 }).map((_, idx) => (
          <article key={idx} className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white/70">
            <div className="h-40 w-full bg-zinc-300/30" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 rounded bg-zinc-300/40" />
              <div className="h-3 w-full rounded bg-zinc-300/30" />
              <div className="h-3 w-5/6 rounded bg-zinc-300/30" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
