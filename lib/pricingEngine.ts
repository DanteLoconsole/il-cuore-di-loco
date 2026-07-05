// Pure pricing calculations — no Prisma import, safe to use from client
// components (e.g. the live total shown while picking dates in BookingForm).

export type PricingConfig = {
  baseNightlyPrice: number;
  weekendSurchargePercent: number;
  cleaningFee: number;
};

export type SurchargePeriodData = {
  startDate: string; // yyyy-MM-dd, inclusive
  endDate: string; // yyyy-MM-dd, exclusive (half-open)
  percent: number;
};

export type PriceOverrideData = {
  date: string; // yyyy-MM-dd
  price: number;
};

export type StayNight = { date: string; price: number };
export type StayTotal = {
  nights: StayNight[];
  subtotal: number;
  cleaningFee: number;
  total: number;
};

/**
 * Friday & Saturday nights count as "weekend" (0=Sun … 6=Sat).
 *
 * Uses local getters deliberately: the only caller today is BookingForm,
 * where `date` comes from react-day-picker's calendar cells — those are
 * local-midnight Date objects representing a calendar day, not UTC
 * instants. Reading them with UTC getters would shift the day backward
 * for any visitor whose timezone is ahead of UTC.
 */
export function isWeekendNight(date: Date): boolean {
  const day = date.getDay();
  return day === 5 || day === 6;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Nightly price for a single date. An override always wins; otherwise the
 * base rate is multiplied by the weekend surcharge (if applicable) and every
 * matching surcharge period, each stacking as an independent × (1 + pct/100).
 */
export function computeNightlyPrice(
  date: Date,
  config: PricingConfig,
  surcharges: SurchargePeriodData[],
  overrides: PriceOverrideData[]
): number {
  const iso = toIsoDate(date);
  const override = overrides.find((o) => o.date === iso);
  if (override) return override.price;

  let price = config.baseNightlyPrice;
  if (isWeekendNight(date)) {
    price *= 1 + config.weekendSurchargePercent / 100;
  }

  for (const s of surcharges) {
    if (iso >= s.startDate && iso < s.endDate) {
      price *= 1 + s.percent / 100;
    }
  }

  return Math.round(price);
}

/** Sum of nightly prices for the half-open range [checkIn, checkOut) plus the cleaning fee. */
export function computeStayTotal(
  checkIn: Date,
  checkOut: Date,
  config: PricingConfig,
  surcharges: SurchargePeriodData[],
  overrides: PriceOverrideData[]
): StayTotal {
  const nights: StayNight[] = [];
  let subtotal = 0;

  const cursor = new Date(checkIn);
  while (cursor < checkOut) {
    const price = computeNightlyPrice(cursor, config, surcharges, overrides);
    nights.push({ date: toIsoDate(cursor), price });
    subtotal += price;
    cursor.setDate(cursor.getDate() + 1);
  }

  return {
    nights,
    subtotal,
    cleaningFee: config.cleaningFee,
    total: subtotal + config.cleaningFee,
  };
}
