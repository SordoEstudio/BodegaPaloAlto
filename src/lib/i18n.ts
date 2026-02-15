/**
 * Locales soportados. Español como original/default.
 */
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

/**
 * Obtiene el locale desde el pathname (primer segmento).
 * Si no es 'es' ni 'en', devuelve DEFAULT_LOCALE.
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.replace(/^\/+/, "").split("/")[0];
  return isValidLocale(segment) ? segment : DEFAULT_LOCALE;
}

/**
 * Path sin el prefijo de locale (ej. /es/contacto → /contacto, /en → '').
 */
export function getPathWithoutLocale(pathname: string): string {
  const normalized = pathname.replace(/^\/+/, "").trim();
  const parts = normalized ? normalized.split("/") : [];
  if (parts.length === 0) return "";
  if (isValidLocale(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "";
  }
  return pathname || "/";
}

/**
 * Ruta localizada: mismo path lógico con otro locale.
 * Ej. getLocalizedPath('/es/contacto', 'en') → '/en/contacto'
 */
export function getLocalizedPath(pathname: string, newLocale: Locale): string {
  const withoutLocale = getPathWithoutLocale(pathname);
  return withoutLocale === "" ? `/${newLocale}` : `/${newLocale}${withoutLocale}`;
}
