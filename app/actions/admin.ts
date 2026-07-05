"use server";

import { z } from "zod";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hasConflict, toUTCDate } from "@/lib/availability";

export type AdminState = { error?: string } | undefined;

async function requireOwner() {
  const session = await auth();
  if (session?.user?.role !== "OWNER") {
    throw new Error("Not authorized");
  }
}

function revalidateBookingViews() {
  revalidatePath("/admin");
  revalidatePath("/booking");
}

/** Accept a pending request → CONFIRMED (blocks the dates). Guards against conflicts. */
export async function acceptBooking(formData: FormData): Promise<void> {
  await requireOwner();
  const id = String(formData.get("id"));

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || booking.status !== "PENDING") return;

  if (await hasConflict(booking.checkIn, booking.checkOut, booking.id)) {
    const locale = await getLocale();
    redirect(`/${locale}/admin?conflict=1`);
  }

  await prisma.booking.update({
    where: { id },
    data: { status: "CONFIRMED" },
  });
  revalidateBookingViews();
}

/** Decline a pending request or cancel a confirmed booking → CANCELLED. */
export async function cancelBooking(formData: FormData): Promise<void> {
  await requireOwner();
  const id = String(formData.get("id"));
  await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  revalidateBookingViews();
}

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum.");
const blockSchema = z.object({
  start: dateOnly,
  end: dateOnly, // owner picks the last blocked night (inclusive)
  reason: z.string().trim().max(200).optional(),
});

export async function blockDates(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireOwner();
  const t = await getTranslations("admin.block");

  const parsed = blockSchema.safeParse({
    start: formData.get("start"),
    end: formData.get("end"),
    reason: formData.get("reason") || undefined,
  });
  if (!parsed.success) {
    return { error: t("errorInvalid") };
  }

  const startDate = toUTCDate(parsed.data.start);
  // Store the end as exclusive (owner's inclusive end + 1 day) so it lines up
  // with the half-open ranges used everywhere else.
  const endDate = addDays(toUTCDate(parsed.data.end), 1);
  if (startDate >= endDate) {
    return { error: t("errorEndBeforeStart") };
  }

  await prisma.blockedRange.create({
    data: { startDate, endDate, reason: parsed.data.reason },
  });
  revalidateBookingViews();
}

export async function unblockDates(formData: FormData): Promise<void> {
  await requireOwner();
  const id = String(formData.get("id"));
  await prisma.blockedRange.delete({ where: { id } });
  revalidateBookingViews();
}
