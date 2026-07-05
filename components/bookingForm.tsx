"use client";

import { useActionState, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { differenceInCalendarDays, format } from "date-fns";
import { useTranslations } from "next-intl";
import {
  submitBookingRequest,
  type BookingState,
} from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import type { DisabledRange } from "@/lib/availability";

type Props = {
  disabledRanges: DisabledRange[];
};

const calendarStyle = {
  "--rdp-accent-color": "#389f98",
  "--rdp-accent-background-color": "#d6efed",
} as React.CSSProperties;

const inputClass =
  "rounded-md border border-header/20 bg-white p-3 text-[0.95rem] focus:border-main focus:outline-none";

export default function BookingForm({ disabledRanges }: Props) {
  const t = useTranslations("booking");
  const [state, formAction, pending] = useActionState<BookingState, FormData>(
    submitBookingRequest,
    undefined
  );
  const [range, setRange] = useState<DateRange | undefined>();
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

  if (state?.success) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
        <p className="text-lg font-semibold text-main">{t("successTitle")}</p>
        <p className="mt-3 text-header/70">{t("successText")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
      <div
        className="rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.12)]"
        style={calendarStyle}
      >
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={disabled}
          excludeDisabled
          numberOfMonths={1}
          weekStartsOn={1}
        />
      </div>

      <form action={formAction} className="flex w-full max-w-md flex-col gap-4">
        <input type="hidden" name="checkIn" value={checkIn} />
        <input type="hidden" name="checkOut" value={checkOut} />

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
            <label className="flex items-center justify-between gap-4 text-sm">
              <span>{t("guests")}</span>
              <input
                type="number"
                name="guests"
                min={1}
                max={20}
                defaultValue={2}
                className="w-20 rounded-md border border-header/20 bg-white p-2 focus:border-main focus:outline-none"
              />
            </label>
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
