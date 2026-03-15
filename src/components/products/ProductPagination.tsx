"use client";

import type { Pagination } from "@/hooks/usePublicProducts";
import type { ProductosTranslations } from "@/lib/ui-translations";

interface ProductPaginationProps {
  pagination: Pagination;
  locale: string;
  ui: ProductosTranslations;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function ProductPagination({ pagination, locale, ui, currentPage, onPageChange }: ProductPaginationProps) {
  const { page, pages, total, limit } = pagination;
  const pageNum = currentPage ?? page;

  if (total <= limit || pages <= 1) return null;

  const pageOfText = ui.pagination.pageOf
    .replace("{page}", String(pageNum))
    .replace("{total}", String(pages));

  const btnClass =
    "rounded border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/30 focus:outline-none";
  const disabledClass =
    "cursor-not-allowed rounded border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/40";

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Paginación de productos"
    >
      {pageNum > 1 ? (
        onPageChange ? (
          <button
            type="button"
            onClick={() => onPageChange(pageNum - 1)}
            className={btnClass}
          >
            {ui.pagination.previous}
          </button>
        ) : (
          <a href={`/${locale}/productos?page=${pageNum - 1}`} className={btnClass}>
            {ui.pagination.previous}
          </a>
        )
      ) : (
        <span className={disabledClass} aria-disabled>
          {ui.pagination.previous}
        </span>
      )}

      <span className="px-2 text-sm text-white/80" aria-live="polite">
        {pageOfText}
      </span>

      {pageNum < pages ? (
        onPageChange ? (
          <button
            type="button"
            onClick={() => onPageChange(pageNum + 1)}
            className={btnClass}
          >
            {ui.pagination.next}
          </button>
        ) : (
          <a href={`/${locale}/productos?page=${pageNum + 1}`} className={btnClass}>
            {ui.pagination.next}
          </a>
        )
      ) : (
        <span className={disabledClass} aria-disabled>
          {ui.pagination.next}
        </span>
      )}
    </nav>
  );
}
