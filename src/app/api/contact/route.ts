import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trim(s: unknown): string {
  return typeof s === "string" ? s.trim() : "";
}

function validateBody(body: unknown): { ok: true; data: Record<string, string> } | { ok: false; status: number } {
  if (body == null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400 };
  }
  const o = body as Record<string, unknown>;
  const name = trim(o.name);
  const email = trim(o.email);
  const message = trim(o.message);
  const privacy = o.privacy === true || o.privacy === "true" || o.privacy === "on";

  if (name.length < 2) return { ok: false, status: 400 };
  if (!EMAIL_REGEX.test(email)) return { ok: false, status: 400 };
  if (message.length < 10) return { ok: false, status: 400 };
  if (!privacy) return { ok: false, status: 400 };

  const company = trim(o.company);
  if (company.length > 0) return { ok: false, status: 200 }; // honeypot: respond ok but do nothing

  return {
    ok: true,
    data: {
      name,
      email,
      phone: trim(o.phone ?? ""),
      message,
      type: trim(o.type ?? ""),
      locale: trim(o.locale ?? "es"),
      source_page: trim(o.source_page ?? "contacto"),
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[/api/contact] Incoming payload", body);

    const result = validateBody(body);

    if (!result.ok) {
      console.warn("[/api/contact] Validation failed", {
        status: result.status,
        body,
      });
      return NextResponse.json(
        { error: "Invalid request" },
        { status: result.status === 200 ? 200 : 400 }
      );
    }

    const apiUrl = process.env.CONTACT_API_URL;
    if (apiUrl) {
      const outboundPayload = {
        ...result.data,
        captcha_token: body.captcha_token ?? "",
      };
      console.log("[/api/contact] Outbound API request", {
        apiUrl,
        method: "POST",
        payload: outboundPayload,
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outboundPayload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const externalBody = await res.text().catch(() => "");
      console.log("[/api/contact] Outbound API response", {
        ok: res.ok,
        status: res.status,
        body: externalBody,
      });

      if (!res.ok) {
        return NextResponse.json({ error: "Error sending" }, { status: 502 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/contact] Unexpected error", error);
    return NextResponse.json({ error: "Error sending" }, { status: 500 });
  }
}
