import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ProductDetail } from "@/components/products/ProductDetail";
import { getUITranslations } from "@/lib/ui-translations";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { getSiteUrl, getDefaultOgImage } from "@/lib/seo";
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

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 300,
        tags: ["products", `product:${slug}`],
      },
      headers: useProxy
        ? { "Content-Type": "application/json" }
        : {
            "Content-Type": "application/json",
            "X-Original-Host": host.split(":")[0],
          },
    });
    const bodyText = await res.text();

    let json: Record<string, unknown> = {};
    try {
      json = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.error("[ProductDetail] Body inválido:", bodyText?.slice(0, 200));
      }
      return null;
    }

    if (!res.ok || !json?.success) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[ProductDetail] Fallo:", {
          status: res.status,
          code: json?.code,
          message: json?.message,
        });
      }
      return null;
    }

    return json.data as PublicProduct;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ProductDetail] Error:", err);
    }
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
  const site = getSiteUrl();
  const productPath = `/productos/${slug}`;

  const langAlternates = {
    es: `${site}/es${productPath}`,
    en: `${site}/en${productPath}`,
    "x-default": `${site}/es${productPath}`,
  };

  if (!product) {
    const title = loc === "es" ? "Producto no encontrado" : "Product not found";
    return {
      title,
      alternates: { canonical: `${site}/${loc}${productPath}`, languages: langAlternates },
      robots: { index: false, follow: true },
    };
  }

  const meta = product.locale?.seo;
  const title = meta?.meta_title || product.locale?.title;
  const description =
    meta?.meta_description ||
    product.locale?.summary ||
    `${product.locale?.title ?? "Vino"} – Bodega Palo Alto, Mendoza, Argentina`;
  const ogImage = product.images?.[0]?.url ? [product.images[0].url] : [getDefaultOgImage()];

  return {
    title: title ?? "Bodega Palo Alto",
    description,
    alternates: { canonical: `${site}/${loc}${productPath}`, languages: langAlternates },
    openGraph: {
      title: title ?? "Bodega Palo Alto",
      description,
      type: "article",
      url: `${site}/${loc}${productPath}`,
      locale: loc === "en" ? "en_US" : "es_AR",
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? "Bodega Palo Alto",
      description,
      images: ogImage,
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
