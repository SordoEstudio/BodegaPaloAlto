import { NextResponse } from "next/server";
import type { CMSComponent } from "@/portable-dynamic-cms/types/cms-components";
import heroEs from "@/data/es/home/hero.json";
import carouselLineasEs from "@/data/es/home/carousel-lineas.json";
import banner1Es from "@/data/es/home/banner-1.json";
import banner2Es from "@/data/es/home/banner-2.json";
import productosDestacadosEs from "@/data/es/home/productos-destacados.json";

export const dynamic = "force-dynamic";

const now = new Date().toISOString();
const client = { id: "palo-alto-1", name: "Bodega Palo Alto", slug: "palo-alto" };

function buildComponent(
  type: string,
  name: string,
  order: number,
  data: Record<string, unknown>
): CMSComponent {
  return {
    _id: `mock-${type}-${order}`,
    name,
    type,
    page: "Inicio",
    data: { ...data, _orden: order },
    status: "published",
    isActive: true,
    isVisible: true,
    createdAt: now,
    updatedAt: now,
    clientName: client.name,
  };
}

export async function GET() {
  const components: CMSComponent[] = [
    buildComponent("home_hero", "Hero inicio", 1, heroEs as Record<string, unknown>),
    buildComponent("home_carousel_lineas", "Carousel líneas", 2, carouselLineasEs as Record<string, unknown>),
    buildComponent("home_banner", "Banner raíces", 3, banner1Es as Record<string, unknown>),
    buildComponent("home_banner", "Banner vinos", 4, banner2Es as Record<string, unknown>),
    buildComponent("home_productos_destacados", "Productos destacados", 5, productosDestacadosEs as Record<string, unknown>),
  ];

  return NextResponse.json({
    success: true,
    data: { components, client },
  });
}
