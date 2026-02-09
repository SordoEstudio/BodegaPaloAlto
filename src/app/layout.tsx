import type { Metadata } from "next";
import { Ubuntu, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "@/components/layout/LayoutClient";
import { getHeaderData, getFooterData } from "@/lib/data";

/** Tipografía secundaria (textos): Ubuntu – Manual de marca */
const ubuntu = Ubuntu({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
  display: "swap",
});

/** Tipografía principal (logo y títulos): Carleton en manual; en web usamos Cormorant Garamond como alternativa. Si tenés la fuente Carleton, podés cargarla en /public/fonts y usar @font-face en globals.css. */
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bodega Palo Alto | Mendoza, Argentina",
  description:
    "La pasión por las tierras mendocinas y la nobleza de la vid dieron origen a esta formidable empresa familiar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerEs = getHeaderData("es");
  const headerEn = getHeaderData("en");
  const footerEs = getFooterData("es");
  const footerEn = getFooterData("en");

  return (
    <html lang="es" className={`${ubuntu.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
        <LayoutClient
          headerEs={headerEs}
          headerEn={headerEn}
          footerEs={footerEs}
          footerEn={footerEn}
        >
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
