import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// Global fallback for paths outside any locale. The middleware normally rewrites
// unprefixed paths, so this is a rare last resort — forward to the default locale.
export default function GlobalNotFound() {
  redirect(`/${routing.defaultLocale}`);
}
