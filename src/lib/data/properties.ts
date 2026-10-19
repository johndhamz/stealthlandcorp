import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { properties as seedProperties, type Property } from "@/data/properties";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";
import { rowToProperty, type PropertyRow } from "./mappers";

export const PROPERTIES_TAG = "properties";

/** Published properties for the public site. Falls back to the seed data when Supabase is not configured. */
export async function getPublishedProperties(): Promise<Property[]> {
  "use cache";
  cacheTag(PROPERTIES_TAG);
  cacheLife("hours");
  if (!isSupabaseConfigured()) return seedProperties;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("getPublishedProperties", error.message);
    return seedProperties;
  }
  return (data as PropertyRow[]).map(rowToProperty);
}

export async function getPublishedProperty(slug: string): Promise<Property | undefined> {
  const all = await getPublishedProperties();
  return all.find((p) => p.slug === slug);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const all = await getPublishedProperties();
  return all.filter((p) => p.featured);
}
