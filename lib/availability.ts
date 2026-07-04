import { addDays, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";

export type DisabledRange = { from: Date; to: Date };
type OccupiedRange = { start: Date; end: Date };

/** Parse a `yyyy-mm-dd` string into a UTC-midnight Date (matches Prisma `@db.Date`). */
export function toUTCDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

/** Format a UTC-midnight `@db.Date` as its calendar date `dd/MM/yyyy` (timezone-safe). */
export function formatDate(date: Date): string {
  const [y, m, d] = date.toISOString().slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

/** Half-open overlap test: does [aStart, aEnd) intersect [bStart, bEnd)? */
export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** All occupied ranges (confirmed bookings + owner blocks) as half-open [start, end). */
async function getOccupiedRanges(): Promise<OccupiedRange[]> {
  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: { status: "CONFIRMED" },
      select: { checkIn: true, checkOut: true },
    }),
    prisma.blockedRange.findMany({ select: { startDate: true, endDate: true } }),
  ]);

  return [
    ...bookings.map((b) => ({ start: b.checkIn, end: b.checkOut })),
    ...blocks.map((b) => ({ start: b.startDate, end: b.endDate })),
  ];
}

/**
 * Ranges to feed `react-day-picker`'s `disabled` prop. Occupied nights are
 * [start, end) (checkout day is free again), so the last disabled day is end-1.
 */
export async function getDisabledRanges(): Promise<DisabledRange[]> {
  const occupied = await getOccupiedRanges();
  return occupied.map(({ start, end }) => ({ from: start, to: addDays(end, -1) }));
}

/** Server-side re-check used before creating a booking request. */
export async function isRangeAvailable(
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const today = toUTCDate(startOfDay(new Date()).toISOString().slice(0, 10));
  if (checkIn >= checkOut) return false;
  if (checkIn < today) return false;

  const occupied = await getOccupiedRanges();
  return !occupied.some(({ start, end }) =>
    rangesOverlap(checkIn, checkOut, start, end)
  );
}

/** Does this range overlap an already-confirmed booking or owner block? */
export async function hasConflict(
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const occupied = await getOccupiedRanges();
  return occupied.some(({ start, end }) =>
    rangesOverlap(checkIn, checkOut, start, end)
  );
}
