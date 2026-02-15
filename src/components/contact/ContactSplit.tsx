import Link from "next/link";
import type { ContactPageData } from "@/types/sections";

interface ContactSplitProps {
  data: Pick<ContactPageData, "mapTitle" | "mapLinkLabel" | "mapEmbedUrl" | "mapLinkUrl">;
}

export function ContactSplit({ data }: ContactSplitProps) {
  const { mapTitle, mapLinkLabel, mapEmbedUrl, mapLinkUrl } = data;

  return (
    <section
      className="border-t border-zinc-200 bg-black"
      aria-labelledby="contact-map-heading"
    >
      <div className="px-6 py-8 md:py-10">
        <h2
          id="contact-map-heading"
          className="font-heading text-2xl font-bold text-palo-alto-secondary sm:text-3xl"
        >
          {mapTitle}
        </h2>
      </div>
      <div className="relative min-h-[300px] bg-zinc-100 md:min-h-[400px]">
        {mapEmbedUrl ? (
          <iframe
            src={mapEmbedUrl}
            title={mapTitle}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-full min-h-[300px] items-center justify-center p-6 md:min-h-[400px]">
            <Link
              href={mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-palo-alto-primary px-6 py-3 font-semibold text-palo-alto-secondary transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-palo-alto-primary focus:ring-offset-2"
            >
              {mapLinkLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
