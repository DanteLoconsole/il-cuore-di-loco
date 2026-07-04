import { addDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/availability";
import { cancelBooking, unblockDates } from "@/app/actions/admin";
import SectionHeading from "@/components/sectionHeading";
import BlockDatesForm from "@/components/blockDatesForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { checkIn: "asc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.blockedRange.findMany({ orderBy: { startDate: "asc" } }),
  ]);

  return (
    <div className="w-full bg-accent px-6 py-16">
      <SectionHeading className="mb-10">Beheer</SectionHeading>

      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        {/* Bookings */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-header">
            Boekingen ({bookings.length})
          </h3>
          <div className="flex flex-col gap-3">
            {bookings.length === 0 && (
              <p className="text-header/70">Nog geen boekingen.</p>
            )}
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-header">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                  </p>
                  <p className="text-sm text-header/70">
                    {b.user.name} ({b.user.email}) · {b.guests}{" "}
                    {b.guests > 1 ? "gasten" : "gast"} ·{" "}
                    <span
                      className={
                        b.status === "CONFIRMED"
                          ? "text-main"
                          : "text-red-600"
                      }
                    >
                      {b.status === "CONFIRMED" ? "Bevestigd" : "Geannuleerd"}
                    </span>
                  </p>
                  {b.notes && (
                    <p className="mt-1 text-sm text-header/60 italic">
                      “{b.notes}”
                    </p>
                  )}
                </div>
                {b.status === "CONFIRMED" && (
                  <form action={cancelBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-header/20 px-4 py-2 text-sm font-medium text-header transition-colors hover:border-red-400 hover:text-red-600"
                    >
                      Annuleren
                    </button>
                  </form>
                )}
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
                    className="rounded-md border border-header/20 px-4 py-2 text-sm font-medium text-header transition-colors hover:border-red-400 hover:text-red-600"
                  >
                    Deblokkeren
                  </button>
                </form>
              </div>
            ))}
          </div>

          <BlockDatesForm />
        </section>
      </div>
    </div>
  );
}
