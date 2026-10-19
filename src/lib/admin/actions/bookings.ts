"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { BOOKING_STATUSES } from "@/lib/bookings";
import type { ActionState } from "./auth";

export async function updateBooking(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !(BOOKING_STATUSES as readonly string[]).includes(status)) return { error: "Invalid request." };
  const total = Number(formData.get("total"));
  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status, notes: String(formData.get("notes") ?? "").slice(0, 5000), ...(Number.isFinite(total) && total >= 0 ? { total } : {}) })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: "Booking updated." };
}

export async function deleteBooking(id: string) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return { error: error.message };
  redirect("/admin/bookings?deleted=1");
}
