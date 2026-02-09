"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomeCarouselLineasData } from "@/types/sections";

interface HomeCarouselLineasProps {
  data: HomeCarouselLineasData;
}

export function HomeCarouselLineas({ data }: HomeCarouselLineasProps) {
  const { sectionTitle, lineas } = data;
  if (!lineas?.length) return null;

  return (
    <section
      id="vinos"
      className="  px-6 py-10 text-white"
      aria-labelledby="carousel-lineas-heading"
    >
      <div className="mx-auto max-w-6xl">
{/*         <h2
          id="carousel-lineas-heading"
          className="font-heading text-left text-2xl font-bold sm:text-3xl"
        >
          {sectionTitle}
        </h2> */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
          {lineas.map((linea) => (
            <Link
              key={linea.id}
              href={linea.href}
              className="group flex flex-col items-center rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm transition focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 focus:ring-offset-palo-alto-secondary hover:bg-white/10 hover:border-white/30"
            >
              <span className="relative inline-block h-[85px] w-[145px] overflow-hidden rounded-lg">
                <Image
                  src={linea.imageSrc}
                  alt={linea.imageAlt}
                  width={145}
                  height={85}
                  className="object-cover transition group-hover:scale-105"
                />
              </span>
              <span className="mt-3 text-center font-semibold">
                {linea.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
