import { NextResponse } from "next/server";

const getProductsBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_DEV ??
    process.env.NEXT_PUBLIC_API_URL ??
    "";
  return url.replace(/\/$/, "");
};

const PRODUCT_REVALIDATE_SECONDS = Number(
  process.env.PRODUCT_REVALIDATE_SECONDS ?? 300
);

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

  try {
    const res = await fetch(url, {
      headers: { "X-Original-Host": cleanHost },
      next: {
        revalidate: PRODUCT_REVALIDATE_SECONDS,
        tags: [
          "products",
          `product:${slug}`,
          `products:${clientSlug}:${locale}`,
        ],
      },
    });
    const bodyText = await res.text();

    let data: Record<string, unknown> = {};
    try {
      data = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.error("[products/[slug] proxy] Body inválido:", bodyText?.slice(0, 200));
      }
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
    if (process.env.NODE_ENV !== "production") {
      console.error("[products/[slug] proxy] Error:", err);
    }
    return NextResponse.json(
      { success: false, message: "Error al conectar con la API de productos" },
      { status: 500 }
    );
  }
}
