"use client";

interface ContactPageSkeletonProps {
  withCarousel?: boolean;
}

export function ContactPageSkeleton({ withCarousel = true }: ContactPageSkeletonProps) {
  return (
    <div className="animate-pulse">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-300/20" aria-hidden />
        <div className="relative z-10 grid min-h-[480px] grid-cols-1 lg:grid-cols-2">
          <div className="border-r border-white/20 px-6 py-12 lg:px-12 lg:py-16">
            <div className="mx-auto max-w-lg space-y-4">
              <div className="h-8 w-56 rounded bg-zinc-200/40" />
              <div className="h-4 w-11/12 rounded bg-zinc-200/30" />
              <div className="h-11 w-full rounded-lg bg-zinc-200/25" />
              <div className="h-11 w-full rounded-lg bg-zinc-200/25" />
              <div className="h-11 w-full rounded-lg bg-zinc-200/25" />
              <div className="h-32 w-full rounded-lg bg-zinc-200/20" />
              <div className="h-11 w-full rounded-lg bg-zinc-200/35" />
            </div>
          </div>
          <div className="px-6 py-12 lg:px-12 lg:py-16">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-white/10 px-6 py-8 lg:px-8 lg:py-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="h-6 w-44 rounded bg-zinc-200/40" />
                  <div className="h-px w-full bg-zinc-200/40" />
                  <div className="h-4 w-2/3 rounded bg-zinc-200/25" />
                  <div className="h-4 w-1/2 rounded bg-zinc-200/25" />
                </div>
                <div className="space-y-3">
                  <div className="h-6 w-44 rounded bg-zinc-200/40" />
                  <div className="h-px w-full bg-zinc-200/40" />
                  <div className="h-4 w-2/3 rounded bg-zinc-200/25" />
                  <div className="h-4 w-1/2 rounded bg-zinc-200/25" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {withCarousel ? (
        <section className="relative h-[50vh] min-h-[400px] w-full bg-zinc-300/20">
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200/40" />
          </div>
        </section>
      ) : null}
    </div>
  );
}
