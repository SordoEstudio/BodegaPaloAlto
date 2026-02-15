import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bienvenida | Bodega Palo Alto",
  description:
    "Para ingresar al sitio de Bodega Palo Alto debes ser mayor de 18 años. Prohibida la venta a menores.",
  robots: "noindex, nofollow",
};

export default function BienvenidaLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
