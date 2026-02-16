"use client";

import { useMemo, type ReactNode, type ComponentType } from "react";
import { useClientConfig } from "../contexts/ClientConfigProvider";
import { useCMSComponents } from "../hooks/useCMSComponents";
import { usePageCMS } from "../hooks/usePageCMS";
import type { CMSComponent } from "../types/cms-components";

export interface DynamicLayoutComponentProps {
  loading?: boolean;
  error?: string | null;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface DynamicLayoutProps {
  pageType?: string;
  cmsTypeToLayoutName: Record<string, string>;
  componentMap: Record<string, ComponentType<DynamicLayoutComponentProps>>;
  getComponentProps?: (
    layoutName: string,
    cmsComponent: CMSComponent,
    context: {
      cmsLoading: boolean;
      cmsError: string | null;
      pageCMS: ReturnType<typeof usePageCMS>;
    }
  ) => DynamicLayoutComponentProps;
  LoadingComponent?: ComponentType<{ type?: string }> | ReactNode;
  EmptyComponent?: ComponentType<{ pageType: string }> | ReactNode;
}

function defaultGetComponentProps(
  _layoutName: string,
  cmsComponent: CMSComponent,
  context: { cmsLoading: boolean; cmsError: string | null }
): DynamicLayoutComponentProps {
  const config =
    (cmsComponent?.data as Record<string, unknown>)?._configuracion ||
    (cmsComponent?.data as Record<string, unknown>)?.config ||
    {};
  return {
    loading: context.cmsLoading,
    error: context.cmsError,
    data: (cmsComponent?.data as Record<string, unknown>) ?? {},
    ...(typeof config === "object" && config !== null ? config : {}),
  };
}

export function DynamicLayout({
  pageType = "Inicio",
  cmsTypeToLayoutName,
  componentMap,
  getComponentProps = defaultGetComponentProps,
  LoadingComponent,
  EmptyComponent,
}: DynamicLayoutProps) {
  const { config, loading: configLoading } = useClientConfig();
  const {
    components,
    loading: cmsLoading,
    error: cmsError,
    getComponentsByPage,
  } = useCMSComponents();
  const pageCMS = usePageCMS();

  const pageComponents = useMemo(() => {
    if (!components) return [];
    return getComponentsByPage(pageType);
  }, [components, pageType, getComponentsByPage]);

  const layoutComponents = useMemo(() => {
    if (cmsLoading || components === null) return [];
    if (!pageComponents.length) return [];

    const sorted = [...pageComponents].sort((a, b) => {
      const dataA = a.data as Record<string, unknown>;
      const dataB = b.data as Record<string, unknown>;
      const orderA = dataA?._orden ?? dataA?.order ?? null;
      const orderB = dataB?._orden ?? dataB?.order ?? null;
      if (orderA != null && orderB != null) return (orderA as number) - (orderB as number);
      if (orderA != null) return -1;
      if (orderB != null) return 1;
      return 0;
    });

    return sorted.filter((c) => {
      const name = cmsTypeToLayoutName[c.type];
      return name !== undefined && componentMap[name] != null;
    });
  }, [pageComponents, cmsLoading, components, cmsTypeToLayoutName, componentMap]);

  if (configLoading && !config) {
    if (LoadingComponent) {
      return typeof LoadingComponent === "function" ? (
        <LoadingComponent type="config" />
      ) : (
        <>{LoadingComponent}</>
      );
    }
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-foreground/80">Cargando configuración...</p>
      </div>
    );
  }

  if (layoutComponents.length === 0) {
    if (cmsLoading || components === null) {
      if (LoadingComponent) {
        return typeof LoadingComponent === "function" ? (
          <LoadingComponent type="cms" />
        ) : (
          <>{LoadingComponent}</>
        );
      }
      return (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-foreground/80">Cargando componentes...</p>
        </div>
      );
    }
    if (EmptyComponent) {
      return typeof EmptyComponent === "function" ? (
        <EmptyComponent pageType={pageType} />
      ) : (
        <>{EmptyComponent}</>
      );
    }
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-center">
        <p className="text-muted-foreground">
          No hay componentes configurados para la página &quot;{pageType}&quot;.
        </p>
      </div>
    );
  }

  const getProps = getComponentProps ?? defaultGetComponentProps;

  return (
    <>
      {layoutComponents.map((cmsComponent, index) => {
        const layoutName =
          cmsTypeToLayoutName[cmsComponent.type] ?? cmsComponent.type;
        const Component = componentMap[layoutName];
        if (!Component) return null;

        const props = getProps(layoutName, cmsComponent, {
          cmsLoading,
          cmsError,
          pageCMS,
        });

        return (
          <Component
            key={`${cmsComponent.type}-${cmsComponent._id ?? index}`}
            {...props}
          />
        );
      })}
    </>
  );
}
