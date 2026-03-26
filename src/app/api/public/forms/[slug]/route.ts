import { NextRequest, NextResponse } from "next/server";

function getFormsBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_DEV ??
    process.env.NEXT_PUBLIC_API_URL ??
    "";
  return raw.replace(/\/$/, "");
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

    const target = new URL(`${baseUrl}/forms/${encodeURIComponent(slug)}`);

    const locale = request.nextUrl.searchParams.get("locale");
    if (locale) target.searchParams.set("locale", locale);

    const host = request.nextUrl.searchParams.get("host");
    if (host) target.searchParams.set("host", host);

    const res = await fetch(target.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
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
