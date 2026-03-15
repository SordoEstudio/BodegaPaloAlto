"use client";

import { useState, useEffect, useCallback } from "react";
import { buildApiUrl, API_CONFIG } from "@/portable-dynamic-cms/config/api-config";

export const DEFAULT_CLIENT_SLUG =
  process.env.NEXT_PUBLIC_CLIENT_SLUG ?? "bodega-palo-alto";

export interface UsePublicProductsOptions {
  locale?: string;
  page?: number;
  limit?: number;
  category?: string;
  productType?: string;
  status?: string;
}

export interface ProductLocale {
  title: string;
  summary?: string;
  description?: string;
  seo?: { meta_title?: string; meta_description?: string };
}

export interface PublicProduct {
  _id: string;
  slug: string;
  visible?: boolean;
  is_for_sale?: boolean;
  productType?: string | null;
  locale: ProductLocale;
  categories?: string[];
  tags?: string[];
  images?: { url: string; order?: number; alt?: string }[];
  attachments?: unknown[];
  attributes?: Record<string, unknown>;
  status?: string;
  order?: number;
  featured?: boolean;
  price?: number;
  priceWholesale?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsePublicProductsReturn {
  products: PublicProduct[] | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para consumir la API pública de productos.
 * Usa el mismo clientSlug que componentes (env NEXT_PUBLIC_CLIENT_SLUG).
 */
export function usePublicProducts(
  clientSlug: string = DEFAULT_CLIENT_SLUG,
  options: UsePublicProductsOptions = {}
): UsePublicProductsReturn {
  const {
    locale = "es",
    page = 1,
    limit = 50,
    category,
    productType,
    status = "published",
  } = options;

  const [products, setProducts] = useState<PublicProduct[] | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        clientSlug,
        locale,
        page: String(page),
        limit: String(limit),
        status,
      };
      if (category) params.category = category;
      if (productType) params.productType = productType;

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS, params);
      const headers = { "Content-Type": "application/json" };

      const res = await fetch(url, { headers });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      const data = json?.data;

      setProducts(data?.products ?? []);
      setPagination(data?.pagination ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
      setProducts(null);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [clientSlug, locale, page, limit, category, productType, status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, pagination, loading, error, refetch: fetchProducts };
}
