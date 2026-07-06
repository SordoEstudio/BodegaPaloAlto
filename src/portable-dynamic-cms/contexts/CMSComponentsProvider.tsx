"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "next/navigation";
import type { CMSComponent, UseCMSComponentsReturn } from "../types/cms-components";

const CMSComponentsContext = createContext<UseCMSComponentsReturn | null>(null);

interface CMSComponentsProviderProps {
  children: ReactNode;
  initialComponents: CMSComponent[];
  initialLocale?: string;
}

async function clientFetchCmsComponents(locale: string): Promise<CMSComponent[]> {
  const base = (
    (process.env.NEXT_PUBLIC_API_DEV ?? process.env.NEXT_PUBLIC_API_URL) ?? ""
  ).replace(/\/$/, "");
  if (!base) return [];
  const clientSlug = process.env.NEXT_PUBLIC_CLIENT_SLUG ?? "bodega-palo-alto";
  const host = (process.env.NEXT_PUBLIC_CMS_HOST ?? "bodegapaloalto.com.ar").split(":")[0];
  const params = new URLSearchParams({ locale, clientSlug, host });
  const url = `${base}/cms-components?${params.toString()}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json?.data;
    const inner = data?.data ?? data;
    const list = Array.isArray(inner?.components)
      ? inner.components
      : (json?.data?.components ?? []);
    return (list as CMSComponent[]).filter((c: CMSComponent) => c.isVisible !== false);
  } catch {
    return [];
  }
}

export function CMSComponentsProvider({
  children,
  initialComponents,
  initialLocale = "es",
}: CMSComponentsProviderProps) {
  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : initialLocale;
  const locale = rawLocale === "en" ? "en" : "es";

  const [components, setComponents] = useState<CMSComponent[]>(initialComponents);
  const lastFetchedLocale = useRef<string>(initialLocale === "en" ? "en" : "es");

  useEffect(() => {
    if (locale === lastFetchedLocale.current) return;
    lastFetchedLocale.current = locale;
    clientFetchCmsComponents(locale).then((comps) => {
      if (comps.length > 0) setComponents(comps);
    });
  }, [locale]);

  const getComponentByType = useCallback(
    (type: string) => components.find((c) => c.type === type) ?? null,
    [components]
  );

  const getComponentsByPage = useCallback(
    (page: string) => {
      const pageLower = (page ?? "").trim().toLowerCase();
      return components.filter(
        (c) => (c.page ?? "").toString().trim().toLowerCase() === pageLower
      );
    },
    [components]
  );

  const value: UseCMSComponentsReturn = useMemo(
    () => ({
      components,
      loading: false,
      error: null,
      refetch: () => {},
      getComponentByType,
      getComponentsByPage,
      cacheStats: { total: 0, valid: 0, expired: 0, hitRate: 0 },
    }),
    [components, getComponentByType, getComponentsByPage]
  );

  return (
    <CMSComponentsContext.Provider value={value}>
      {children}
    </CMSComponentsContext.Provider>
  );
}

export function useCMSComponentsFromContext(): UseCMSComponentsReturn {
  const ctx = useContext(CMSComponentsContext);
  if (!ctx) {
    return {
      components: null,
      loading: true,
      error: null,
      refetch: () => {},
      getComponentByType: () => null,
      getComponentsByPage: () => [],
      cacheStats: { total: 0, valid: 0, expired: 0, hitRate: 0 },
    };
  }
  return ctx;
}
