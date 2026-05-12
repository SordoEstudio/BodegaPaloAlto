import { NextResponse } from "next/server";

const getCMSBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_DEV ??
    process.env.NEXT_PUBLIC_API_URL ??
    "";
  return url.replace(/\/$/, "");
};

const CMS_REVALIDATE_SECONDS = Number(
  process.env.CMS_REVALIDATE_SECONDS ?? 300
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const host =
    request.headers.get("host") ??
    request.headers.get("x-forwarded-host") ??
    "localhost";
  const cleanHost = host.split(":")[0];

  const locale = searchParams.get("locale") ?? "es";
  const clientSlug =
    searchParams.get("clientSlug") ??
    process.env.NEXT_PUBLIC_CLIENT_SLUG ??
    "bodega-palo-alto";

  const params = new URLSearchParams({ locale, clientSlug });
  const type = searchParams.get("type");
  if (type) params.set("type", type);
  const page_filter = searchParams.get("page_filter");
  if (page_filter) params.set("page_filter", page_filter);

  const baseUrl = getCMSBaseUrl();
  const url = `${baseUrl}/cms-components?${params.toString()}`;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";
  const constructedOrigin = `${protocol}://${host}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Original-Host": cleanHost,
        "Content-Type": "application/json",
        Origin: origin ?? constructedOrigin,
        Referer: referer ?? constructedOrigin,
      },
      next: {
        revalidate: CMS_REVALIDATE_SECONDS,
        tags: [
          "cms-components",
          `cms-components:${clientSlug}:${locale}`,
          ...(type ? [`cms-components:type:${type}`] : []),
          ...(page_filter ? [`cms-components:page:${page_filter}`] : []),
        ],
      },
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message ?? "Error al obtener componentes CMS" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[cms-components API] Error:", err);
    }
    return NextResponse.json(
      { success: false, message: "Error al conectar con el CMS" },
      { status: 500 }
    );
  }
}
