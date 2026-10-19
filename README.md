# Stealth Land Corp — website and admin

Next.js 16 rebuild of [stealthlandcorp.com](https://stealthlandcorp.com) with a Supabase-backed admin dashboard. App Router, TypeScript, Tailwind CSS v4, Cache Components enabled.

- Public site: `/`
- Admin dashboard: `/admin` (properties, inquiries, site content, agents, users)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Supabase setup (admin dashboard)

The public site works without Supabase: it falls back to the seed data in `src/data`. The admin dashboard, inquiries inbox and editable content need a Supabase project.

### Hosted project (production)

1. Create a project at supabase.com and copy the URL, anon key and service role key from Project Settings → API into `.env.local` (see `.env.example`).
2. Apply the schema: `npx supabase link --project-ref <ref>` then `npm run db:push`. Or paste `supabase/migrations/*.sql` into the SQL editor.
3. Seed the properties, content and first admin login:
   ```bash
   SEED_ADMIN_EMAIL=you@stealthlandcorp.com SEED_ADMIN_PASSWORD='choose-a-strong-one' npm run seed
   ```
4. Add the same three Supabase variables to your host (Vercel → Environment Variables). Only `NEXT_PUBLIC_*` keys reach the browser.
5. Sign in at `/admin/login`.

### Local development (Docker)

```bash
npm run db:start     # starts Postgres, Auth, Storage and Studio in Docker
npx supabase status  # prints the local URL and keys for .env.local
npm run seed
npm run dev
```

Studio runs on the port shown by `supabase status`. `npm run db:reset` re-applies migrations and wipes local data.

### How the pieces connect

- `properties`, `site_content`, `inquiries`, `agents`, `profiles` tables with row-level security. Anyone can read published properties and site content; everything else needs an admin session.
- The first user to sign up becomes an admin automatically. Later users default to the agent role unless created from the Users page.
- Property images upload to the public `property-images` storage bucket from the browser (admin session required).
- Public pages read through `src/lib/data/*` with `"use cache"`. Admin saves call `updateTag`, so edits appear on the site immediately.
- Legacy URL redirects still come from `src/data/properties.ts` at build time; redirects added in the admin apply on the next deploy.

## Hotel booking (request to book)

Properties in the Hotel & Leisure sector can accept booking requests. Tick "Accept booking requests" on the property in the admin, then add room types under **Rooms** (name, nightly rate, max guests, inventory, photos). The property page then shows the room cards and a booking form.

A request records the room, dates, guest count and contact details with an indicative total, and appears under **Bookings** in the admin with a reference like `NPR-AB12CD`. Your team confirms availability and payment with the guest by email and updates the status (requested, confirmed, declined, cancelled, completed).

### Island hopping & activities

Tours live under **Activities** in the admin (name, section used to group tours on the page, price per person or flat per boat, min/max guests, duration, schedule, inclusions, photos). Published tours appear on the resort page below the rooms. Guests can either tick tours as add-ons on the room booking form (each with a head count and a date inside the stay) or use the **Island hopping only** tab to request a day tour without a room. Both go into **Bookings**; tour-only requests are marked "Tour only" and the booking detail lists each tour with its subtotal. The seed script ships Roxas Tours A, B and C plus El Nido Tours A to D for Napuro Resort and Spa with proxy rates and the photos in `public/images/activities/napuro`.

Emails are optional: with `RESEND_API_KEY` set, the team gets a notification and the guest gets an acknowledgement. Without it, requests are still saved. Online payment (PayMongo) and live availability are a planned second phase.

## Where things live

| Path | What |
| --- | --- |
| `src/data/properties.ts` | All property listings, sectors and regions. Add a property here and it gets a page, card, sitemap entry and footer link automatically. |
| `src/data/content.ts` | Page copy (home, about, agents, partner, legal). |
| `src/data/site.ts` | Contact details, social links, navigation, form dropdown options. |
| `src/lib/mortgage.ts` | Mortgage calculator constants (price per sqm, base fees, finish add-ons, USD rate). |
| `src/app/api/inquiry/route.ts` | Receives form submissions, stores them in Supabase and optionally forwards them to another backend. |
| `src/app/admin/**` | Admin dashboard pages. |
| `src/lib/admin/actions/*` | Server actions behind the admin forms (auth checked on every call). |
| `src/lib/data/*` | Cached readers the public site uses, with seed-data fallback. |
| `supabase/migrations` | Database schema, policies and storage bucket (includes room types, activities and bookings). |
| `src/components/booking/*` | Public room cards, tour cards, booking panel (stay form with add-ons, tour-only form). |
| `src/data/rooms.ts`, `src/data/activities.ts` | Placeholder rooms and tours used by the seed script and as fallback. |
| `scripts/seed.ts` | Imports the seed data and creates the first admin. |
| `next.config.ts` | Redirects from every old URL to the new structure. |
| `public/images` | Property photography and renders. |

## Inquiries

All forms (home, contact, property pages, agents, partner) POST to `/api/inquiry`. The route validates the submission, saves it to the `inquiries` table and, when `INQUIRY_FORWARD_URL` is set, also forwards the JSON to that endpoint (for example the previous Render backend). Inquiries appear under `/admin/inquiries` with status tracking, notes, assignment and CSV export.

## Adding a property

Use `/admin/properties/new`: upload images, fill in the copy, choose status and sector, and publish. The page, card, footer link and sitemap entry follow automatically.

Without Supabase, add an entry to `src/data/properties.ts` instead and rebuild.

## Deploy

Works on Vercel out of the box. For other hosts run `npm run build` then `npm start`, or add `output: "standalone"` to `next.config.ts`.
