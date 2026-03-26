import { NextRequest, NextResponse } from "next/server";

function getFormsBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_DEV ??
    process.env.NEXT_PUBLIC_API_URL ??
    "";
  return raw.replace(/\/$/, "");
}

export async function POST(
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

    const body = await request.json();
    const target = `${baseUrl}/forms/${encodeURIComponent(slug)}/submit`;

    console.log("[/api/public/forms/[slug]/submit] Proxy request", {
      target,
      method: "POST",
      payload: body,
    });

    const res = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const raw = await res.text();
    let parsed: unknown = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = raw;
    }

    console.log("[/api/public/forms/[slug]/submit] Proxy response", {
      target,
      ok: res.ok,
      status: res.status,
      body: parsed,
    });

    return NextResponse.json(parsed, { status: res.status });
  } catch (error) {
    console.error("[/api/public/forms/[slug]/submit] Proxy error", error);
    return NextResponse.json(
      { success: false, error: "Error enviando formulario" },
      { status: 500 }
    );
  }
}
