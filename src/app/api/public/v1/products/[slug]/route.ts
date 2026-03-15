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
 * Producto por slug según docs/API_PUBLICA_PRODUCTOS_FRONT.md
 * Params: locale
 * El cliente se identifica por dominio: se reenvía host y X-Original-Host al backend.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const host = request.headers.get("host") ?? request.headers.get("x-forwarded-host") ?? "localhost";
  const cleanHost = host.split(":")[0];
  const clientSlug =
    searchParams.get("clientSlug") ?? process.env.NEXT_PUBLIC_CLIENT_SLUG ?? "bodega-palo-alto";
  const locale = searchParams.get("locale") ?? "es";

  const paramsUrl = new URLSearchParams({ clientSlug, locale });
  const baseUrl = getProductsBaseUrl();
  const url = `${baseUrl}/products/${encodeURIComponent(slug)}?${paramsUrl.toString()}`;

  console.log("[products/[slug] proxy] Reenvío:", {
    slug,
    locale,
    clientSlug,
    url,
    "X-Original-Host": cleanHost,
  });

  try {
    const res = await fetch(url, {
      headers: { "X-Original-Host": cleanHost },
    });
    const bodyText = await res.text();

    console.log("[products/[slug] proxy] Respuesta backend:", {
      status: res.status,
      ok: res.ok,
      bodyLength: bodyText?.length ?? 0,
      body: bodyText ? (bodyText.length > 500 ? bodyText.slice(0, 500) + "..." : bodyText) : "(vacío)",
    });

    let data: Record<string, unknown> = {};
    try {
      data = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      console.error("[products/[slug] proxy] Body no es JSON válido:", bodyText?.slice(0, 200));
      return NextResponse.json(
        { success: false, message: "Respuesta inválida del backend" },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message ?? "Producto no encontrado" },
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
