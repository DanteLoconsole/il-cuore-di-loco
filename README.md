# Il Cuore di Loco

Website for **Il Cuore di Loco**, a B&B in Locorotondo (Puglia, Italy). Built with
[Next.js](https://nextjs.org) (App Router), [Prisma](https://www.prisma.io) + Postgres,
[Auth.js](https://authjs.dev), and [next-intl](https://next-intl.dev). Available in
**Dutch, English, and Italian** (`/nl`, `/en`, `/it`).

## Features

- Marketing pages: home, activities, story, gallery, contact — trilingual (nl/en/it).
- **Info** (`/info`) — property details (bedrooms, linens, layout, breakfast, cleaning
  schedule, key handover, check-in/out times).
- **Booking requests** (`/booking`): visitors pick dates and submit a request (name, email,
  phone, guests — capped at 3, message) — no account needed. The calendar shows the price
  under each night and a live summary (nights subtotal, cleaning fee, tourist tax, total).
- **Per-night pricing**, fully owner-configurable from `/admin`: a base nightly rate, a
  weekend surcharge (Fri/Sat nights), owner-defined surcharge periods (e.g. high season) that
  stack multiplicatively, one-off per-day price overrides, and a per-person/per-night tourist
  tax — see [`lib/pricingEngine.ts`](lib/pricingEngine.ts) for the exact rules.
- **Booking request emails** via [Resend](https://resend.com): the guest gets a confirmation
  and the owner gets a notification, both with a price summary, in the locale the request was
  submitted in. See [`lib/email.ts`](lib/email.ts).
- **Admin dashboard** (`/admin`, owner-only login): accept/decline booking requests, cancel
  confirmed bookings, block/unblock date ranges, manage pricing (above), and send a newsletter
  blast (opens your mail app with all subscribers in BCC).
- **Newsletter sign-up** on the homepage, stored in the database.

## Tech stack

| Layer      | Choice                                                    |
| ---------- | ---------------------------------------------------------- |
| Framework  | Next.js 15 (App Router), React 19, TypeScript              |
| Styling    | Tailwind CSS v4                                             |
| Database   | PostgreSQL via [Prisma](https://www.prisma.io) (Neon / Vercel Postgres) |
| Auth       | [Auth.js](https://authjs.dev) v5 — credentials + JWT, owner-only |
| i18n       | [next-intl](https://next-intl.dev) — `nl` (default), `en`, `it` |
| Forms      | Server Actions + [Zod](https://zod.dev) validation          |

## Prerequisites

- **Node.js 24** — the version is pinned in [`.nvmrc`](.nvmrc). With [nvm](https://github.com/nvm-sh/nvm) installed, run `nvm use` in the project root.
- A **PostgreSQL** database. In production this project uses [Neon](https://neon.tech) provisioned through Vercel's Storage integration, but any Postgres instance works.

## Getting started

```bash
nvm use              # switch to the pinned Node version
npm install           # installs deps and runs `prisma generate` automatically
cp .env.example .env  # then fill in the values (see below)
npm run db:migrate    # create tables in your database
npm run db:seed       # create the owner (admin) account
npm run dev           # start the dev server → http://localhost:3000
```

Visiting `http://localhost:3000` redirects to your browser's preferred language
(`/nl`, `/en`, or `/it`), falling back to Dutch.

## Environment variables

Copy [`.env.example`](.env.example) to `.env` and fill in:

| Variable | Purpose |
| --- | --- |
| `POSTGRES_PRISMA_URL` | Pooled connection string, used at runtime. |
| `POSTGRES_URL_NON_POOLING` | Direct connection string, used for migrations. |
| `AUTH_SECRET` | Signs auth sessions. Generate with `npx auth secret`. |
| `OWNER_EMAIL`, `OWNER_PASSWORD`, `OWNER_NAME` | Credentials for the admin account created by `npm run db:seed`. `OWNER_EMAIL` also receives new-booking-request notification emails. |
| `RESEND_API_KEY` | Sends the booking request emails (guest confirmation + owner notification). Optional — if unset, booking requests still work and email sending is just skipped (logged as an error). |
| `RESEND_FROM_EMAIL` | The "from" address for those emails, e.g. `no-reply@ilcuorediloco.it`. Requires verifying that domain in Resend. |

If your Postgres provider names its connection strings differently (e.g. Neon's own
integration may produce `DATABASE_URL` / `DATABASE_URL_UNPOOLED`), either rename them to
match the table above or update the `datasource` block in
[`prisma/schema.prisma`](prisma/schema.prisma).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload. |
| `npm run build` | Generate the Prisma client and build for production. |
| `npm run start` | Run the production build (after `npm run build`). |
| `npm run lint` | Run ESLint. |
| `npm run db:migrate` | Create/apply a migration in development (`prisma migrate dev`). |
| `npm run db:deploy` | Apply pending migrations in production (`prisma migrate deploy`). |
| `npm run db:seed` | Upsert the owner/admin account from `OWNER_*` env vars. |

## Project structure

```
app/
  [locale]/          # all routed pages, prefixed by locale (nl/en/it)
    page.tsx          # home
    activities/       # "what to do" cards
    story/            # our story timeline
    gallery/          # photo gallery
    contact/          # contact info + map
    info/             # property details (rooms, breakfast, cleaning, key handover, …)
    booking/          # booking calendar + request form
    login/            # admin login
    admin/            # owner-only dashboard (protected by admin/layout.tsx)
  actions/            # server actions (booking, admin, pricing, newsletter)
  api/auth/           # Auth.js route handler
  layout.tsx          # root <html>/<body>, locale comes from next-intl
messages/             # nl.json / en.json / it.json — all translated UI strings + copy
i18n/                 # next-intl routing, navigation, and request config
lib/
  prisma.ts           # Prisma client singleton
  availability.ts     # booking overlap / availability logic
  pricingEngine.ts    # pure pricing math — no Prisma import, safe for client components
  pricing.ts          # server-only Prisma reads for pricing (mirrors availability.ts)
  email.ts            # Resend booking-request emails (guest confirmation + owner notice)
  content.ts          # non-translated content (image paths)
components/           # shared UI (header, footer, forms, etc.)
prisma/
  schema.prisma       # data model
  migrations/          # SQL migration history
  seed.ts             # creates the owner account
types/                # ambient type augmentations (e.g. next-auth.d.ts)
middleware.ts         # next-intl locale detection & routing
auth.ts               # Auth.js configuration (credentials provider)
```

## Data model

Defined in [`prisma/schema.prisma`](prisma/schema.prisma):

- **User** — admin/owner accounts only (guests don't need an account to book).
- **Booking** — a guest's request (`PENDING` → `CONFIRMED` or `CANCELLED` by the owner).
- **BlockedRange** — dates the owner blocks manually (maintenance, personal use, etc.).
- **NewsletterSubscriber** — homepage newsletter sign-ups.
- **PricingSettings** — singleton row: base nightly price, weekend surcharge %, cleaning fee,
  tourist tax per person/night.
- **SurchargePeriod** — owner-defined date ranges with a surcharge % (e.g. high season).
- **PriceOverride** — an exact price for one specific date, overriding the computed price.

After changing `schema.prisma`, run `npm run db:migrate` to create a migration and apply it
locally.

## Internationalization

Adding or editing copy? Every translated string lives in `messages/{locale}.json`, namespaced
by page/feature (e.g. `booking.*`, `admin.*`). Add a key to all three files
(`nl.json`, `en.json`, `it.json`) and read it in a component with `useTranslations()` (client)
or `getTranslations()` (server) from `next-intl`.

## Deployment

The project is set up for [Vercel](https://vercel.com):

1. Provision a Postgres database (e.g. via Vercel's Storage tab → Neon integration) and connect
   it to the project — this sets the `POSTGRES_*` env vars automatically.
2. Add `AUTH_SECRET` and the `OWNER_*` variables in Vercel's Environment Variables settings.
3. Run `npm run db:migrate` once against the production database (or `db:deploy` in CI) and
   `npm run db:seed` to create the owner account.
4. Optional: add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to enable booking request emails —
   see the [Environment variables](#environment-variables) section above.
5. Push to your connected branch — Vercel builds with `npm run build`, which runs
   `prisma generate` before `next build`.
