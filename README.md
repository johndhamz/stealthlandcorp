# Stealth Land Corp — website

Next.js 16 rebuild of [stealthlandcorp.com](https://stealthlandcorp.com). App Router, TypeScript, Tailwind CSS v4, Cache Components enabled.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | What |
| --- | --- |
| `src/data/properties.ts` | All property listings, sectors and regions. Add a property here and it gets a page, card, sitemap entry and footer link automatically. |
| `src/data/content.ts` | Page copy (home, about, agents, partner, legal). |
| `src/data/site.ts` | Contact details, social links, navigation, form dropdown options. |
| `src/lib/mortgage.ts` | Mortgage calculator constants (price per sqm, base fees, finish add-ons, USD rate). |
| `src/app/api/inquiry/route.ts` | Receives form submissions and forwards them to the backend. |
| `next.config.ts` | Redirects from every old URL to the new structure. |
| `public/images` | Property photography and renders. |

## Inquiries

All forms (home, contact, property pages, agents, partner) POST to `/api/inquiry`, which validates and forwards to the backend endpoint. Configure in `.env.local`:

```
INQUIRY_API_URL=https://stlc-backend.onrender.com/api/v1/inquiry/property
INQUIRY_API_KEY=            # optional bearer token
```

The forwarded JSON payload: `first_name, last_name, phone_number, email, country, place, project_interest, where_did_find_about_us, message, agree_newsletter, agree_terms, source`.

## Adding a property

1. Drop images in `public/images/properties/<name>/`.
2. Add an entry to the `properties` array in `src/data/properties.ts` (slug, sector, region, status, images, copy, amenities, optional `unitTypes`, `videoIds` and `mortgageCalculator`).
3. Run `npm run build`. The detail page is statically generated.

## Deploy

Works on Vercel out of the box. For other hosts run `npm run build` then `npm start`, or add `output: "standalone"` to `next.config.ts`.
