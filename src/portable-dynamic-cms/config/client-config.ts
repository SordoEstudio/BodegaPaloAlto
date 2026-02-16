import { z } from "zod";

/**
 * Schema de configuración por cliente (adaptado a Bodega Palo Alto).
 * Fuente: API (client-config) o JSON local en desarrollo.
 */

export const ClientConfigSchema = z.object({
  client: z.object({
    slug: z.string().min(1).max(50),
    name: z.string().min(1),
    plan: z.enum(["basic", "custom", "premium", "enterprise"]).optional().default("basic"),
    domains: z
      .array(
        z.object({
          domain: z.string(),
          subdomain: z.string().optional(),
          isPrimary: z.boolean().optional().default(false),
        })
      )
      .optional(),
    isActive: z.boolean().optional().default(true),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),

  branding: z.object({
    logo: z.string().nullable().optional(),
    logoAlt: z.string().optional(),
    logoWidth: z.number().optional(),
    logoHeight: z.number().optional(),
    favicon: z.string().nullable().optional(),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    fontFamily: z.string().optional(),
    heroBackground: z.string().optional(),
    defaultBackground: z.string().optional(),
  }),

  features: z
    .object({
      contactForm: z.boolean().optional().default(true),
      analytics: z.boolean().optional().default(true),
      cookieConsent: z.boolean().optional().default(true),
    })
    .optional(),

  seo: z
    .object({
      titleTemplate: z.string().optional(),
      defaultTitle: z.string().optional(),
      defaultDescription: z.string().optional(),
      ogImage: z.string().nullable().optional(),
      robots: z.string().optional().default("index, follow"),
    })
    .optional(),
});

export type ClientConfig = z.infer<typeof ClientConfigSchema>;

export function validateClientConfig(data: unknown): ClientConfig {
  return ClientConfigSchema.parse(data);
}

export function safeValidateClientConfig(data: unknown): {
  success: boolean;
  data?: ClientConfig;
  error?: z.ZodError;
} {
  const result = ClientConfigSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}
