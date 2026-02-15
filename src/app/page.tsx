import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Raíz: redirige a la versión en español (original).
 */
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
