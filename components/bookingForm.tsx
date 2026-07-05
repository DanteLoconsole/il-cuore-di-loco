"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { DayPicker, type DateRange, type DayButtonProps } from "react-day-picker";
import "react-day-picker/style.css";
import { differenceInCalendarDays, format } from "date-fns";
import { useTranslations, useFormatter } from "next-intl";
import {
  submitBookingRequest,
  type BookingState,
} from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DisabledRange } from "@/lib/availability";
import {
  computeNightlyPrice,
  computeStayTotal,
  type PricingConfig,
  type SurchargePeriodData,
  type PriceOverrideData,
} from "@/lib/pricingEngine";

type Props = {
  disabledRanges: DisabledRange[];
  pricing: {
    config: PricingConfig;
    surcharges: SurchargePeriodData[];
    overrides: PriceOverrideData[];
  };
};

const calendarStyle = {
  "--rdp-accent-color": "#389f98",
  "--rdp-accent-background-color": "#d6efed",
  // Taller day cells/buttons so the price line fits under the day number.
  "--rdp-day-height": "56px",
  "--rdp-day_button-height": "56px",
} as React.CSSProperties;

const inputClass =
  "rounded-md border border-header/20 bg-white p-3 text-[0.95rem] focus:border-main focus:outline-none";

const MAX_GUESTS = 3;

function makePriceDayButton(
  pricing: Props["pricing"],
  formatMoney: (value: number) => string
) {
  return function PriceDayButton({
    day,
    modifiers,
    children,
    className,
    ...rest
  }: DayButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      if (modifiers.focused) ref.current?.focus();
    }, [modifiers.focused]);

    const showPrice = !modifiers.disabled && !modifiers.outside && !modifiers.hidden;
    const price = showPrice
      ? computeNightlyPrice(
          day.date,
          pricing.config,
          pricing.surcharges,
          pricing.overrides
        )
      : null;

    return (
      <button
        ref={ref}
        className={cn(className, "flex-col! gap-0.5 leading-none")}
        {...rest}
      >
        <span>{children}</span>
        {price !== null && (
          <span
            className={cn(
              "text-[9px] leading-none",
              // The check-in day gets a solid teal circle with white text.
              // The checkout day keeps the default color: it's not a paid night.
              modifiers.range_start ? "text-white" : "text-main"
            )}
          >
            {formatMoney(price)}
          </span>
        )}
      </button>
    );
  };
}

export default function BookingForm({ disabledRanges, pricing }: Props) {
  const t = useTranslations("booking");
  const format2 = useFormatter();
  // minimumFractionDigits: 0 keeps whole-euro amounts clean (e.g. "€100")
  // while still showing cents when the tourist tax makes a total fractional
  // (e.g. "€4.50").
  const money = (value: number) =>
    format2.number(value, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const [state, formAction, pending] = useActionState<BookingState, FormData>(
    submitBookingRequest,
    undefined
  );
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [showForm, setShowForm] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const disabled = [{ before: today }, ...disabledRanges];

  const checkIn = range?.from ? format(range.from, "yyyy-MM-dd") : "";
  const checkOut = range?.to ? format(range.to, "yyyy-MM-dd") : "";
  const nights =
    range?.from && range?.to
      ? differenceInCalendarDays(range.to, range.from)
      : 0;
  const valid = nights >= 1;

  const stayTotal =
    valid && range?.from && range?.to
      ? computeStayTotal(
          range.from,
          range.to,
          guests,
          pricing.config,
          pricing.surcharges,
          pricing.overrides
        )
      : null;

  const [PriceDayButton] = useState(() => makePriceDayButton(pricing, money));

  if (state?.success) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="rounded-2xl bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
          <p className="text-lg font-semibold text-main">{t("successTitle")}</p>
          <p className="mt-3 text-header/70">{t("successText")}</p>
        </div>
        <p className="mt-4 text-sm text-header/70">{t("successEmailNote")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
        <div className="rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={disabled}
            excludeDisabled
            numberOfMonths={1}
            weekStartsOn={1}
            style={calendarStyle}
            components={{ DayButton: PriceDayButton }}
          />
        </div>

        <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
          <h3 className="mb-3 font-bold text-header">{t("priceSummaryHeading")}</h3>

          <label className="mb-3 flex items-center justify-between gap-4 text-sm text-header/80">
            <span>{t("guests")}</span>
            <input
              type="number"
              min={1}
              max={MAX_GUESTS}
              value={guests}
              onChange={(e) =>
                setGuests(
                  Math.min(MAX_GUESTS, Math.max(1, Number(e.target.value) || 1))
                )
              }
              className="w-20 rounded-md border border-header/20 bg-white p-2 focus:border-main focus:outline-none"
            />
          </label>

          {stayTotal ? (
            <div className="flex flex-col gap-2 text-sm text-header/80">
              <div className="flex justify-between">
                <span>{t("nightsCount", { count: nights })}</span>
                <span>{money(stayTotal.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("cleaningFeeLabel")}</span>
                <span>{money(stayTotal.cleaningFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("touristTaxLabel")}</span>
                <span>{money(stayTotal.touristTax)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-header/10 pt-2 font-bold text-header">
                <span>{t("totalLabel")}</span>
                <span>{money(stayTotal.total)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-header/60">{t("selectDates")}</p>
          )}
        </div>
      </div>

      <form action={formAction} className="flex w-full max-w-md flex-col gap-4">
        <input type="hidden" name="checkIn" value={checkIn} />
        <input type="hidden" name="checkOut" value={checkOut} />
        <input type="hidden" name="guests" value={guests} />

        <p className="text-center text-sm text-header/70">
          {valid
            ? t("nights", { count: nights, range: `${checkIn} → ${checkOut}` })
            : t("selectDates")}
        </p>

        {!showForm ? (
          <Button
            type="button"
            disabled={!valid}
            onClick={() => setShowForm(true)}
            className="p-4"
          >
            {t("request")}
          </Button>
        ) : (
          <>
            <input
              type="text"
              name="guestName"
              placeholder={t("name")}
              autoComplete="name"
              required
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder={t("email")}
              autoComplete="email"
              required
              className={inputClass}
            />
            <input
              type="tel"
              name="phone"
              placeholder={t("phone")}
              autoComplete="tel"
              required
              className={inputClass}
            />
            <textarea
              name="message"
              rows={3}
              placeholder={t("message")}
              className={inputClass}
            />

            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

            <Button type="submit" disabled={!valid || pending} className="p-4">
              {pending ? t("submitting") : t("submit")}
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
