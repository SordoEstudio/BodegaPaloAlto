"use client";

import { useState } from "react";
import type { DestileriaMissionVisionData } from "@/types/sections";

interface DestileriaMissionVisionProps {
  data: DestileriaMissionVisionData;
}

type TabId = "mission" | "vision" | "values";

/** Misión, Visión y Valores: variante "tabs" (fondo oscuro) o "blocks" (fondo claro, bloques separados, estética del hero). */
export function DestileriaMissionVision({ data }: DestileriaMissionVisionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("mission");
  const { mission, vision, values, tabLabels, layout = "tabs" } = data;
  const labels = tabLabels ?? { mission: "Misión", vision: "Visión", values: "Valores" };

  const sectionTitle = labels.values === "Values" ? "Principles" : "Principios";

  if (layout === "blocks") {
    return (
      <section
        className="destileria-section bg-background py-16 md:py-24"
        aria-labelledby="destileria-principles-heading"
      >
        <div className="mx-auto max-w-4xl px-6">
          <h2
            id="destileria-principles-heading"
            className="font-destileria-hero text-center text-2xl tracking-tight text-magic-stone-primary sm:text-3xl"
          >
            {sectionTitle}
          </h2>

          <div className="mt-16 space-y-16">
            <div className="flex flex-col gap-8 md:flex-row md:gap-0 md:divide-x md:divide-zinc-200/80">
              <article className="flex-1 pb-0 md:pr-12 md:pb-0">
                <h3 className="font-destileria-hero text-lg uppercase text-center tracking-tight text-magic-stone-primary sm:text-xl">
                  {labels.mission}
                </h3>
                <p className="mt-4 max-w-3xl leading-relaxed text-foreground/90">{mission}</p>
              </article>

              <article className="flex-1 pb-0 md:pl-12 md:pb-0">
                <h3 className="font-destileria-hero text-lg uppercase text-center tracking-tight text-magic-stone-primary sm:text-xl">
                  {labels.vision}
                </h3>
                <p className="mt-4 max-w-3xl leading-relaxed text-foreground/90">{vision}</p>
              </article>
            </div>

            <article>
              <h3 className="font-destileria-hero text-lg uppercase   tracking-tight text-magic-stone-primary sm:text-xl text-center">
                {labels.values}
              </h3>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {values.map((v) => (
                  <li
                    key={v.key}
                    className="rounded-xl border border-magic-stone-primary/40 bg-white p-6 shadow-sm"
                    role="listitem"
                  >
                    <h4 className="font-heading text-center text-base font-semibold text-magic-stone-primary">
                      {v.title}
                    </h4>
                    <p className="mt-2 text-center text-sm leading-relaxed text-foreground/85">{v.description}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    );
  }

  const tabBase =
    "font-heading px-5 py-3 text-base font-semibold transition-colors duration-200 rounded-t-xl focus:outline-none focus:ring-0";
  const tabInactive = "text-white/80 hover:text-white hover:bg-white/10";
  const tabActive = "text-white bg-white/15";

  return (
    <section className="destileria-section py-16 md:py-24" aria-labelledby="destileria-principles-heading">
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="destileria-principles-heading"
          className="font-heading text-center text-2xl font-bold text-white sm:text-3xl"
        >
          {sectionTitle}
        </h2>

        <div className="mt-12 overflow-hidden rounded-2xl border border-magic-stone-primary/50 bg-magic-stone-bg">
          <div
            className="flex gap-1 border-b border-white/15 px-2 pt-2"
            role="tablist"
            aria-label="Misión, Visión, Valores"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "mission"}
              aria-controls="panel-principles"
              id="tab-mission"
              className={`${tabBase} ${activeTab === "mission" ? tabActive : tabInactive}`}
              onClick={() => setActiveTab("mission")}
            >
              {labels.mission}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "vision"}
              aria-controls="panel-principles"
              id="tab-vision"
              className={`${tabBase} ${activeTab === "vision" ? tabActive : tabInactive}`}
              onClick={() => setActiveTab("vision")}
            >
              {labels.vision}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "values"}
              aria-controls="panel-principles"
              id="tab-values"
              className={`${tabBase} ${activeTab === "values" ? tabActive : tabInactive}`}
              onClick={() => setActiveTab("values")}
            >
              {labels.values}
            </button>
          </div>

          <div
            id="panel-principles"
            role="tabpanel"
            aria-labelledby={activeTab === "mission" ? "tab-mission" : activeTab === "vision" ? "tab-vision" : "tab-values"}
            className="p-8"
          >
            {activeTab === "mission" && (
              <p className="max-w-3xl leading-relaxed text-white/95">{mission}</p>
            )}
            {activeTab === "vision" && (
              <p className="max-w-3xl leading-relaxed text-white/95">{vision}</p>
            )}
            {activeTab === "values" && (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {values.map((v) => (
                  <li key={v.key} className="rounded-xl border border-magic-stone-primary/40 bg-white/5 p-6" role="listitem">
                    <h3 className="font-heading text-lg font-semibold text-magic-stone-primary">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/90">{v.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
