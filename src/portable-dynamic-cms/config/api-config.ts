/**
 * Configuración de API para CMS y client-config.
 * El backend detecta el dominio por header Host o query ?host=.
 */

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

export const API_CONFIG = {
  BASE_URL: (() => {
    if (isProduction) {
      const prodApiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!prodApiUrl || prodApiUrl.includes("localhost")) {
        return process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/public/v1`
          : "/api/public/v1";
      }
      return prodApiUrl.replace(/\/$/, "");
    }
    if (isDevelopment) {
      const devUrl =
        process.env.NEXT_PUBLIC_API_DEV ?? process.env.NEXT_PUBLIC_API_URL ?? "";
      if (devUrl) return devUrl.replace(/\/$/, "");
      return "/api/public/v1";
    }
    return process.env.NEXT_PUBLIC_API_URL ?? "";
  })(),

  ENDPOINTS: {
    CLIENT_CONFIG: "/client-config",
    CMS_COMPONENTS: "/cms-components",
  },
} as const;

export function buildApiUrl(
  endpoint: string,
  params?: Record<string, string>
): string {
  const base = API_CONFIG.BASE_URL;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullPath = base.endsWith("/") ? `${base.replace(/\/$/, "")}${path}` : `${base}${path}`;
  let url: string;
  if (typeof window !== "undefined") {
    url = fullPath.startsWith("/")
      ? `${window.location.origin}${fullPath}`
      : fullPath;
  } else {
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    url = fullPath.startsWith("/") ? `${origin}${fullPath}` : fullPath;
  }
  const parsed = new URL(url);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && String(value).trim() !== "") {
        parsed.searchParams.append(key, String(value));
      }
    });
  }
  return parsed.toString();
}
