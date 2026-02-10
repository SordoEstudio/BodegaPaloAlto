import Image from "next/image";
import Link from "next/link";
import type { HomeProductosDestacadosData } from "@/types/sections";

interface HomeProductosDestacadosProps {
  data: HomeProductosDestacadosData;
}

export function HomeProductosDestacados({ data }: HomeProductosDestacadosProps) {
  const { sectionTitle, products } = data;
  if (!products?.length) return null;

  return (
    <section
      className="bg-[var(--background)] px-6 py-16"
      aria-labelledby="productos-destacados-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="productos-destacados-heading"
          className="font-heading text-center text-2xl font-bold text-palo-alto-secondary sm:text-3xl"
        >
          {sectionTitle}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 hover:shadow-md"
            >
              <span className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-zinc-50">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  fill
                  className="object-contain p-2 transition group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </span>
              <span className="p-2 text-center text-sm font-semibold text-palo-alto-secondary">
                {product.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
