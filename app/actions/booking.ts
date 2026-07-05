"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { isRangeAvailable, toUTCDate } from "@/lib/availability";

export type BookingState = { error?: string; success?: boolean } | undefined;

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum.");

const requestSchema = z.object({
  guestName: z.string().trim().min(1, "Naam is verplicht."),
  email: z.string().trim().email("Ongeldig e-mailadres."),
  phone: z.string().trim().min(4, "Telefoonnummer is verplicht."),
  guests: z.coerce.number().int().min(1).max(3),
  message: z.string().trim().max(1000).optional(),
  checkIn: dateOnly,
  checkOut: dateOnly,
});

/** Public — anyone can submit a booking request; the owner approves it later. */
export async function submitBookingRequest(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const t = await getTranslations("booking");
  const parsed = requestSchema.safeParse({
    guestName: formData.get("guestName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    guests: formData.get("guests"),
    message: formData.get("message") || undefined,
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
  });
  if (!parsed.success) {
    return { error: t("errorInvalid") };
  }

  const checkIn = toUTCDate(parsed.data.checkIn);
  const checkOut = toUTCDate(parsed.data.checkOut);

  // Reject dates that are already confirmed/blocked (pending requests don't block).
  if (!(await isRangeAvailable(checkIn, checkOut))) {
    return { error: t("errorUnavailable") };
  }

  await prisma.booking.create({
    data: {
      guestName: parsed.data.guestName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      guests: parsed.data.guests,
      message: parsed.data.message,
      checkIn,
      checkOut,
      // status defaults to PENDING
    },
  });

  revalidatePath("/info");
  revalidatePath("/admin");
  return { success: true };
}
