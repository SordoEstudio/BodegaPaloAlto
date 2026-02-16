"use client";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Nivel de contraste: "default" (más transparente) o "strong" (más opaco, mejor contraste/lectura). */
  variant?: "default" | "strong";
};

/**
 * Panel con efecto glassmorphism: fondo semitransparente, borde y blur.
 * Cumple contraste mejorado cuando variant="strong" para textos largos.
 */
export function GlassCard({
  children,
  className = "",
  variant = "default",
}: GlassCardProps) {
  const bg = variant === "strong" ? "var(--glass-bg-strong)" : "var(--glass-bg)";
  return (
    <div
      className={`rounded-2xl border border-white/35 px-8 py-10 shadow-glass backdrop-blur-xl ${className}`}
      style={{
        backgroundColor: bg,
        borderColor: "var(--glass-border)",
      }}
    >
      {children}
    </div>
  );
}
