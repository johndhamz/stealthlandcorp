import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { seedRooms } from "@/data/rooms";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";
import { rowToRoomType, type RoomType, type RoomTypeRow } from "./mappers";

export const ROOMS_TAG = "rooms";

/** Published room types for a property. Falls back to the seed rooms when Supabase is not configured. */
export async function getRoomTypes(propertySlug: string): Promise<RoomType[]> {
  "use cache";
  cacheTag(ROOMS_TAG);
  cacheLife("hours");
  if (!isSupabaseConfigured()) {
    return seedRooms
      .filter((r) => r.propertySlug === propertySlug)
      .map((r, i) => ({
        id: r.slug,
        propertyId: propertySlug,
        slug: r.slug,
        name: r.name,
        description: r.description,
        images: r.images,
        maxGuests: r.maxGuests,
        beds: r.beds,
        sizeSqm: r.sizeSqm,
        nightlyRate: r.nightlyRate,
        quantity: r.quantity,
        amenities: r.amenities,
        published: true,
        sortOrder: i,
      }));
  }
  const supabase = createPublicClient();
  const { data: prop } = await supabase.from("properties").select("id").eq("slug", propertySlug).maybeSingle();
  if (!prop) return [];
  const { data, error } = await supabase.from("room_types").select("*").eq("property_id", prop.id).eq("published", true).order("sort_order").order("nightly_rate");
  if (error) {
    console.error("getRoomTypes", error.message);
    return [];
  }
  return (data as RoomTypeRow[]).map(rowToRoomType);
}

/** Lowest published nightly rate per bookable property slug, for cards. */
export async function getStartingRates(): Promise<Record<string, number>> {
  "use cache";
  cacheTag(ROOMS_TAG);
  cacheLife("hours");
  if (!isSupabaseConfigured()) {
    const out: Record<string, number> = {};
    for (const r of seedRooms) out[r.propertySlug] = Math.min(out[r.propertySlug] ?? Infinity, r.nightlyRate);
    return out;
  }
  const supabase = createPublicClient();
  const { data } = await supabase.from("room_types").select("nightly_rate, properties!inner(slug)").eq("published", true);
  const out: Record<string, number> = {};
  for (const row of (data ?? []) as unknown as { nightly_rate: number; properties: { slug: string } }[]) {
    const slug = row.properties?.slug;
    if (!slug) continue;
    out[slug] = Math.min(out[slug] ?? Infinity, Number(row.nightly_rate));
  }
  return out;
}
