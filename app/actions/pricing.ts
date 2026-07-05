"use server";

import { z } from "zod";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { toUTCDate } from "@/lib/availability";

export type PricingState = { error?: string } | undefined;

async function requireOwner() {
  const session = await auth();
  if (session?.user?.role !== "OWNER") {
    throw new Error("Not authorized");
  }
}

function revalidatePricingViews() {
  revalidatePath("/admin");
  revalidatePath("/info");
}

const settingsSchema = z.object({
  baseNightlyPrice: z.coerce.number().int().min(0),
  weekendSurchargePercent: z.coerce.number().int().min(0).max(500),
  cleaningFee: z.coerce.number().int().min(0),
  touristTaxPerPerson: z.coerce.number().min(0),
});

export async function updatePricingSettings(
  _prev: PricingState,
  formData: FormData
): Promise<PricingState> {
  await requireOwner();
  const t = await getTranslations("admin.pricing");

  const parsed = settingsSchema.safeParse({
    baseNightlyPrice: formData.get("baseNightlyPrice"),
    weekendSurchargePercent: formData.get("weekendSurchargePercent"),
    cleaningFee: formData.get("cleaningFee"),
    touristTaxPerPerson: formData.get("touristTaxPerPerson"),
  });
  if (!parsed.success) {
    return { error: t("errorInvalid") };
  }

  await prisma.pricingSettings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  revalidatePricingViews();
}

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date.");
const surchargeSchema = z.object({
  start: dateOnly,
  end: dateOnly, // owner picks the last surcharged night (inclusive)
  percent: z.coerce.number().int().min(1).max(500),
  label: z.string().trim().max(100).optional(),
});

export async function addSurchargePeriod(
  _prev: PricingState,
  formData: FormData
): Promise<PricingState> {
  await requireOwner();
  const t = await getTranslations("admin.pricing");

  const parsed = surchargeSchema.safeParse({
    start: formData.get("start"),
    end: formData.get("end"),
    percent: formData.get("percent"),
    label: formData.get("label") || undefined,
  });
  if (!parsed.success) {
    return { error: t("errorInvalid") };
  }

  const startDate = toUTCDate(parsed.data.start);
  // Stored end is exclusive (owner's inclusive end + 1 day), same convention as blockDates.
  const endDate = addDays(toUTCDate(parsed.data.end), 1);
  if (startDate >= endDate) {
    return { error: t("errorEndBeforeStart") };
  }

  await prisma.surchargePeriod.create({
    data: {
      startDate,
      endDate,
      percent: parsed.data.percent,
      label: parsed.data.label,
    },
  });
  revalidatePricingViews();
}

export async function removeSurchargePeriod(formData: FormData): Promise<void> {
  await requireOwner();
  const id = String(formData.get("id"));
  await prisma.surchargePeriod.delete({ where: { id } });
  revalidatePricingViews();
}

const overrideSchema = z.object({
  date: dateOnly,
  price: z.coerce.number().int().min(0),
});

export async function addPriceOverride(
  _prev: PricingState,
  formData: FormData
): Promise<PricingState> {
  await requireOwner();
  const t = await getTranslations("admin.pricing");

  const parsed = overrideSchema.safeParse({
    date: formData.get("date"),
    price: formData.get("price"),
  });
  if (!parsed.success) {
    return { error: t("errorInvalid") };
  }

  const date = toUTCDate(parsed.data.date);
  await prisma.priceOverride.upsert({
    where: { date },
    update: { price: parsed.data.price },
    create: { date, price: parsed.data.price },
  });
  revalidatePricingViews();
}

export async function removePriceOverride(formData: FormData): Promise<void> {
  await requireOwner();
  const id = String(formData.get("id"));
  await prisma.priceOverride.delete({ where: { id } });
  revalidatePricingViews();
}
