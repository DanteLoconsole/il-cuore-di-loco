import { getTranslations } from "next-intl/server";
import { getDisabledRanges } from "@/lib/availability";
import { getPricingData } from "@/lib/pricing";
import BookingForm from "@/components/bookingForm";
import SectionHeading from "@/components/sectionHeading";

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const t = await getTranslations("booking");
  const [disabledRanges, pricing] = await Promise.all([
    getDisabledRanges(),
    getPricingData(),
  ]);

  return (
    <div className="w-full bg-accent px-6 py-16">
      <SectionHeading className="mb-6">{t("heading")}</SectionHeading>

      <div className="mx-auto mb-10 max-w-2xl text-center text-header/80">
        <p>{t("intro")}</p>
      </div>

      <BookingForm disabledRanges={disabledRanges} pricing={pricing} />
    </div>
  );
}
