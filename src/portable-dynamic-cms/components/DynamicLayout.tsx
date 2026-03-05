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
      /** Componentes de la página (sin filtrar por layout). Permite fusionar datos entre componentes (ej. team → quienes_somos). */
      pageComponents?: CMSComponent[];
    }
  ) => DynamicLayoutComponentProps;
  /** Si se define, los dos primeros componentes con estos layoutName se renderizan en un bloque: el primero ocupa el alto y el segundo en absolute bottom (ej. hero + carousel overlay). */
  overlayGroup?: { first: string; second: string };
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
  overlayGroup,
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

  const useOverlay =
    overlayGroup &&
    layoutComponents.length >= 2 &&
    (cmsTypeToLayoutName[layoutComponents[0].type] ?? layoutComponents[0].type) === overlayGroup.first &&
    (cmsTypeToLayoutName[layoutComponents[1].type] ?? layoutComponents[1].type) === overlayGroup.second;

  return (
    <>
      {useOverlay ? (
        <>
          <div className="relative min-h-[calc(100dvh-4.5rem)]">
            {(() => {
              const cms0 = layoutComponents[0];
              const cms1 = layoutComponents[1];
              const name0 = cmsTypeToLayoutName[cms0.type] ?? cms0.type;
              const name1 = cmsTypeToLayoutName[cms1.type] ?? cms1.type;
              const Comp0 = componentMap[name0];
              const Comp1 = componentMap[name1];
              if (!Comp0 || !Comp1) return null;
              const props0 = getProps(name0, cms0, { cmsLoading, cmsError, pageCMS, pageComponents });
              const props1 = getProps(name1, cms1, { cmsLoading, cmsError, pageCMS, pageComponents });
              return (
                <>
                  <Comp0 key={`${cms0.type}-${cms0._id ?? 0}`} {...props0} />
                  <div className="absolute bottom-0 left-0 right-0 z-10">
                    <Comp1 key={`${cms1.type}-${cms1._id ?? 1}`} {...props1} />
                  </div>
                </>
              );
            })()}
          </div>
          {layoutComponents.slice(2).map((cmsComponent, index) => {
            const layoutName =
              cmsTypeToLayoutName[cmsComponent.type] ?? cmsComponent.type;
            const Component = componentMap[layoutName];
            if (!Component) return null;
            const props = getProps(layoutName, cmsComponent, {
              cmsLoading,
              cmsError,
              pageCMS,
              pageComponents,
            });
            return (
              <Component
                key={`${cmsComponent.type}-${cmsComponent._id ?? index + 2}`}
                {...props}
              />
            );
          })}
        </>
      ) : (
        layoutComponents.map((cmsComponent, index) => {
          const layoutName =
            cmsTypeToLayoutName[cmsComponent.type] ?? cmsComponent.type;
          const Component = componentMap[layoutName];
          if (!Component) return null;
          const props = getProps(layoutName, cmsComponent, {
            cmsLoading,
            cmsError,
            pageCMS,
            pageComponents,
          });
          return (
            <Component
              key={`${cmsComponent.type}-${cmsComponent._id ?? index}`}
              {...props}
            />
          );
        })
      )}
    </>
  );
}
