"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { CONTENT_TAG, defaultContent, type ContentKey } from "@/lib/data/content";
import { contentSchema } from "@/lib/admin/content-schema";
import type { ActionState } from "./auth";

const paragraphs = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\n\s*\n/)
    .map((s) => s.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

export async function saveContent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const key = String(formData.get("key") ?? "") as ContentKey;
  const schema = contentSchema[key];
  if (!schema) return { error: "Unknown content section." };

  const data: Record<string, unknown> = { ...(defaultContent[key] as object) };
  for (const field of schema.fields) {
    if (field.type === "text" || field.type === "textarea") {
      data[field.name] = String(formData.get(field.name) ?? "").trim();
    } else if (field.type === "paragraphs") {
      data[field.name] = paragraphs(formData.get(field.name));
    } else if (field.type === "items") {
      const count = Number(formData.get(`${field.name}__count`) ?? 0);
      const items: Record<string, string>[] = [];
      for (let i = 0; i < count; i++) {
        const item: Record<string, string> = {};
        let filled = false;
        for (const sub of field.itemFields) {
          const v = String(formData.get(`${field.name}.${i}.${sub.name}`) ?? "").trim();
          item[sub.name] = v;
          if (v) filled = true;
        }
        if (filled) items.push(item);
      }
      data[field.name] = items;
    }
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.from("site_content").upsert({ key, data }, { onConflict: "key" });
  if (error) return { error: error.message };
  updateTag(CONTENT_TAG);
  return { success: "Saved. The public site will show the changes immediately." };
}
