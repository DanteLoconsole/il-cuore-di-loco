"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<string, string> = { nl: "NL", en: "EN", it: "IT" };

export default function LanguageSwitcher({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => {
            onNavigate?.();
            router.replace(pathname, { locale: l });
          }}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "cursor-pointer rounded px-1.5 py-0.5 transition-colors",
            l === locale
              ? "font-bold text-main"
              : "text-header/60 hover:text-main"
          )}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
