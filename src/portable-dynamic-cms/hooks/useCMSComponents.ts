"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { getLocaleFromPathname } from "@/lib/i18n";
import { API_CONFIG, buildApiUrl } from "../config/api-config";
import type {
  CMSComponent,
  CMSComponentFilters,
  UseCMSComponentsReturn,
} from "../types/cms-components";
import { useCMSCache } from "./useCMSCache";

export function useCMSComponents(
  filters?: CMSComponentFilters
): UseCMSComponentsReturn {
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPathname(pathname);
  const [components, setComponents] = useState<CMSComponent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getFromCache, setCacheData, getCacheStats } = useCMSCache();
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const localeRef = useRef(locale);
  localeRef.current = locale;

  const cacheKey = `cms_${locale}_${JSON.stringify(filters ?? {})}`;

  const fetchComponents = useCallback(async () => {
    const currentFilters = filtersRef.current;
    const currentLocale = localeRef.current;
    try {
      setLoading(true);
      setError(null);

      const cached = getFromCache(cacheKey);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        setComponents(cached);
        setLoading(false);
        return;
      }

      const params: Record<string, string> = { locale: currentLocale };
      if (currentFilters?.type) params.type = currentFilters.type;
      if (currentFilters?.page_filter) params.page_filter = currentFilters.page_filter;
      if (currentFilters?.status) params.status = currentFilters.status;

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.CMS_COMPONENTS, params);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": currentLocale === "en" ? "en" : "es",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();

      const data = json?.data;
      const inner = data?.data ?? data;
      const list: CMSComponent[] = Array.isArray(inner?.components) ? inner.components : (json?.data?.components ?? []);

      const visible = list.filter((c) => c.isVisible !== false);
      setCacheData(cacheKey, visible);
      setComponents(visible);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading components");
      setComponents(null);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, getFromCache, setCacheData]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const getComponentByType = useCallback(
    (type: string) => {
      if (!components) return null;
      return components.find((c) => c.type === type) ?? null;
    },
    [components]
  );

  const getComponentsByPage = useCallback(
    (page: string) => {
      if (!components) return [];
      const pageLower = (page ?? "").trim().toLowerCase();
      return components.filter(
        (c) => (c.page ?? "").toString().trim().toLowerCase() === pageLower
      );
    },
    [components]
  );

  return {
    components,
    loading,
    error,
    refetch: fetchComponents,
    getComponentByType,
    getComponentsByPage,
    cacheStats: getCacheStats(),
  };
}
