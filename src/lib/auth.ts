import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

export type Role = "admin" | "agent";

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

/** Reads the session cookie and the profile row. Returns null when signed out. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: (profile?.full_name as string | null) ?? user.user_metadata?.full_name ?? "",
    role: ((profile?.role as Role | undefined) ?? "agent"),
  };
}

/** Use in admin pages and actions. Redirects to login when signed out, 403s non-admins. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "admin") redirect("/admin/login?error=forbidden");
  return user;
}
