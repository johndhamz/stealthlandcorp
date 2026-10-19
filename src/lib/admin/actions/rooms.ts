"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { ROOMS_TAG } from "@/lib/data/rooms";
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

export async function saveRoom(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const propertyId = String(formData.get("property_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!propertyId) return { error: "Choose the hotel this room belongs to." };
  if (!name) return { error: "Room name is required." };
  const rate = Number(formData.get("nightly_rate"));
  const maxGuests = Number(formData.get("max_guests"));
  if (!Number.isFinite(rate) || rate < 0) return { error: "Enter a valid nightly rate." };
  if (!Number.isInteger(maxGuests) || maxGuests < 1) return { error: "Max guests must be at least 1." };
  const size = String(formData.get("size_sqm") ?? "").trim();
  const row = {
    property_id: propertyId,
    slug: slugify(String(formData.get("slug") ?? "") || name),
    name,
    description: String(formData.get("description") ?? "").trim(),
    images: parseImages(formData.get("images")),
    max_guests: maxGuests,
    beds: String(formData.get("beds") ?? "").trim(),
    size_sqm: size ? Number(size) : null,
    nightly_rate: rate,
    quantity: Math.max(0, Number(formData.get("quantity") ?? 1) || 0),
    amenities: lines(formData.get("amenities")),
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
  const supabase = await createSessionClient();
  const { error } = await (id ? supabase.from("room_types").update(row).eq("id", id) : supabase.from("room_types").insert(row));
  if (error) {
    if (error.code === "23505") return { error: `A room with the slug "${row.slug}" already exists for this hotel.` };
    return { error: error.message };
  }
  updateTag(ROOMS_TAG);
  redirect("/admin/rooms?saved=1");
}

export async function deleteRoom(id: string) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { error } = await supabase.from("room_types").delete().eq("id", id);
  if (error) return { error: error.message };
  updateTag(ROOMS_TAG);
  redirect("/admin/rooms?deleted=1");
}
