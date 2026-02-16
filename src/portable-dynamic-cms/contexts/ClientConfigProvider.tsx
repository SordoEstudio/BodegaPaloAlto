"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { ClientConfig } from "../config/client-config";
import { loadClientConfigFromAPI } from "../config/client-config-loader";
import { getDefaultConfig } from "../config/default-config";

interface ClientConfigContextValue {
  config: ClientConfig | null;
  loading: boolean;
  error: string | null;
}

const ClientConfigContext = createContext<ClientConfigContextValue>({
  config: null,
  loading: true,
  error: null,
});

export function useClientConfig() {
  const ctx = useContext(ClientConfigContext);
  if (!ctx) {
    return {
      config: getDefaultConfig(),
      loading: false,
      error: null,
    };
  }
  return {
    config: ctx.config ?? getDefaultConfig(),
    loading: ctx.loading,
    error: ctx.error,
  };
}

interface ClientConfigProviderProps {
  children: ReactNode;
  initialConfig?: ClientConfig | null;
}

export function ClientConfigProvider({
  children,
  initialConfig,
}: ClientConfigProviderProps) {
  const [config, setConfig] = useState<ClientConfig | null>(initialConfig ?? null);
  const [loading, setLoading] = useState(!initialConfig);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const hostname =
      typeof window !== "undefined" ? window.location.host : "localhost";
    loadClientConfigFromAPI(hostname)
      .then((c) => {
        if (!cancelled) setConfig(c ?? getDefaultConfig());
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? "Failed to load config");
          setConfig(getDefaultConfig());
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialConfig]);

  const value = useMemo(
    () => ({ config: config ?? null, loading, error }),
    [config, loading, error]
  );

  return (
    <ClientConfigContext.Provider value={value}>
      {children}
    </ClientConfigContext.Provider>
  );
}
