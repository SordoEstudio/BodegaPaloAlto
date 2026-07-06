import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AGE_VERIFIED_COOKIE } from "@/lib/ageGate";
import { isValidLocale } from "@/lib/i18n";

const PREFERRED_LOCALE_COOKIE = "preferredLocale";

function getPreferredLocale(request: NextRequest): "es" | "en" {
  const cookieLocale = request.cookies.get(PREFERRED_LOCALE_COOKIE)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const firstLang = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? "";
  if (firstLang.startsWith("en")) return "en";

  // default
  return "es";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  const first = segments[0];
  const preferredLocale = getPreferredLocale(request);

  // Ya está en bienvenida (ej. /es/bienvenida, /en/bienvenida)
  if (isValidLocale(first) && segments[1] === "bienvenida") {
    return NextResponse.next();
  }

  const verified = request.cookies.get(AGE_VERIFIED_COOKIE)?.value;
  if (verified !== "1") {
    const locale = isValidLocale(first) ? first : preferredLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/bienvenida`;
    const res = NextResponse.redirect(url);
    res.cookies.set(PREFERRED_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  // Raíz sin cookie ya redirigió arriba; con cookie dejamos pasar y app/page.tsx redirige a /es
  if (pathname === "/" || pathname === "") {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale}`;
    const res = NextResponse.redirect(url);
    res.cookies.set(PREFERRED_LOCALE_COOKIE, preferredLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const detectedLocale = isValidLocale(first) ? first : preferredLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", detectedLocale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/", "/es", "/en", "/es/:path*", "/en/:path*"],
};
