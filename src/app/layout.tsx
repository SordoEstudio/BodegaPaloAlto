import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Ubuntu, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LayoutClient } from "@/components/layout/LayoutClient";
import { getHeaderData, getFooterData } from "@/lib/data";
import { getSiteUrl, getDefaultOgImage } from "@/lib/seo";
import { ClientConfigProvider, CMSComponentsProvider } from "@/portable-dynamic-cms";
import { getClientConfig } from "@/portable-dynamic-cms/config/client-config-loader";
import { getCmsComponents } from "@/lib/cms-fetch";

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
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: "/favicon.ico",
    apple: "/logos/iso-c-m.png",
  },
  title: {
    default: "Bodega Palo Alto | Vinos y Espumantes – Mendoza, Argentina",
    template: "%s | Bodega Palo Alto – Mendoza, Argentina",
  },
  description:
    "Bodega Palo Alto: vinos y espumantes de autor elaborados en Mendoza, Argentina. Empresa familiar con fincas en Alto Ugarteche y Palo Alto.",
  keywords: [
    "Palo Alto",
    "Palo Alto Argentina",
    "Palo Alto Mendoza",
    "Bodega Palo Alto",
    "vinos Palo Alto",
    "vinos Mendoza",
    "espumantes Mendoza",
    "bodega Mendoza Argentina",
  ],
  openGraph: {
    type: "website",
    siteName: "Bodega Palo Alto",
    title: "Bodega Palo Alto | Vinos y Espumantes – Mendoza, Argentina",
    description:
      "Bodega Palo Alto: vinos y espumantes de autor elaborados en Mendoza, Argentina. Empresa familiar con fincas en Alto Ugarteche y Palo Alto.",
    images: [{ url: getDefaultOgImage() }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bodega Palo Alto | Vinos y Espumantes – Mendoza, Argentina",
    description:
      "Bodega Palo Alto: vinos y espumantes de autor elaborados en Mendoza, Argentina. Empresa familiar con fincas en Alto Ugarteche y Palo Alto.",
    images: [getDefaultOgImage()],
  },
};

const wineryStructuredData = {
  "@context": "https://schema.org",
  "@type": ["Winery", "Organization"],
  name: "Bodega Palo Alto",
  alternateName: ["Palo Alto", "Palo Alto Argentina", "Palo Alto Mendoza", "Bodegas Palo Alto"],
  description:
    "Bodega y destilería artesanal en Mendoza, Argentina. Vinos, espumantes y destilados de autor elaborados en fincas propias en Alto Ugarteche y Palo Alto.",
  url: "https://bodegapaloalto.com",
  logo: "https://bodegapaloalto.com/logos/tipo-b.png",
  image: "https://bodegapaloalto.com/logos/tipo-b.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mendoza",
    addressRegion: "Mendoza",
    addressCountry: "AR",
  },
  foundingLocation: {
    "@type": "Place",
    name: "Mendoza, Argentina",
  },
  areaServed: [
    { "@type": "Country", name: "Argentina" },
  ],
  hasMap: "https://maps.google.com/?q=Mendoza+Argentina",
  knowsAbout: ["vinos", "espumantes", "destilados", "Mendoza", "Palo Alto Argentina"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost";
  const serverOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `http${process.env.NODE_ENV === "development" ? "" : "s"}://${host}` : "");
  const initialConfig = await getClientConfig(host, serverOrigin || undefined);

  // Detectar locale desde la URL para el atributo lang del <html>
  const nextUrl = headersList.get("next-url") ?? headersList.get("x-pathname") ?? "/";
  const pathLocale = nextUrl.split("/")[1];
  const htmlLang = pathLocale === "en" ? "en" : "es";

  const headerEs = getHeaderData("es");
  const headerEn = getHeaderData("en");
  const footerEs = getFooterData("es");
  const footerEn = getFooterData("en");
  const cmsComponents = await getCmsComponents(htmlLang);

  return (
    <html lang={htmlLang} className={`${ubuntu.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(wineryStructuredData) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QWYEJ5ZE5D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QWYEJ5ZE5D');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">
        <ClientConfigProvider initialConfig={initialConfig}>
          <CMSComponentsProvider initialComponents={cmsComponents}>
          <LayoutClient
            headerEs={headerEs}
            headerEn={headerEn}
            footerEs={footerEs}
            footerEn={footerEn}
          >
            {children}
          </LayoutClient>
          </CMSComponentsProvider>
        </ClientConfigProvider>
        <Analytics />
      </body>
    </html>
  );
}
