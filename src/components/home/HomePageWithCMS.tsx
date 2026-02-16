"use client";

import { DynamicLayout, useCMSComponents } from "@/portable-dynamic-cms";
import {
  cmsTypeToLayoutName,
  componentMap,
  getHomeComponentProps,
} from "@/lib/cms-layout-map";

interface HomePageWithCMSProps {
  useCmsLayout: boolean;
  children: React.ReactNode;
}

export function HomePageWithCMS({ useCmsLayout, children }: HomePageWithCMSProps) {
  const { loading, getComponentsByPage } = useCMSComponents();
  const pageComponents = getComponentsByPage("Inicio");

  if (!useCmsLayout) {
    return <>{children}</>;
  }

  if (!loading && pageComponents.length === 0) {
    return <>{children}</>;
  }

  return (
    <DynamicLayout
      pageType="Inicio"
      cmsTypeToLayoutName={cmsTypeToLayoutName}
      componentMap={componentMap}
      getComponentProps={getHomeComponentProps}
    />
  );
}
