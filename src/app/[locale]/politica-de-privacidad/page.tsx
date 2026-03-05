import { getPrivacyPolicyData } from "@/lib/data";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const data = getPrivacyPolicyData(loc);
  const isEn = loc === "en";
  return {
    title: isEn ? "Privacy Policy | Bodega Palo Alto" : "Política de Privacidad | Bodega Palo Alto",
    description: data.metaDescription,
  };
}

export default async function PoliticaDePrivacidadPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}/politica-de-privacidad`);
  }

  const data = getPrivacyPolicyData(locale);
  const isEn = locale === "en";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href={`/${locale}`}
          className="mb-8 inline-block text-sm font-medium text-palo-alto-secondary/80 transition hover:text-palo-alto-primary"
        >
          ← {isEn ? "Back to home" : "Volver al inicio"}
        </Link>

        <h1 className="font-heading text-3xl font-bold text-palo-alto-secondary sm:text-4xl">
          {data.title}
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          {isEn ? "Last updated: " : "Última actualización: "}
          {data.lastUpdated}
        </p>

        {/* Responsable: datos de la empresa */}
        <div className="mt-8 rounded-lg border border-palo-alto-secondary/20 bg-palo-alto-secondary/5 p-4">
          <p className="font-semibold text-palo-alto-secondary">
            {isEn ? "Data controller" : "Responsable del tratamiento"}
          </p>
          <p className="mt-1 text-foreground/90">{data.companyName}</p>
          <p className="mt-1 text-foreground/90">{data.address}</p>
          <p className="mt-1">
            <a
              href={`mailto:${data.contactEmail}`}
              className="text-palo-alto-primary underline transition hover:opacity-90"
            >
              {data.contactEmail}
            </a>
          </p>
          <p className="mt-1 text-foreground/80">
            {isEn ? "Country: Argentina" : "País: Argentina"}
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {data.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="border-b border-palo-alto-secondary/10 pb-8 last:border-0 last:pb-0"
            >
              {section.title && (
                <h2 className="font-heading text-xl font-bold text-palo-alto-secondary">
                  {section.title}
                </h2>
              )}
              <div className="mt-3 space-y-3 text-foreground/90">
                {section.content.split(/\n\n+/).map((paragraph, i) => (
                  <p key={i} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-foreground/70">
          <Link
            href={`/${locale}/contacto`}
            className="text-palo-alto-primary underline transition hover:opacity-90"
          >
            {isEn ? "Contact" : "Contacto"}
          </Link>
        </p>
      </div>
    </main>
  );
}
