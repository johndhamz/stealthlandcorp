export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when the public Supabase credentials are present. */
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
