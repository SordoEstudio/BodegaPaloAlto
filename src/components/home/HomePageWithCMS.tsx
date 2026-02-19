"use client";

import { DynamicLayout } from "@/portable-dynamic-cms";
import {
  cmsTypeToLayoutName,
  componentMap,
  getHomeComponentProps,
} from "@/lib/cms-layout-map";

interface HomePageWithCMSProps {
  useCmsLayout: boolean;
}

export function HomePageWithCMS({ useCmsLayout }: HomePageWithCMSProps) {
  if (!useCmsLayout) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-center text-foreground/80">
        <p>Activa NEXT_PUBLIC_USE_CMS_LAYOUT=true para cargar el contenido desde la API.</p>
      </div>
    );
  }

  return (
    <DynamicLayout
      pageType="Inicio"
      cmsTypeToLayoutName={cmsTypeToLayoutName}
      componentMap={componentMap}
      getComponentProps={getHomeComponentProps}
      overlayGroup={{ first: "home-hero", second: "home-carousel-lineas" }}
    />
  );
}
