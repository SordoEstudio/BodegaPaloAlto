import Image from "next/image";
import Link from "next/link";
import type { HomeBannerData } from "@/types/sections";

interface HomeBannerProps {
  data: HomeBannerData;
}

export function HomeBanner({ data }: HomeBannerProps) {
  const { imageSrc, imageAlt, title, href } = data;

  const content = (
    <span className="relative block aspect-[21/9] w-full overflow-hidden sm:aspect-[3/1]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      {title && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="text-center text-xl font-bold text-white drop-shadow sm:text-2xl">
            {title}
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2"
      >
        {content}
      </Link>
    );
  }

  return content;
}
