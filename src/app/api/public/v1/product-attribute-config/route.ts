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
 * Configuración de atributos según docs/API_PUBLICA_PRODUCTOS_FRONT.md
 * Params: productType (opcional)
 * El cliente se identifica por dominio: se reenvía host y X-Original-Host al backend.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const host = request.headers.get("host") ?? request.headers.get("x-forwarded-host") ?? "localhost";

  const cleanHost = host.split(":")[0];
  const clientSlug =
    searchParams.get("clientSlug") ?? process.env.NEXT_PUBLIC_CLIENT_SLUG ?? "bodega-palo-alto";

  const params = new URLSearchParams({ host: cleanHost, clientSlug });
  const productType = searchParams.get("productType");
  if (productType) params.set("productType", productType);

  const baseUrl = getProductsBaseUrl();
  const url = `${baseUrl}/product-attribute-config?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { "X-Original-Host": cleanHost },
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message ?? "Error al obtener configuración" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[product-attribute-config API] Error:", err);
    return NextResponse.json(
      { success: false, message: "Error al conectar con la API" },
      { status: 500 }
    );
  }
}
