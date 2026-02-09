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
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2 hover:shadow-md"
            >
              <span className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </span>
              <span className="p-4 font-semibold text-palo-alto-secondary">
                {product.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
