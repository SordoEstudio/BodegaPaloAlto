"use client";

/**
 * Re-exporta desde los mapas de página específicos para compatibilidad con
 * imports existentes. Preferir importar desde el mapa de página correspondiente
 * para un mejor tree-shaking por ruta:
 *   - "@/lib/cms-home-map"       → home
 *   - "@/lib/cms-bodega-map"     → bodega
 *   - "@/lib/cms-destileria-map" → destilería
 */
export { cmsTypeToLayoutName } from "@/lib/cms-type-map";
export { homeComponentMap, getHomeComponentProps } from "@/lib/cms-home-map";
export { bodegaComponentMap, getBodegaComponentProps } from "@/lib/cms-bodega-map";
export { destileriaComponentMap, getDestileriaComponentProps } from "@/lib/cms-destileria-map";

// componentMap unificado — solo para uso genérico/debug. Las páginas NO deben importar esto.
import type { ComponentType } from "react";
import type { DynamicLayoutComponentProps } from "@/portable-dynamic-cms/components/DynamicLayout";
import { homeComponentMap } from "@/lib/cms-home-map";
import { bodegaComponentMap } from "@/lib/cms-bodega-map";
import { destileriaComponentMap } from "@/lib/cms-destileria-map";

export const componentMap: Record<string, ComponentType<DynamicLayoutComponentProps>> = {
  ...homeComponentMap,
  ...bodegaComponentMap,
  ...destileriaComponentMap,
};
