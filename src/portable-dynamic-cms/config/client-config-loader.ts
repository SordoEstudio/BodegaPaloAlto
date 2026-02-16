import { cache } from "react";
import type { ClientConfig } from "./client-config";
import { safeValidateClientConfig } from "./client-config";
import { getDefaultConfig } from "./default-config";

function resolveBaseUrl(apiUrl: string | undefined, serverOrigin?: string): string | null {
  if (apiUrl) {
    if (apiUrl.includes("/api/public/v1")) {
      return apiUrl.replace(/\/$/, "");
    }
    return `${apiUrl.replace(/\/$/, "")}/api/public/v1`;
  }
  if (serverOrigin) {
    return `${serverOrigin.replace(/\/$/, "")}/api/public/v1`;
  }
  return null;
}

async function _getClientConfigInternal(
  hostname: string,
  serverOrigin?: string
): Promise<ClientConfig> {
  const cleanHostname = hostname.split(":")[0];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const isDev = process.env.NODE_ENV === "development";
  const baseUrl = resolveBaseUrl(apiUrl, serverOrigin);

  if (baseUrl) {
    const fullUrl = `${baseUrl}/client-config?host=${encodeURIComponent(cleanHostname)}`;

    try {
      const response = await fetch(fullUrl, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(5000),
        headers: { "X-Original-Host": cleanHostname },
      });

      if (response.ok) {
        const rawData = await response.json();
        const data =
          rawData &&
          typeof rawData === "object" &&
          "data" in rawData &&
          rawData.data
            ? rawData.data
            : rawData;
        const validation = safeValidateClientConfig(data);
        if (validation.success && validation.data) return validation.data;
      }
    } catch (error) {
      if (isDev) {
        console.warn(
          "[ClientConfig] Error loading from API:",
          error instanceof Error ? error.message : error
        );
      }
    }
  }

  return getDefaultConfig();
}

export const getClientConfig = cache(_getClientConfigInternal);

export async function loadClientConfigFromAPI(
  hostname: string
): Promise<ClientConfig | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return null;

    const baseUrl = apiUrl.includes("/api/public/v1")
      ? apiUrl.replace(/\/$/, "")
      : `${apiUrl.replace(/\/$/, "")}/api/public/v1`;
    const fullUrl = `${baseUrl}/client-config?host=${encodeURIComponent(hostname)}`;

    const response = await fetch(fullUrl, {
      cache: "no-store",
      headers: { "X-Original-Host": hostname },
    });

    if (response.ok) {
      const raw = await response.json();
      const data = raw?.data ?? raw;
      const validation = safeValidateClientConfig(data);
      if (validation.success && validation.data) return validation.data;
    }
  } catch (error) {
    console.error("[ClientConfig] Failed to load from API (client):", error);
  }
  return null;
}
