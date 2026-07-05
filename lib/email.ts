import { Resend } from "resend";
import { getTranslations, getFormatter } from "next-intl/server";
import { formatDate } from "@/lib/availability";
import {
  computeStayTotal,
  toLocalMidnight,
  type PricingConfig,
  type SurchargePeriodData,
  type PriceOverrideData,
} from "@/lib/pricingEngine";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "no-reply@ilcuorediloco.it";

type BookingRequestEmailData = {
  locale: string;
  guestName: string;
  email: string;
  phone: string;
  guests: number;
  message?: string | null;
  checkIn: Date; // UTC-midnight, as produced by toUTCDate()
  checkOut: Date; // UTC-midnight
  pricing: {
    config: PricingConfig;
    surcharges: SurchargePeriodData[];
    overrides: PriceOverrideData[];
  };
};

type Row = { label: string; value: string; bold?: boolean };

function wrapHtml(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f6;font-family:Arial,Helvetica,sans-serif;color:#333333;">
    <div style="max-width:480px;margin:0 auto;padding:32px 24px;">
      <h1 style="color:#389f98;font-size:20px;margin:0 0 24px;">Il Cuore di Loco</h1>
      ${bodyHtml}
    </div>
  </body>
</html>`;
}

function table(rows: Row[]): string {
  const cells = rows
    .map(
      (r) => `<tr>
      <td style="padding:6px 0;color:${r.bold ? "#333333" : "#333333b0"};${r.bold ? "font-weight:bold;" : ""}">${r.label}</td>
      <td style="padding:6px 0;text-align:right;${r.bold ? "font-weight:bold;" : ""}">${r.value}</td>
    </tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0;">${cells}</table>`;
}

/**
 * Sends the guest confirmation + owner notification emails for a new booking
 * request. Never throws — a delivery failure (missing API key, unverified
 * domain, network hiccup, …) is logged but must never break the booking
 * request itself, which has already been saved to the database by this point.
 */
export async function sendBookingRequestEmails(
  data: BookingRequestEmailData
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set — skipping booking request emails.");
    return;
  }

  try {
    // Constructed lazily (only once we know the key exists) — the Resend
    // constructor throws synchronously on a missing key, and doing that at
    // module scope would crash on import before the guard above ever runs.
    const resend = new Resend(process.env.RESEND_API_KEY);

    const [t, tBooking, format] = await Promise.all([
      getTranslations({ locale: data.locale, namespace: "email" }),
      getTranslations({ locale: data.locale, namespace: "booking" }),
      getFormatter({ locale: data.locale }),
    ]);

    const money = (value: number) =>
      format.number(value, {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

    // Local-midnight equivalents so computeStayTotal's local-getter date math
    // (designed for react-day-picker's local-midnight cells) stays correct
    // here too, regardless of the server process's timezone.
    const checkInLocal = toLocalMidnight(data.checkIn);
    const checkOutLocal = toLocalMidnight(data.checkOut);
    const stay = computeStayTotal(
      checkInLocal,
      checkOutLocal,
      data.guests,
      data.pricing.config,
      data.pricing.surcharges,
      data.pricing.overrides
    );

    const dateRange = `${formatDate(data.checkIn)} → ${formatDate(data.checkOut)}`;
    const priceRows: Row[] = [
      { label: tBooking("nightsCount", { count: stay.nights.length }), value: money(stay.subtotal) },
      { label: tBooking("cleaningFeeLabel"), value: money(stay.cleaningFee) },
      { label: tBooking("touristTaxLabel"), value: money(stay.touristTax) },
      { label: tBooking("totalLabel"), value: money(stay.total), bold: true },
    ];
    const detailRows: Row[] = [
      { label: t("datesLabel"), value: dateRange },
      { label: tBooking("guests"), value: String(data.guests) },
      ...(data.message ? [{ label: t("messageLabel"), value: data.message }] : []),
    ];

    const guestHtml = wrapHtml(`
      <p>${t("guestGreeting", { name: data.guestName })}</p>
      <p>${t("guestIntro")}</p>
      <h2 style="font-size:16px;color:#333333;">${t("summaryHeading")}</h2>
      ${table(detailRows)}
      ${table(priceRows)}
      <p>${t("guestOutro")}</p>
      <p style="white-space:pre-line;color:#333333b0;">${t("signature")}</p>
    `);

    const ownerHtml = wrapHtml(`
      <p>${t("ownerIntro")}</p>
      <h2 style="font-size:16px;color:#333333;">${t("summaryHeading")}</h2>
      ${table([
        { label: t("nameLabel"), value: data.guestName },
        { label: t("emailLabel"), value: data.email },
        { label: t("phoneLabel"), value: data.phone },
        ...detailRows,
      ])}
      ${table(priceRows)}
    `);

    const ownerEmail = process.env.OWNER_EMAIL;

    // resend.emails.send() resolves with { data, error } — it does not throw
    // on delivery failures (invalid key, unverified domain, rate limit, …) —
    // so those must be checked explicitly, or they'd fail silently.
    const [guestResult, ownerResult] = await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: data.email,
        subject: t("guestSubject"),
        html: guestHtml,
      }),
      ownerEmail
        ? resend.emails.send({
            from: FROM_EMAIL,
            to: ownerEmail,
            subject: t("ownerSubject", { name: data.guestName }),
            html: ownerHtml,
          })
        : null,
    ]);

    if (guestResult?.error) {
      console.error("Failed to send guest confirmation email:", guestResult.error);
    }
    if (ownerResult?.error) {
      console.error("Failed to send owner notification email:", ownerResult.error);
    }
  } catch (err) {
    console.error("Failed to send booking request emails:", err);
  }
}
