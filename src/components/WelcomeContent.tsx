"use client";

import { useRouter } from "next/navigation";
import { HeroFullScreen } from "@/components/HeroFullScreen";
import { GlassCard } from "@/components/GlassCard";
import { AGE_VERIFIED_COOKIE } from "@/lib/ageGate";
import type { WelcomeData } from "@/types/sections";

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 año

function setAgeVerifiedCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AGE_VERIFIED_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

interface WelcomeContentProps {
  data: WelcomeData;
}

export function WelcomeContent({ data }: WelcomeContentProps) {
  const router = useRouter();
  const { hero, title, message, legalNotice, buttons } = data;

  const handleConfirm = () => {
    setAgeVerifiedCookie();
    router.push("/");
  };

  const handleDecline = () => {
    window.location.href = buttons.declineUrl;
  };

  return (
    <HeroFullScreen
      imageSrc={hero.imageSrc || undefined}
      imageAlt={hero.imageAlt}
      contentClassName="text-white"
    >
      <GlassCard variant="strong" className="w-full max-w-md">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed opacity-95">{message}</p>
        <p className="mt-2 text-sm opacity-90">{legalNotice}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleConfirm}
            className="min-h-[44px] min-w-[140px] rounded-full bg-palo-alto-primary px-6 py-3 font-bold text-palo-alto-secondary shadow-lg transition focus:outline-none focus:ring-0 hover:opacity-95 active:opacity-90"
            aria-label={buttons.confirmAriaLabel}
          >
            {buttons.confirm}
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="min-h-[44px] min-w-[140px] rounded-full border-2 border-white/60 bg-transparent px-6 py-3 font-semibold text-white transition focus:outline-none focus:ring-0 hover:bg-white/10 hover:border-white/80 active:bg-white/20"
            aria-label={buttons.declineAriaLabel}
          >
            {buttons.decline}
          </button>
        </div>
      </GlassCard>
    </HeroFullScreen>
  );
}
