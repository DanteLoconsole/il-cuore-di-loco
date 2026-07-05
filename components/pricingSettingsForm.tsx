"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  updatePricingSettings,
  type PricingState,
} from "@/app/actions/pricing";
import { Button } from "@/components/ui/button";
import type { PricingConfig } from "@/lib/pricingEngine";

const inputClass =
  "rounded-md border border-header/20 bg-white p-2 text-sm focus:border-main focus:outline-none";

export default function PricingSettingsForm({
  config,
}: {
  config: PricingConfig;
}) {
  const t = useTranslations("admin.pricing");
  const [state, formAction, pending] = useActionState<PricingState, FormData>(
    updatePricingSettings,
    undefined
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)]"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-header/70">{t("baseNightlyPrice")}</span>
          <input
            type="number"
            name="baseNightlyPrice"
            min={0}
            defaultValue={config.baseNightlyPrice}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-header/70">{t("weekendSurchargePercent")}</span>
          <input
            type="number"
            name="weekendSurchargePercent"
            min={0}
            defaultValue={config.weekendSurchargePercent}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-header/70">{t("cleaningFee")}</span>
          <input
            type="number"
            name="cleaningFee"
            min={0}
            defaultValue={config.cleaningFee}
            required
            className={inputClass}
          />
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start px-5 py-2">
        {pending ? t("submitting") : t("save")}
      </Button>
    </form>
  );
}
