"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isRangeAvailable, toUTCDate } from "@/lib/availability";

export type BookingState = { error?: string } | undefined;

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum.");

const bookingSchema = z.object({
  checkIn: dateOnly,
  checkOut: dateOnly,
  guests: z.coerce.number().int().min(1).max(20),
  notes: z.string().trim().max(500).optional(),
});

export async function createBooking(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const parsed = bookingSchema.safeParse({
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    guests: formData.get("guests"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: "Selecteer geldige data en aantal gasten." };
  }

  const checkIn = toUTCDate(parsed.data.checkIn);
  const checkOut = toUTCDate(parsed.data.checkOut);

  if (!(await isRangeAvailable(checkIn, checkOut))) {
    return { error: "Deze data zijn niet (meer) beschikbaar." };
  }

  await prisma.booking.create({
    data: {
      userId: session.user.id,
      checkIn,
      checkOut,
      guests: parsed.data.guests,
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/info");
  revalidatePath("/account");
  redirect("/account?booked=1");
}

export async function cancelMyBooking(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const id = String(formData.get("id"));
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || booking.userId !== session.user.id) return;

  await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/account");
  revalidatePath("/info");
}
