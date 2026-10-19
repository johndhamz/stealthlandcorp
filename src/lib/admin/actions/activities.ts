"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { ACTIVITIES_TAG } from "@/lib/data/activities";
import type { ActionState } from "./auth";

const lines = (v: FormDataEntryValue | null) => String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function parseImages(v: FormDataEntryValue | null): string[] {
  try {
    const arr = JSON.parse(String(v ?? "[]"));
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string" && x) : [];
  } catch {
    return [];
  }
}

export async function saveActivity(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const propertyId = String(formData.get("property_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!propertyId) return { error: "Choose the resort this tour belongs to." };
  if (!name) return { error: "Tour name is required." };
  const price = Number(formData.get("price"));
  const minPax = Number(formData.get("min_pax"));
  const maxPax = Number(formData.get("max_pax"));
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price." };
  if (!Number.isInteger(minPax) || minPax < 1) return { error: "Minimum guests must be at least 1." };
  if (!Number.isInteger(maxPax) || maxPax < minPax) return { error: "Maximum guests must be at least the minimum." };
  const row = {
    property_id: propertyId,
    slug: slugify(String(formData.get("slug") ?? "") || name),
    name,
    category: String(formData.get("category") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    images: parseImages(formData.get("images")),
    duration: String(formData.get("duration") ?? "").trim(),
    schedule: String(formData.get("schedule") ?? "").trim(),
    price,
    price_unit: formData.get("price_unit") === "group" ? "group" : "person",
    min_pax: minPax,
    max_pax: maxPax,
    inclusions: lines(formData.get("inclusions")),
    notes: String(formData.get("notes") ?? "").trim(),
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
  const supabase = await createSessionClient();
  const { error } = await (id ? supabase.from("activities").update(row).eq("id", id) : supabase.from("activities").insert(row));
  if (error) {
    if (error.code === "23505") return { error: `A tour with the slug "${row.slug}" already exists for this resort.` };
    return { error: error.message };
  }
  updateTag(ACTIVITIES_TAG);
  redirect("/admin/activities?saved=1");
}

export async function deleteActivity(id: string) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) return { error: error.message };
  updateTag(ACTIVITIES_TAG);
  redirect("/admin/activities?deleted=1");
}
