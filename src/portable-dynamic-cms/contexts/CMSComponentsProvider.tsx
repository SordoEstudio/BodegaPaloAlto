"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCMSComponents } from "../hooks/useCMSComponents";
import type { UseCMSComponentsReturn } from "../types/cms-components";

const CMSComponentsContext = createContext<UseCMSComponentsReturn | null>(null);

export function CMSComponentsProvider({ children }: { children: ReactNode }) {
  const value = useCMSComponents();
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
