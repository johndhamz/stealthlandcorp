import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { seedActivities } from "@/data/activities";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";
import { rowToActivity, type Activity, type ActivityRow } from "./mappers";

export const ACTIVITIES_TAG = "activities";

/** Published activities (island hopping, tours) for a property. Falls back to seed data when Supabase is not configured. */
export async function getActivities(propertySlug: string): Promise<Activity[]> {
  "use cache";
  cacheTag(ACTIVITIES_TAG);
  cacheLife("hours");
  if (!isSupabaseConfigured()) {
    return seedActivities
      .filter((a) => a.propertySlug === propertySlug)
      .map((a, i) => ({
        id: a.slug,
        propertyId: propertySlug,
        slug: a.slug,
        name: a.name,
        category: a.category,
        tagline: a.tagline,
        description: a.description,
        images: a.images,
        duration: a.duration,
        schedule: a.schedule,
        price: a.price,
        priceUnit: a.priceUnit,
        minPax: a.minPax,
        maxPax: a.maxPax,
        inclusions: a.inclusions,
        notes: a.notes,
        published: true,
        sortOrder: i,
      }));
  }
  const supabase = createPublicClient();
  const { data: prop } = await supabase.from("properties").select("id").eq("slug", propertySlug).maybeSingle();
  if (!prop) return [];
  const { data, error } = await supabase.from("activities").select("*").eq("property_id", prop.id).eq("published", true).order("sort_order").order("price");
  if (error) {
    console.error("getActivities", error.message);
    return [];
  }
  return (data as ActivityRow[]).map(rowToActivity);
}
