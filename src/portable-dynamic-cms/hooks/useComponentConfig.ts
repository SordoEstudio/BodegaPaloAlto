"use client";

import { useCallback } from "react";
import type { CMSComponent } from "../types/cms-components";

export function useComponentConfig(cmsComponent: CMSComponent | null) {
  const config = cmsComponent?.data?._configuracion ?? cmsComponent?.data?.config ?? {};

  const get = useCallback(
    <T = unknown>(key: string, defaultValue?: T): T | undefined => {
      const value = (config as Record<string, unknown>)?.[key];
      return (value as T) ?? defaultValue;
    },
    [config]
  );

  return { config: config as Record<string, unknown>, get };
}

export function useComponentConfigValue<T = unknown>(
  cmsComponent: CMSComponent | null,
  key: string,
  defaultValue?: T
): T | undefined {
  const { get } = useComponentConfig(cmsComponent);
  return get<T>(key, defaultValue);
}
