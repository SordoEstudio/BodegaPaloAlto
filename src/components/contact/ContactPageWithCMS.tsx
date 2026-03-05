"use client";

import { useCMSComponentsFromContext } from "@/portable-dynamic-cms";
import { ContactPageSection } from "@/components/contact/ContactPageSection";
import { PromoCarousel } from "@/components/promo/PromoCarousel";
import { mapFormularioContactoFromCms, mapContactoRedesFromCms, mapPromoCarouselFromCms } from "@/lib/data";
import type { ContactPageData } from "@/types/sections";

interface ContactPageWithCMSProps {
  locale: string;
  sourcePage?: string;
}

function ContactLoading() {
  return (
    <div className="flex min-h-[480px] items-center justify-center px-6 py-16">
      <p className="text-foreground/70">Cargando formulario de contacto...</p>
    </div>
  );
}

function ContactError({ message }: { message: string }) {
  return (
    <div className="flex min-h-[480px] items-center justify-center px-6 py-16">
      <p className="text-red-600" role="alert">
        {message}
      </p>
    </div>
  );
}

function ContactMissingData() {
  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-muted-foreground">
        No hay datos de contacto configurados. Configura los componentes &quot;formulario_contacto&quot; y &quot;contacto_redes&quot; en el CMS para la página contacto.
      </p>
    </div>
  );
}

export function ContactPageWithCMS({ locale, sourcePage = "contacto" }: ContactPageWithCMSProps) {
  const { components, loading, error, getComponentByType } = useCMSComponentsFromContext();

  if (loading && !components) {
    return <ContactLoading />;
  }

  if (error) {
    return <ContactError message={error} />;
  }

  const formComp = getComponentByType("formulario_contacto");
  const redesComp = getComponentByType("contacto_redes");
  const carruselComp = getComponentByType("carrusel_contacto");

  if (!formComp?.data || !redesComp?.data) {
    return <ContactMissingData />;
  }

  const formData = mapFormularioContactoFromCms(formComp.data as Record<string, unknown>);
  const redesData = mapContactoRedesFromCms(redesComp.data as Record<string, unknown>);

  const data: ContactPageData = {
    form: formData,
    ...redesData,
  };

  const carouselData =
    carruselComp?.data != null
      ? mapPromoCarouselFromCms(carruselComp.data as Record<string, unknown>)
      : null;

  return (
    <>
      <ContactPageSection
        data={data}
        locale={locale}
        sourcePage={sourcePage}
      />
      {carouselData?.slides?.length ? (
        <PromoCarousel
          data={carouselData}
          minHeight="50vh"
        />
      ) : null}
    </>
  );
}
