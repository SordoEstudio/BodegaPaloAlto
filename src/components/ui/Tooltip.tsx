"use client";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  /** Clases adicionales para el wrapper del trigger */
  className?: string;
  /** Lado preferido para mostrar el tooltip */
  side?: "top" | "bottom";
  /** Tamaño del texto */
  size?: "small" | "medium" | "large";
}

/**
 * Tooltip estilo shadcn: fondo negro, esquinas redondeadas, texto grande.
 * Se muestra al hacer hover sobre el children.
 */
export function Tooltip({
  content,
  children,
  className = "",
  side = "top",
  size = "small",
}: TooltipProps) {
  if (!content.trim()) {
    return <>{children}</>;
  }

  const positionClass =
    side === "top"
      ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
      : "top-full left-1/2 -translate-x-1/2 mt-2";

  // Tamaños: small, medium, large
  const sizeMap: Record<
    NonNullable<TooltipProps["size"]>,
    string
  > = {
    small: "text-xs px-2.5 py-1.5",
    medium: "text-base px-4 py-2.5",
    large: "text-lg px-6 py-3",
  };
  const tooltipSizeClass = sizeMap[size] ?? sizeMap.medium;

  return (
    <div className={`group relative inline-flex ${className}`}>
      {children}
      <div
        className={`absolute z-50 ${positionClass} rounded-lg bg-black font-light text-white shadow-lg whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 ${tooltipSizeClass}`}
        role="tooltip"
        aria-hidden
      >
        {content}
      </div>
    </div>
  );
}
