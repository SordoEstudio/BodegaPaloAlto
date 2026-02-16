export type {
  CMSComponent,
  CMSComponentsResponse,
  CMSComponentFilters,
  UseCMSComponentsReturn,
  UseCMSComponentReturn,
} from "./types/cms-components";

export { API_CONFIG, buildApiUrl } from "./config/api-config";
export type { ClientConfig } from "./config/client-config";
export {
  ClientConfigSchema,
  validateClientConfig,
  safeValidateClientConfig,
} from "./config/client-config";
export { getDefaultConfig } from "./config/default-config";
export {
  getClientConfig,
  loadClientConfigFromAPI,
} from "./config/client-config-loader";

export {
  ClientConfigProvider,
  useClientConfig,
} from "./contexts/ClientConfigProvider";

export { useCMSCache } from "./hooks/useCMSCache";
export { useCMSComponents } from "./hooks/useCMSComponents";
export { usePageCMS } from "./hooks/usePageCMS";
export {
  useComponentConfig,
  useComponentConfigValue,
} from "./hooks/useComponentConfig";

export {
  DynamicLayout,
  type DynamicLayoutProps,
  type DynamicLayoutComponentProps,
} from "./components/DynamicLayout";
