"use client";

import { useRouter } from "next/navigation";
import { HeroFullScreen } from "@/components/HeroFullScreen";
import { setAgeVerifiedSession } from "@/lib/ageGate";
import type { WelcomeData } from "@/types/sections";

interface WelcomeContentProps {
  data: WelcomeData;
}

export function WelcomeContent({ data }: WelcomeContentProps) {
  const router = useRouter();
  const { hero, title, message, legalNotice, buttons } = data;

  const handleConfirm = () => {
    setAgeVerifiedSession();
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
<div className="backdrop-blur-sm bg-black/30 rounded-2xl border border-white/35 px-8 py-10 ">
         <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed opacity-95">{message}</p>
        <p className="mt-2 text-sm opacity-90">{legalNotice}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => handleConfirm()}
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
      </div>
    </HeroFullScreen>
  );
}
