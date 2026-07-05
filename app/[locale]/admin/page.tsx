import { addDays } from "date-fns";
import { getTranslations, getFormatter } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/availability";
import { getPricingData } from "@/lib/pricing";
import { acceptBooking, cancelBooking, unblockDates } from "@/app/actions/admin";
import { removeSurchargePeriod, removePriceOverride } from "@/app/actions/pricing";
import SectionHeading from "@/components/sectionHeading";
import BlockDatesForm from "@/components/blockDatesForm";
import PricingSettingsForm from "@/components/pricingSettingsForm";
import SurchargePeriodForm from "@/components/surchargePeriodForm";
import PriceOverrideForm from "@/components/priceOverrideForm";

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

function GuestDetails({
  b,
  guestsLabel,
}: {
  b: BookingRow;
  guestsLabel: string;
}) {
  return (
    <div>
      <p className="font-semibold text-header">
        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
      </p>
      <p className="text-sm text-header/70">
        {b.guestName} · {guestsLabel}
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
  const t = await getTranslations("admin");
  const format = await getFormatter();
  const money = (value: number) =>
    format.number(value, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const [bookings, blocks, subscribers, pricing, surchargePeriods, priceOverrides] =
    await Promise.all([
      prisma.booking.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.blockedRange.findMany({ orderBy: { startDate: "asc" } }),
      prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
      getPricingData(),
      prisma.surchargePeriod.findMany({ orderBy: { startDate: "asc" } }),
      prisma.priceOverride.findMany({ orderBy: { date: "asc" } }),
    ]);

  // "Send newsletter" opens the mail app with every subscriber in BCC and no
  // visible To. The From address is whatever account the mail app sends as; a
  // mailto: link cannot set that.
  const bcc = subscribers.map((s) => s.email).join(",");
  const subject = encodeURIComponent(t("newsletterSubject"));
  const newsletterMailto = `mailto:?bcc=${bcc}&subject=${subject}`;

  const pending = bookings.filter((b) => b.status === "PENDING");
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");
  const guestsLabel = (n: number) => t("guestsCount", { count: n });

  return (
    <div className="w-full bg-accent px-6 py-16">
      <SectionHeading className="mb-10">{t("heading")}</SectionHeading>

      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        {conflict && (
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {t("conflict")}
          </p>
        )}

        {/* Pending requests */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-header">
            {t("requests", { count: pending.length })}
          </h3>
          <div className="flex flex-col gap-3">
            {pending.length === 0 && (
              <p className="text-header/70">{t("noRequests")}</p>
            )}
            {pending.map((b) => (
              <div key={b.id} className={cardClass}>
                <GuestDetails b={b} guestsLabel={guestsLabel(b.guests)} />
                <div className="flex gap-2">
                  <form action={acceptBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <button
                      type="submit"
                      className={`${btnClass} border-main bg-main text-white hover:bg-main-hover`}
                    >
                      {t("accept")}
                    </button>
                  </form>
                  <form action={cancelBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <button
                      type="submit"
                      className={`${btnClass} hover:border-red-400 hover:text-red-600`}
                    >
                      {t("decline")}
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
            {t("confirmed", { count: confirmed.length })}
          </h3>
          <div className="flex flex-col gap-3">
            {confirmed.length === 0 && (
              <p className="text-header/70">{t("noConfirmed")}</p>
            )}
            {confirmed.map((b) => (
              <div key={b.id} className={cardClass}>
                <GuestDetails b={b} guestsLabel={guestsLabel(b.guests)} />
                <form action={cancelBooking}>
                  <input type="hidden" name="id" value={b.id} />
                  <button
                    type="submit"
                    className={`${btnClass} hover:border-red-400 hover:text-red-600`}
                  >
                    {t("cancel")}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>

        {/* Blocked dates */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-header">
            {t("blockedDates")}
          </h3>
          <div className="mb-6 flex flex-col gap-3">
            {blocks.length === 0 && (
              <p className="text-header/70">{t("noBlocked")}</p>
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
                    {t("unblock")}
                  </button>
                </form>
              </div>
            ))}
          </div>
          <BlockDatesForm />
        </section>

        {/* Pricing */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-header">
            {t("pricing.heading")}
          </h3>
          <div className="flex flex-col gap-6">
            <PricingSettingsForm config={pricing.config} />

            <div>
              <h4 className="mb-3 text-sm font-semibold text-header/70">
                {t("pricing.surchargePeriods")}
              </h4>
              <div className="mb-4 flex flex-col gap-3">
                {surchargePeriods.length === 0 && (
                  <p className="text-header/70">{t("pricing.noSurchargePeriods")}</p>
                )}
                {surchargePeriods.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)]"
                  >
                    <p className="text-header">
                      <span className="font-semibold">
                        {formatDate(s.startDate)} → {formatDate(addDays(s.endDate, -1))}
                      </span>{" "}
                      <span className="text-main">+{s.percent}%</span>
                      {s.label && <span className="text-header/60"> · {s.label}</span>}
                    </p>
                    <form action={removeSurchargePeriod}>
                      <input type="hidden" name="id" value={s.id} />
                      <button
                        type="submit"
                        className={`${btnClass} hover:border-red-400 hover:text-red-600`}
                      >
                        {t("pricing.remove")}
                      </button>
                    </form>
                  </div>
                ))}
              </div>
              <SurchargePeriodForm />
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-header/70">
                {t("pricing.priceOverrides")}
              </h4>
              <div className="mb-4 flex flex-col gap-3">
                {priceOverrides.length === 0 && (
                  <p className="text-header/70">{t("pricing.noPriceOverrides")}</p>
                )}
                {priceOverrides.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)]"
                  >
                    <p className="text-header">
                      <span className="font-semibold">{formatDate(o.date)}</span>{" "}
                      <span className="text-main">{money(o.price)}</span>
                    </p>
                    <form action={removePriceOverride}>
                      <input type="hidden" name="id" value={o.id} />
                      <button
                        type="submit"
                        className={`${btnClass} hover:border-red-400 hover:text-red-600`}
                      >
                        {t("pricing.remove")}
                      </button>
                    </form>
                  </div>
                ))}
              </div>
              <PriceOverrideForm />
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-header">
            {t("newsletterHeading", { count: subscribers.length })}
          </h3>
          {subscribers.length === 0 ? (
            <p className="text-header/70">{t("noSubscribers")}</p>
          ) : (
            <a
              href={newsletterMailto}
              target="_blank"
              rel="noreferrer"
              className="inline-flex px-5 font-medium !text-header/70 hover:!text-header"
            >
              {t("sendNewsletter")}
            </a>
          )}
        </section>

        {/* Declined / cancelled (compact) */}
        {cancelled.length > 0 && (
          <section>
            <h3 className="mb-4 text-lg font-bold text-header/60">
              {t("cancelledHeading", { count: cancelled.length })}
            </h3>
            <div className="flex flex-col gap-2">
              {cancelled.map((b) => (
                <p key={b.id} className="text-sm text-header/50">
                  {formatDate(b.checkIn)} → {formatDate(b.checkOut)} ·{" "}
                  {b.guestName}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
