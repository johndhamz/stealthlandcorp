"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import type { ActionState } from "./auth";

function admin() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const client = admin();
  if (!client) return { error: "SUPABASE_SERVICE_ROLE_KEY is required to manage users." };
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "agent") === "admin" ? "admin" : "agent";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  const { error } = await client.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { role, full_name: fullName } });
  if (error) return { error: error.message };
  return { success: `User ${email} created as ${role}.` };
}

export async function updateUserRole(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const client = admin();
  if (!client) return { error: "SUPABASE_SERVICE_ROLE_KEY is required to manage users." };
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") === "admin" ? "admin" : "agent";
  if (id === me.id && role !== "admin") return { error: "You cannot remove your own admin role." };
  const { error } = await client.from("profiles").update({ role }).eq("id", id);
  if (error) return { error: error.message };
  return { success: "Role updated." };
}

export async function resetUserPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const client = admin();
  if (!client) return { error: "SUPABASE_SERVICE_ROLE_KEY is required to manage users." };
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  const { error } = await client.auth.admin.updateUserById(id, { password });
  if (error) return { error: error.message };
  return { success: "Password updated." };
}

export async function deleteUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const client = admin();
  if (!client) return { error: "SUPABASE_SERVICE_ROLE_KEY is required to manage users." };
  const id = String(formData.get("id") ?? "");
  if (id === me.id) return { error: "You cannot delete your own account." };
  const { error } = await client.auth.admin.deleteUser(id);
  if (error) return { error: error.message };
  return { success: "User deleted." };
}
