import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AGE_VERIFIED_COOKIE } from "@/lib/ageGate";
import { isValidLocale } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  const first = segments[0];

  // Ya está en bienvenida (ej. /es/bienvenida, /en/bienvenida)
  if (isValidLocale(first) && segments[1] === "bienvenida") {
    return NextResponse.next();
  }

  const verified = request.cookies.get(AGE_VERIFIED_COOKIE)?.value;
  if (verified !== "1") {
    const locale = isValidLocale(first) ? first : "es";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/bienvenida`;
    return NextResponse.redirect(url);
  }

  // Raíz sin cookie ya redirigió arriba; con cookie dejamos pasar y app/page.tsx redirige a /es
  if (pathname === "/" || pathname === "") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/es", "/en", "/es/:path*", "/en/:path*"],
};
