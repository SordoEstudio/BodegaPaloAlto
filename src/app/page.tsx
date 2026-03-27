import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n";
import { cookies, headers } from "next/headers";

/**
 * Raíz: redirige a la versión en español (original).
 */
export default async function RootPage() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLocale = cookieStore.get("preferredLocale")?.value;
  const acceptLanguage = headerStore.get("accept-language") ?? "";
  const firstLang = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? "";

  const locale =
    (cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : undefined) ??
    (firstLang.startsWith("en") ? "en" : DEFAULT_LOCALE);

  redirect(`/${locale}`);
}
