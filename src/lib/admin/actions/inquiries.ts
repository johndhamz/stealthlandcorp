"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import type { ActionState } from "./auth";

const STATUSES = ["new", "contacted", "qualified", "closed"];

export async function updateInquiry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  if (!id || !STATUSES.includes(status)) return { error: "Invalid request." };
  const assigned = String(formData.get("assigned_to") ?? "");
  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status, notes: String(formData.get("notes") ?? "").slice(0, 5000), assigned_to: assigned || null })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: "Inquiry updated." };
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) return { error: error.message };
  redirect("/admin/inquiries?deleted=1");
}
