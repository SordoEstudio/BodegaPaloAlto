import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AGE_VERIFIED_COOKIE } from "@/lib/ageGate";

const BIENVENIDA_PATH = "/bienvenida";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si ya está en bienvenida, no hacer nada
  if (pathname === BIENVENIDA_PATH) {
    return NextResponse.next();
  }

  const verified = request.cookies.get(AGE_VERIFIED_COOKIE)?.value;
  if (verified !== "1") {
    const url = request.nextUrl.clone();
    url.pathname = BIENVENIDA_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/es", "/en"],
};
