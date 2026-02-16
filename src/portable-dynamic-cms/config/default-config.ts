import type { ClientConfig } from "./client-config";

export function getDefaultConfig(): ClientConfig {
  return {
    client: {
      slug: "palo-alto",
      name: "Bodega Palo Alto",
      plan: "basic",
      isActive: true,
    },
    branding: {
      primaryColor: "#1a1a1a",
      secondaryColor: "#8b6914",
      accentColor: "#c9a227",
    },
    features: {
      contactForm: true,
      analytics: true,
      cookieConsent: true,
    },
    seo: {
      titleTemplate: "%s | Bodega Palo Alto",
      defaultTitle: "Bodega Palo Alto | Mendoza, Argentina",
      defaultDescription:
        "La pasión por las tierras mendocinas y la nobleza de la vid dieron origen a esta empresa familiar.",
      robots: "index, follow",
    },
  };
}
