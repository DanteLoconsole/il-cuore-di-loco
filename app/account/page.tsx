import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/availability";
import { cancelMyBooking } from "@/app/actions/booking";
import SectionHeading from "@/components/sectionHeading";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  const bookings = await prisma.booking.findMany({
    where: { userId: session!.user.id },
    orderBy: { checkIn: "asc" },
  });

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="w-full bg-accent px-6 py-16">
      <SectionHeading className="mb-3">Mijn boekingen</SectionHeading>
      <p className="mb-10 text-center text-header/70">
        Welkom terug, {session!.user.name}.
      </p>

      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {bookings.length === 0 && (
          <p className="text-center text-header/70">
            Je hebt nog geen boekingen.
          </p>
        )}

        {bookings.map((b) => {
          const upcoming = b.checkIn.toISOString().slice(0, 10) >= todayIso;
          const cancellable = b.status === "CONFIRMED" && upcoming;
          return (
            <div
              key={b.id}
              className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-header">
                  {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                </p>
                <p className="text-sm text-header/70">
                  {b.guests} {b.guests > 1 ? "gasten" : "gast"} ·{" "}
                  <span
                    className={
                      b.status === "CONFIRMED" ? "text-main" : "text-red-600"
                    }
                  >
                    {b.status === "CONFIRMED" ? "Bevestigd" : "Geannuleerd"}
                  </span>
                </p>
              </div>

              {cancellable && (
                <form action={cancelMyBooking}>
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
          );
        })}
      </div>
    </div>
  );
}
