"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  subscribeNewsletter,
  type NewsletterState,
} from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";

const inputClass =
  "rounded-md border border-header/20 bg-white p-3 text-[0.95rem] focus:border-main focus:outline-none";

export default function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [state, formAction, pending] = useActionState<NewsletterState, FormData>(
    subscribeNewsletter,
    undefined
  );

  if (state?.success) {
    return (
      <p className="mt-6 rounded-md bg-white p-4 text-center font-medium text-main shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        {t("success")}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4 text-left">
      <input
        type="text"
        name="name"
        placeholder={t("name")}
        className={inputClass}
      />
      <input
        type="email"
        name="email"
        placeholder={t("email")}
        required
        className={inputClass}
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="p-4">
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
