"use client";

import { useCMSComponents } from "./useCMSComponents";

export function usePageCMS() {
  const { getComponentsByPage, getComponentByType, components, loading, error } =
    useCMSComponents();

  return {
    getComponentsByPage: getComponentsByPage ?? (() => []),
    getComponentByType: getComponentByType ?? (() => null),
    components,
    loading,
    error,
  };
}
