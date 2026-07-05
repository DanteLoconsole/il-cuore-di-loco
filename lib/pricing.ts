import { prisma } from "@/lib/prisma";
import type {
  PricingConfig,
  SurchargePeriodData,
  PriceOverrideData,
} from "@/lib/pricingEngine";

const DEFAULT_PRICING: PricingConfig = {
  baseNightlyPrice: 100,
  weekendSurchargePercent: 10,
  cleaningFee: 50,
  touristTaxPerPerson: 1.5,
};

/** Reads the singleton pricing settings row, creating it with defaults on first use. */
async function getPricingConfig(): Promise<PricingConfig> {
  const settings = await prisma.pricingSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...DEFAULT_PRICING },
  });
  return {
    baseNightlyPrice: settings.baseNightlyPrice,
    weekendSurchargePercent: settings.weekendSurchargePercent,
    cleaningFee: settings.cleaningFee,
    touristTaxPerPerson: settings.touristTaxPerPerson,
  };
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** All pricing data needed to render the calendar + total, as plain serializable objects. */
export async function getPricingData(): Promise<{
  config: PricingConfig;
  surcharges: SurchargePeriodData[];
  overrides: PriceOverrideData[];
}> {
  const [config, surchargeRows, overrideRows] = await Promise.all([
    getPricingConfig(),
    prisma.surchargePeriod.findMany({ orderBy: { startDate: "asc" } }),
    prisma.priceOverride.findMany({ orderBy: { date: "asc" } }),
  ]);

  return {
    config,
    surcharges: surchargeRows.map((s) => ({
      startDate: toIsoDate(s.startDate),
      endDate: toIsoDate(s.endDate),
      percent: s.percent,
    })),
    overrides: overrideRows.map((o) => ({
      date: toIsoDate(o.date),
      price: o.price,
    })),
  };
}
