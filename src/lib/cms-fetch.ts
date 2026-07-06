import type { CMSComponent } from "@/portable-dynamic-cms/types/cms-components";

const CLIENT_SLUG = process.env.NEXT_PUBLIC_CLIENT_SLUG ?? "bodega-palo-alto";
const FALLBACK_HOST = "bodegapaloalto.com.ar";

function getCmsBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_DEV ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  return url.replace(/\/$/, "");
}

function getCmsHost(): string {
  return (process.env.NEXT_PUBLIC_CMS_HOST ?? FALLBACK_HOST).split(":")[0];
}

export async function getCmsComponents(locale: string): Promise<CMSComponent[]> {
  const base = getCmsBaseUrl();
  if (!base) return [];
  const host = getCmsHost();
  const params = new URLSearchParams({ locale, clientSlug: CLIENT_SLUG, host });
  const url = `${base}/cms-components?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Original-Host": host,
        Accept: "application/json",
      },
      next: { revalidate: 3600, tags: ["cms-components", `cms-components-${locale}`] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json?.data;
    const inner = data?.data ?? data;
    const list = Array.isArray(inner?.components) ? inner.components : (json?.data?.components ?? []);
    const visible = (list as CMSComponent[]).filter((c) => c.isVisible !== false);
    return visible;
  } catch {
    return [];
  }
}

export function filterByPage(components: CMSComponent[], page: string): CMSComponent[] {
  const target = page.trim().toLowerCase();
  return components.filter((c) => (c.page ?? "").toString().trim().toLowerCase() === target);
}

export function sortByOrder(items: CMSComponent[]): CMSComponent[] {
  return [...items].sort((a, b) => {
    const da = a.data as Record<string, unknown> | undefined;
    const db = b.data as Record<string, unknown> | undefined;
    const oa = (da?._orden ?? da?.order) as number | null | undefined;
    const ob = (db?._orden ?? db?.order) as number | null | undefined;
    if (oa != null && ob != null) return oa - ob;
    if (oa != null) return -1;
    if (ob != null) return 1;
    return 0;
  });
}
