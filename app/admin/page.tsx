import { addDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/availability";
import { acceptBooking, cancelBooking, unblockDates } from "@/app/actions/admin";
import SectionHeading from "@/components/sectionHeading";
import BlockDatesForm from "@/components/blockDatesForm";

export const dynamic = "force-dynamic";

type BookingRow = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  message: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
};

function GuestDetails({ b }: { b: BookingRow }) {
  return (
    <div>
      <p className="font-semibold text-header">
        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
      </p>
      <p className="text-sm text-header/70">
        {b.guestName} · {b.guests} {b.guests > 1 ? "personen" : "persoon"}
      </p>
      <p className="text-sm text-header/70">
        <a href={`mailto:${b.email}`} className="hover:text-main">
          {b.email}
        </a>{" "}
        ·{" "}
        <a href={`tel:${b.phone}`} className="hover:text-main">
          {b.phone}
        </a>
      </p>
      {b.message && (
        <p className="mt-1 text-sm text-header/60 italic">“{b.message}”</p>
      )}
    </div>
  );
}

const cardClass =
  "flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)] sm:flex-row sm:items-center sm:justify-between";
const btnClass =
  "rounded-md border border-header/20 px-4 py-2 text-sm font-medium text-header transition-colors";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ conflict?: string }>;
}) {
  const { conflict } = await searchParams;

  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.blockedRange.findMany({ orderBy: { startDate: "asc" } }),
  ]);

  const pending = bookings.filter((b) => b.status === "PENDING");
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  return (
    <div className="w-full bg-accent px-6 py-16">
      <SectionHeading className="mb-10">Beheer</SectionHeading>

      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        {conflict && (
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            Deze aanvraag overlapt met een reeds bevestigde boeking en kon niet
            worden geaccepteerd.
          </p>
        )}

        {/* Pending requests */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-header">
            Aanvragen ({pending.length})
          </h3>
          <div className="flex flex-col gap-3">
            {pending.length === 0 && (
              <p className="text-header/70">Geen openstaande aanvragen.</p>
            )}
            {pending.map((b) => (
              <div key={b.id} className={cardClass}>
                <GuestDetails b={b} />
                <div className="flex gap-2">
                  <form action={acceptBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <button
                      type="submit"
                      className={`${btnClass} border-main bg-main text-white hover:bg-main-hover`}
                    >
                      Accepteren
                    </button>
                  </form>
                  <form action={cancelBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <button
                      type="submit"
                      className={`${btnClass} hover:border-red-400 hover:text-red-600`}
                    >
                      Weigeren
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Confirmed bookings */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-header">
            Bevestigde boekingen ({confirmed.length})
          </h3>
          <div className="flex flex-col gap-3">
            {confirmed.length === 0 && (
              <p className="text-header/70">Nog geen bevestigde boekingen.</p>
            )}
            {confirmed.map((b) => (
              <div key={b.id} className={cardClass}>
                <GuestDetails b={b} />
                <form action={cancelBooking}>
                  <input type="hidden" name="id" value={b.id} />
                  <button
                    type="submit"
                    className={`${btnClass} hover:border-red-400 hover:text-red-600`}
                  >
                    Annuleren
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>

        {/* Blocked dates */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-header">
            Geblokkeerde data
          </h3>
          <div className="mb-6 flex flex-col gap-3">
            {blocks.length === 0 && (
              <p className="text-header/70">Geen geblokkeerde periodes.</p>
            )}
            {blocks.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)]"
              >
                <p className="text-header">
                  <span className="font-semibold">
                    {formatDate(r.startDate)} → {formatDate(addDays(r.endDate, -1))}
                  </span>
                  {r.reason && (
                    <span className="text-header/60"> · {r.reason}</span>
                  )}
                </p>
                <form action={unblockDates}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className={`${btnClass} hover:border-red-400 hover:text-red-600`}
                  >
                    Deblokkeren
                  </button>
                </form>
              </div>
            ))}
          </div>
          <BlockDatesForm />
        </section>

        {/* Declined / cancelled (compact) */}
        {cancelled.length > 0 && (
          <section>
            <h3 className="mb-4 text-lg font-bold text-header/60">
              Geweigerd / geannuleerd ({cancelled.length})
            </h3>
            <div className="flex flex-col gap-2">
              {cancelled.map((b) => (
                <p key={b.id} className="text-sm text-header/50">
                  {formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {b.guestName}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
