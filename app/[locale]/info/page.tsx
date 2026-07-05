import { getTranslations } from "next-intl/server";
import { getDisabledRanges } from "@/lib/availability";
import BookingForm from "@/components/bookingForm";
import SectionHeading from "@/components/sectionHeading";

export const dynamic = "force-dynamic";

export default async function InfoPage() {
  const t = await getTranslations("info");
  const disabledRanges = await getDisabledRanges();

  return (
    <div className="w-full bg-accent px-6 py-16">
      <SectionHeading className="mb-6">{t("heading")}</SectionHeading>

      <div className="mx-auto mb-10 max-w-2xl text-center text-header/80">
        <p>{t("intro")}</p>
      </div>

      <BookingForm disabledRanges={disabledRanges} />
    </div>
  );
}
