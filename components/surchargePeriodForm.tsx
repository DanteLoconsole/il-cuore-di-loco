"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  addSurchargePeriod,
  type PricingState,
} from "@/app/actions/pricing";
import { Button } from "@/components/ui/button";

const inputClass =
  "rounded-md border border-header/20 bg-white p-2 text-sm focus:border-main focus:outline-none";

export default function SurchargePeriodForm() {
  const t = useTranslations("admin.pricing");
  const [state, formAction, pending] = useActionState<PricingState, FormData>(
    addSurchargePeriod,
    undefined
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)]"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-header/70">{t("from")}</span>
          <input type="date" name="start" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-header/70">{t("to")}</span>
          <input type="date" name="end" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-header/70">{t("surchargePercent")}</span>
          <input
            type="number"
            name="percent"
            min={1}
            defaultValue={20}
            required
            className={inputClass}
          />
        </label>
      </div>
      <input
        type="text"
        name="label"
        placeholder={t("periodLabel")}
        className={inputClass}
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start px-5 py-2">
        {pending ? t("submitting") : t("addPeriod")}
      </Button>
    </form>
  );
}
