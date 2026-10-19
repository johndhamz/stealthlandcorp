"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient, createSessionClient } from "@/lib/supabase/server";
import type { ActionState } from "./auth";

const STATUSES = ["pending", "accredited", "inactive"];

export async function saveAgent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const status = String(formData.get("status") ?? "pending");
  if (!name || !email) return { error: "Name and email are required." };
  if (!STATUSES.includes(status)) return { error: "Choose a status." };
  const row = {
    name,
    email,
    phone: String(formData.get("phone") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    territory: String(formData.get("territory") ?? "").trim(),
    status,
    notes: String(formData.get("notes") ?? "").slice(0, 5000),
  };
  const supabase = await createSessionClient();
  const { error } = await (id ? supabase.from("agents").update(row).eq("id", id) : supabase.from("agents").insert(row));
  if (error) return { error: error.message };
  redirect("/admin/agents?saved=1");
}

export async function deleteAgent(id: string) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) return { error: error.message };
  redirect("/admin/agents?deleted=1");
}

/** Creates a login for an agent (role: agent) and links it to the agent record. */
export async function createAgentLogin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  const session = await createSessionClient();
  const { data: agent } = await session.from("agents").select("id, name, email, user_id").eq("id", id).maybeSingle();
  if (!agent) return { error: "Agent not found." };
  if (agent.user_id) return { error: "This agent already has a login." };

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "SUPABASE_SERVICE_ROLE_KEY is required to create logins." };
  }
  const { data, error } = await admin.auth.admin.createUser({
    email: agent.email,
    password,
    email_confirm: true,
    user_metadata: { role: "agent", full_name: agent.name },
  });
  if (error) return { error: error.message };
  await admin.from("agents").update({ user_id: data.user.id }).eq("id", id);
  return { success: `Login created for ${agent.email}.` };
}
