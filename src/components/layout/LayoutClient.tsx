"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { GlobalUniquePromoSlot } from "./GlobalUniquePromoSlot";
import { getLocaleFromPathname } from "@/lib/i18n";
import type { HeaderData, FooterData } from "@/types/sections";

interface LayoutClientProps {
  children: React.ReactNode;
  headerEs: HeaderData;
  headerEn: HeaderData;
  footerEs: FooterData;
  footerEn: FooterData;
}

export function LayoutClient({
  children,
  headerEs,
  headerEn,
  footerEs,
  footerEn,
}: LayoutClientProps) {
  const pathname = usePathname() ?? "/";
  const isWelcome = pathname.includes("/bienvenida");

  useEffect(() => {
    const locale = getLocaleFromPathname(pathname);
    document.documentElement.lang = locale;
  }, [pathname]);

  return (
    <>
      {!isWelcome && (
        <Suspense fallback={null}>
          <Header dataEs={headerEs} dataEn={headerEn} />
        </Suspense>
      )}
      <main
        id="main-content"
        className={isWelcome ? "min-h-screen h-screen flex flex-col" : ""}
      >
        {children}
      </main>
      {!isWelcome && (
        <Suspense fallback={null}>
          <GlobalUniquePromoSlot />
        </Suspense>
      )}
      {!isWelcome && (
        <Footer dataEs={footerEs} dataEn={footerEn} />
      )}
    </>
  );
}
