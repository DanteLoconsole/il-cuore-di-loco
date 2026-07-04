"use client";

import { useActionState, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { differenceInCalendarDays, format } from "date-fns";
import Link from "next/link";
import { createBooking, type BookingState } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import type { DisabledRange } from "@/lib/availability";

type Props = {
  disabledRanges: DisabledRange[];
  canBook: boolean;
};

const calendarStyle = {
  "--rdp-accent-color": "#389f98",
  "--rdp-accent-background-color": "#d6efed",
} as React.CSSProperties;

export default function BookingForm({ disabledRanges, canBook }: Props) {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(
    createBooking,
    undefined
  );
  const [range, setRange] = useState<DateRange | undefined>();

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

      {canBook ? (
        <form action={formAction} className="flex w-full max-w-md flex-col gap-4">
          <input type="hidden" name="checkIn" value={checkIn} />
          <input type="hidden" name="checkOut" value={checkOut} />

          <p className="text-center text-sm text-header/70">
            {valid
              ? `${nights} ${nights > 1 ? "nachten" : "nacht"}: ${checkIn} → ${checkOut}`
              : "Selecteer een aankomst- en vertrekdatum."}
          </p>

          <label className="flex items-center justify-between gap-4 text-sm">
            <span>Aantal gasten</span>
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
            name="notes"
            rows={3}
            placeholder="Opmerkingen (optioneel)"
            className="rounded-md border border-header/20 bg-white p-3 text-[0.95rem] focus:border-main focus:outline-none"
          />

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <Button type="submit" disabled={!valid || pending} className="p-4">
            {pending ? "Bezig…" : "Boek nu"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-header/70">Log in om je verblijf te boeken.</p>
          <Link
            href="/login?callbackUrl=/info"
            className="rounded-md bg-main px-5 py-3 font-medium text-white transition-colors hover:bg-main-hover hover:no-underline!"
          >
            Log in om te boeken
          </Link>
        </div>
      )}
    </div>
  );
}
