"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
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
  const isWelcome = pathname === "/bienvenida";

  return (
    <>
      {!isWelcome && (
        <Header dataEs={headerEs} dataEn={headerEn} />
      )}
      <main id="main-content">{children}</main>
      {!isWelcome && (
        <Footer dataEs={footerEs} dataEn={footerEn} />
      )}
    </>
  );
}
