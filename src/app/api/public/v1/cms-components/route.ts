import { NextResponse } from "next/server";
import type { CMSComponent } from "@/portable-dynamic-cms/types/cms-components";
import heroEs from "@/data/es/home/hero.json";
import carouselLineasEs from "@/data/es/home/carousel-lineas.json";
import banner1Es from "@/data/es/home/banner-1.json";
import banner2Es from "@/data/es/home/banner-2.json";
import productosDestacadosEs from "@/data/es/home/productos-destacados.json";
import heroEn from "@/data/en/home/hero.json";
import carouselLineasEn from "@/data/en/home/carousel-lineas.json";
import banner1En from "@/data/en/home/banner-1.json";
import banner2En from "@/data/en/home/banner-2.json";
import productosDestacadosEn from "@/data/en/home/productos-destacados.json";

export const dynamic = "force-dynamic";

const now = new Date().toISOString();
const client = { id: "palo-alto-1", name: "Bodega Palo Alto", slug: "palo-alto" };

function buildComponent(
  type: string,
  name: string,
  order: number,
  data: Record<string, unknown>,
  page = "Inicio"
): CMSComponent {
  return {
    _id: `mock-${type}-${order}`,
    name,
    type,
    page,
    data: { ...data, _orden: order },
    status: "published",
    isActive: true,
    isVisible: true,
    createdAt: now,
    updatedAt: now,
    clientName: client.name,
  };
}

function useEnglishLocale(request: Request, searchParams: URLSearchParams): boolean {
  const q = searchParams.get("locale")?.toLowerCase();
  if (q === "en") return true;
  if (q === "es") return false;
  const al = (request.headers.get("accept-language") ?? "").trim().toLowerCase();
  return al.startsWith("en");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestInfo = {
    url: request.url,
    searchParams: Object.fromEntries(searchParams.entries()),
    headers: {
      "content-type": request.headers.get("content-type"),
      "user-agent": request.headers.get("user-agent")?.slice(0, 50),
      "accept-language": request.headers.get("accept-language")?.slice(0, 40),
    },
  };
  console.log("[cms-components API] Petición recibida:", requestInfo);

  const en = useEnglishLocale(request, searchParams);
  const hero = en ? heroEn : heroEs;
  const carouselLineas = en ? carouselLineasEn : carouselLineasEs;
  const banner1 = en ? banner1En : banner1Es;
  const banner2 = en ? banner2En : banner2Es;
  const productosDestacados = en ? productosDestacadosEn : productosDestacadosEs;

  const components: CMSComponent[] = [
    buildComponent("home_hero", "Hero inicio", 1, hero as Record<string, unknown>),
    buildComponent("home_carousel_lineas", "Carousel líneas", 2, carouselLineas as Record<string, unknown>),
    buildComponent("home_banner", "Banner raíces", 3, banner1 as Record<string, unknown>),
    buildComponent("home_banner", "Banner vinos", 4, banner2 as Record<string, unknown>),
    buildComponent("home_productos_destacados", "Productos destacados", 5, productosDestacados as Record<string, unknown>),
  ];

  const payload = { success: true, data: { components, client } };
  console.log("[cms-components API] Respuesta:", { componentsCount: components.length, client, componentTypes: components.map((c) => c.type) });

  return NextResponse.json(payload);
}
