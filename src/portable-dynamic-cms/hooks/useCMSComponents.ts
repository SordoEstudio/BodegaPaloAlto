"use client";

import { useState, useEffect, useCallback } from "react";
import { API_CONFIG, buildApiUrl } from "../config/api-config";
import type {
  CMSComponent,
  CMSComponentsResponse,
  CMSComponentFilters,
  UseCMSComponentsReturn,
} from "../types/cms-components";
import { useCMSCache } from "./useCMSCache";

export function useCMSComponents(
  filters?: CMSComponentFilters
): UseCMSComponentsReturn {
  const [components, setComponents] = useState<CMSComponent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getFromCache, setCacheData, getCacheStats } = useCMSCache();

  const cacheKey = `cms_${JSON.stringify(filters ?? {})}`;

  const fetchComponents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cached = getFromCache(cacheKey);
      if (cached) {
        setComponents(cached);
        setLoading(false);
        return;
      }

      const params: Record<string, string> = {};
      if (filters?.type) params.type = filters.type;
      if (filters?.page_filter) params.page_filter = filters.page_filter;
      if (filters?.status) params.status = filters.status;

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.CMS_COMPONENTS, params);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const json: CMSComponentsResponse = await response.json();
      const list = json?.data?.components ?? [];
      const visible = list.filter((c) => c.isVisible !== false);
      setCacheData(cacheKey, visible);
      setComponents(visible);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading components");
      setComponents(null);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, filters, getFromCache, setCacheData]);

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
      return components.filter((c) => c.page === page);
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
