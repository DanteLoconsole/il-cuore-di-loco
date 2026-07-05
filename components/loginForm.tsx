"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import SectionHeading from "@/components/sectionHeading";
import { Button } from "@/components/ui/button";

const inputClass =
  "rounded-md border border-header/20 bg-white p-3 text-[0.95rem] focus:border-main focus:outline-none";

export default function LoginForm() {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  // callbackUrl is a fully-localized path (e.g. /nl/admin) so we don't re-prefix.
  const callbackUrl = params.get("callbackUrl") || `/${locale}/admin`;

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirect: false,
    });

    setPending(false);
    if (res?.error) {
      setError(t("error"));
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md px-6 py-16">
      <SectionHeading>{t("heading")}</SectionHeading>
      <p className="mt-4 text-center text-sm text-header/70">{t("subtitle")}</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder={t("email")}
          autoComplete="email"
          required
          className={inputClass}
        />
        <input
          type="password"
          name="password"
          placeholder={t("password")}
          autoComplete="current-password"
          required
          className={inputClass}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={pending} className="p-4">
          {pending ? t("submitting") : t("submit")}
        </Button>
      </form>
    </div>
  );
}
