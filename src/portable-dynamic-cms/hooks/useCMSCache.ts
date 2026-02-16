"use client";

import { useCallback } from "react";
import type { CMSComponent } from "../types/cms-components";

const CACHE_KEY_PREFIX = "cms_components_";
const TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: CMSComponent[];
  timestamp: number;
}

export function useCMSCache() {
  const getCacheKey = useCallback((filters: Record<string, unknown>) => {
    return CACHE_KEY_PREFIX + JSON.stringify(filters ?? {});
  }, []);

  const getFromCache = useCallback(
    (key: string): CMSComponent[] | null => {
      if (typeof window === "undefined") return null;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const entry: CacheEntry = JSON.parse(raw);
        if (Date.now() - entry.timestamp > TTL_MS) return null;
        return entry.data;
      } catch {
        return null;
      }
    },
    []
  );

  const setCacheData = useCallback((key: string, data: CMSComponent[]) => {
    if (typeof window === "undefined") return;
    try {
      const entry: CacheEntry = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // ignore
    }
  }, []);

  const getCacheStats = useCallback(() => {
    let total = 0;
    let valid = 0;
    let expired = 0;
    if (typeof window === "undefined")
      return { total: 0, valid: 0, expired: 0, hitRate: 0 };
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k?.startsWith(CACHE_KEY_PREFIX)) continue;
        total++;
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const entry: CacheEntry = JSON.parse(raw);
        if (Date.now() - entry.timestamp <= TTL_MS) valid++;
        else expired++;
      }
    } catch {
      // ignore
    }
    return {
      total,
      valid,
      expired,
      hitRate: total ? valid / total : 0,
    };
  }, []);

  return { getFromCache, setCacheData, getCacheStats, getCacheKey };
}
