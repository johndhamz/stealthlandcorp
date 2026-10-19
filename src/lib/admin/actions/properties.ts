"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { PROPERTIES_TAG } from "@/lib/data/properties";
import type { ActionState } from "./auth";

const SECTORS = ["residential", "hotel-leisure", "agriculture"];
const STATUSES = ["pre-selling", "ready-for-occupancy", "in-development", "completed"];

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const paragraphs = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\n\s*\n/)
    .map((s) => s.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function parseImages(v: FormDataEntryValue | null): string[] {
  try {
    const arr = JSON.parse(String(v ?? "[]"));
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string" && x) : [];
  } catch {
    return [];
  }
}

function parseUnitTypes(v: FormDataEntryValue | null) {
  return lines(v)
    .map((line) => {
      const [label, sqm] = line.split("|").map((s) => s.trim());
      return { label, sqm: Number(sqm) };
    })
    .filter((u) => u.label && Number.isFinite(u.sqm) && u.sqm > 0);
}

export async function saveProperty(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const sector = String(formData.get("sector") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!SECTORS.includes(sector)) return { error: "Choose a sector." };
  if (!STATUSES.includes(status)) return { error: "Choose a status." };

  const gallery = parseImages(formData.get("gallery"));
  const heroImages = parseImages(formData.get("hero_images"));
  const cardImage = String(formData.get("card_image") ?? "").trim() || gallery[0] || "";
  if (!cardImage) return { error: "Add at least one image." };

  const row = {
    slug,
    name,
    developer: String(formData.get("developer") ?? "Stealth Land Corp").trim() || "Stealth Land Corp",
    tagline: String(formData.get("tagline") ?? "").trim(),
    sector,
    region: String(formData.get("region") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    status,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    card_image: cardImage,
    hero_images: heroImages.length ? heroImages : gallery.slice(0, 4),
    gallery,
    summary: String(formData.get("summary") ?? "").trim(),
    description: paragraphs(formData.get("description")),
    highlight_title: String(formData.get("highlight_title") ?? "").trim(),
    highlights: paragraphs(formData.get("highlights")),
    amenities: lines(formData.get("amenities")),
    unit_types: parseUnitTypes(formData.get("unit_types")),
    video_ids: lines(formData.get("video_ids")).map((v) => v.replace(/^.*(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11}).*$/, "$1")),
    mortgage_calculator: formData.get("mortgage_calculator") === "on",
    legacy_paths: lines(formData.get("legacy_paths")),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };

  const supabase = await createSessionClient();
  const query = id ? supabase.from("properties").update(row).eq("id", id) : supabase.from("properties").insert(row);
  const { error } = await query;
  if (error) {
    if (error.code === "23505") return { error: `The slug "${slug}" is already used by another property.` };
    return { error: error.message };
  }
  updateTag(PROPERTIES_TAG);
  redirect("/admin/properties?saved=1");
}

export async function setPropertyPublished(id: string, published: boolean) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { error } = await supabase.from("properties").update({ published }).eq("id", id);
  if (error) return { error: error.message };
  updateTag(PROPERTIES_TAG);
  return { success: published ? "Published" : "Unpublished" };
}

export async function deleteProperty(id: string) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { error: error.message };
  updateTag(PROPERTIES_TAG);
  redirect("/admin/properties?deleted=1");
}
