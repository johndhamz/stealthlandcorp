/**
 * Seeds a Supabase project with the properties and content that ship in src/data.
 * Usage: npm run seed  (reads .env.local)
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { properties } from "../src/data/properties";
import { about, agentsPage, home, partnerPage, portfolioIntro } from "../src/data/content";
import { propertyToRow } from "../src/lib/data/mappers";
import { seedRooms } from "../src/data/rooms";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const rows = properties.map((p, i) => propertyToRow(p, { published: true, sortOrder: i }));
  const { error: pErr } = await supabase.from("properties").upsert(rows, { onConflict: "slug" });
  if (pErr) throw pErr;
  console.log(`Seeded ${rows.length} properties`);

  const { data: propRows } = await supabase.from("properties").select("id, slug");
  const idBySlug = new Map((propRows ?? []).map((r) => [r.slug, r.id]));
  const roomRows = seedRooms
    .filter((r) => idBySlug.has(r.propertySlug))
    .map((r, i) => ({
      property_id: idBySlug.get(r.propertySlug)!,
      slug: r.slug,
      name: r.name,
      description: r.description,
      images: r.images,
      max_guests: r.maxGuests,
      beds: r.beds,
      size_sqm: r.sizeSqm,
      nightly_rate: r.nightlyRate,
      quantity: r.quantity,
      amenities: r.amenities,
      published: true,
      sort_order: i,
    }));
  if (roomRows.length) {
    const { error: rErr } = await supabase.from("room_types").upsert(roomRows, { onConflict: "property_id,slug", ignoreDuplicates: true });
    if (rErr) throw rErr;
    console.log(`Seeded ${roomRows.length} room types (existing rooms kept)`);
  }

  const content = [
    { key: "home", data: home },
    { key: "about", data: about },
    { key: "agents", data: agentsPage },
    { key: "partner", data: partnerPage },
    { key: "portfolio", data: { intro: portfolioIntro } },
  ];
  const { error: cErr } = await supabase.from("site_content").upsert(content, { onConflict: "key", ignoreDuplicates: true });
  if (cErr) throw cErr;
  console.log(`Seeded ${content.length} content entries (existing entries kept)`);

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const { data: existing } = await supabase.from("profiles").select("id").eq("email", adminEmail).maybeSingle();
    if (existing) {
      console.log(`Admin ${adminEmail} already exists`);
    } else {
      const { error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { role: "admin", full_name: "Administrator" },
      });
      if (error) throw error;
      console.log(`Created admin user ${adminEmail}`);
    }
  } else {
    console.log("Skipping admin user (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one)");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
