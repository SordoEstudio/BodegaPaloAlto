import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ProductDetail } from "@/components/products/ProductDetail";
import { getUITranslations } from "@/lib/ui-translations";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import type { PublicProduct } from "@/hooks/usePublicProducts";

const CLIENT_SLUG = process.env.NEXT_PUBLIC_CLIENT_SLUG ?? "bodega-palo-alto";

async function fetchProduct(slug: string, locale: string): Promise<PublicProduct | null> {
  const useProxy = process.env.NEXT_PUBLIC_USE_PROXY === "true";
  const headersList = await headers();
  const host = headersList.get("host") ?? headersList.get("x-forwarded-host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") === "https" ? "https" : "http";

  const url = useProxy
    ? `${protocol}://${host}/api/public/v1/products/${encodeURIComponent(slug)}?locale=${locale}&clientSlug=${CLIENT_SLUG}`
    : `${(process.env.NEXT_PUBLIC_API_DEV ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "")}/products/${encodeURIComponent(slug)}?locale=${locale}&clientSlug=${CLIENT_SLUG}`;

  console.log("[ProductDetail] Llamada:", {
    slug,
    locale,
    useProxy,
    url,
    headers: useProxy ? undefined : { "X-Original-Host": host.split(":")[0] },
  });

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: useProxy
        ? { "Content-Type": "application/json" }
        : {
            "Content-Type": "application/json",
            "X-Original-Host": host.split(":")[0],
          },
    });
    const bodyText = await res.text();

    console.log("[ProductDetail] Respuesta:", {
      status: res.status,
      ok: res.ok,
      bodyLength: bodyText?.length ?? 0,
      body: bodyText ? (bodyText.length > 500 ? bodyText.slice(0, 500) + "..." : bodyText) : "(vacío)",
    });

    let json: Record<string, unknown> = {};
    try {
      json = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      console.error("[ProductDetail] Body no es JSON válido:", bodyText?.slice(0, 200));
      return null;
    }

    if (!res.ok || !json?.success) {
      console.warn("[ProductDetail] Fallo:", {
        status: res.status,
        code: json?.code,
        message: json?.message,
        json,
      });
      if (json?.code === "DOMAIN_NOT_ALLOWED") {
        console.error("[ProductDetail] 403 DOMAIN_NOT_ALLOWED: añadir el dominio en domains[] del cliente en el CMS");
      }
      return null;
    }

    return json.data as PublicProduct;
  } catch (err) {
    console.error("[ProductDetail] Error:", err);
    return null;
  }
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const loc = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const product = await fetchProduct(slug, loc);

  if (!product) {
    return { title: loc === "es" ? "Producto no encontrado" : "Product not found" };
  }

  const meta = product.locale?.seo;
  const title = meta?.meta_title || product.locale?.title;
  const description = meta?.meta_description || product.locale?.summary;

  return {
    title: title ? `${title} | Bodega Palo Alto` : "Bodega Palo Alto",
    description: description ?? undefined,
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      images: product.images?.[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const product = await fetchProduct(slug, locale);

  if (!product) {
    notFound();
  }

  const ui = getUITranslations(locale);

  return (
    <div className="min-h-screen bg-header-bg">
      <ProductDetail product={product} locale={locale} ui={ui.productos} />
    </div>
  );
}
