import { getDisabledRanges } from "@/lib/availability";
import BookingForm from "@/components/bookingForm";
import SectionHeading from "@/components/sectionHeading";

export const dynamic = "force-dynamic";

export default async function InfoPage() {
  const disabledRanges = await getDisabledRanges();

  return (
    <div className="w-full bg-accent px-6 py-16">
      <SectionHeading className="mb-6">Info &amp; boeken</SectionHeading>

      <div className="mx-auto mb-10 max-w-2xl text-center text-header/80">
        <p>
          Kies je aankomst- en vertrekdatum in de kalender — grijze data zijn niet
          beschikbaar. Vraag daarna vrijblijvend je verblijf aan; we bevestigen je
          boeking zo snel mogelijk.
        </p>
      </div>

      <BookingForm disabledRanges={disabledRanges} />
    </div>
  );
}
