"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CMSComponent, UseCMSComponentsReturn } from "../types/cms-components";

const CMSComponentsContext = createContext<UseCMSComponentsReturn | null>(null);

interface CMSComponentsProviderProps {
  children: ReactNode;
  initialComponents: CMSComponent[];
}

export function CMSComponentsProvider({ children, initialComponents }: CMSComponentsProviderProps) {
  const [components] = useState<CMSComponent[]>(initialComponents);

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
