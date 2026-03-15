import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getProductsBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_DEV ??
    process.env.NEXT_PUBLIC_API_URL ??
    "";
  return url.replace(/\/$/, "");
};

/**
 * Listado de productos según docs/API_PUBLICA_PRODUCTOS_FRONT.md
 * Params: locale, page (default 1), limit (default 20, máx 100), category, productType, status (default published)
 * El cliente se identifica por dominio: se reenvía host y X-Original-Host al backend.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const host = request.headers.get("host") ?? request.headers.get("x-forwarded-host") ?? "localhost";
  const cleanHost = host.split(":")[0];

  const clientSlug =
    searchParams.get("clientSlug") ?? process.env.NEXT_PUBLIC_CLIENT_SLUG ?? "bodega-palo-alto";
  const locale = searchParams.get("locale") ?? "es";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "50";

  const params = new URLSearchParams({ clientSlug, locale, page, limit });
  const category = searchParams.get("category");
  if (category) params.set("category", category);
  const productType = searchParams.get("productType");
  if (productType) params.set("productType", productType);

  const baseUrl = getProductsBaseUrl();
  const url = `${baseUrl}/products?${params.toString()}`;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";
  const constructedOrigin = `${protocol}://${host}`;

  const headers: Record<string, string> = {
    "X-Original-Host": cleanHost,
    "Content-Type": "application/json",
    Origin: origin ?? constructedOrigin,
    Referer: referer ?? constructedOrigin,
  };

  try {
    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message ?? "Error al obtener productos" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[products API] Error:", err);
    return NextResponse.json(
      { success: false, message: "Error al conectar con la API de productos" },
      { status: 500 }
    );
  }
}
