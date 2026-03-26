import { NextRequest, NextResponse } from "next/server";

function getFormsBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_DEV ??
    process.env.NEXT_PUBLIC_API_URL ??
    "";

  // Soportar ambos formatos:
  // - https://.../api/public/v1
  // - https://.../api/public/v1/forms
  const cleaned = raw.replace(/\/$/, "");
  return cleaned.replace(/\/forms\/?$/i, "");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const baseUrl = getFormsBaseUrl();

    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "API base URL no configurada" },
        { status: 500 }
      );
    }

    const incomingHost =
      request.headers.get("host") ?? request.headers.get("x-forwarded-host") ?? "localhost";
    const cleanHost = incomingHost.split(":")[0];
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "http";
    const constructedOrigin = `${forwardedProto}://${incomingHost}`;

    const target = new URL(`${baseUrl}/forms/${encodeURIComponent(slug)}`);

    const locale = request.nextUrl.searchParams.get("locale");
    if (locale) target.searchParams.set("locale", locale);

    // Backend puede identificar al cliente por Host o por query param ?host=
    const host = request.nextUrl.searchParams.get("host");
    target.searchParams.set("host", (host ?? cleanHost).split(":")[0]);

    // Mimic: /api/public/v1/products proxy (reenvío del original host)
    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-Original-Host": cleanHost,
      Origin: constructedOrigin,
      Referer: constructedOrigin,
    };

    const res = await fetch(target.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const raw = await res.text();
    let parsed: unknown = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = raw;
    }

    console.log("[/api/public/forms/[slug]] Proxy response", {
      target: target.toString(),
      ok: res.ok,
      status: res.status,
      body: parsed,
    });

    return NextResponse.json(parsed, { status: res.status });
  } catch (error) {
    console.error("[/api/public/forms/[slug]] Proxy error", error);
    return NextResponse.json(
      { success: false, error: "Error consultando formulario" },
      { status: 500 }
    );
  }
}
