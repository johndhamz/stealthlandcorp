import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "./LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage() {
  const configured = isSupabaseConfigured();
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 p-6">
      <div className="w-full max-w-sm">
        <div className="relative mx-auto mb-8 h-10 w-[130px]">
          <Image src="/icons/stealthLogo.png" alt="Stealth Land Corp" fill sizes="130px" className="object-contain" priority />
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800 p-7 shadow-2xl">
          <h1 className="font-display text-xl font-bold text-white">Admin sign in</h1>
          <p className="mt-1 text-sm text-white/60">Manage properties, inquiries and site content.</p>
          {configured ? (
            <Suspense>
              <LoginForm />
            </Suspense>
          ) : (
            <div className="mt-6 rounded-md border border-gold-500/30 bg-gold-500/10 p-4 text-sm text-white/80">
              <p className="font-semibold text-gold-400">Supabase is not configured.</p>
              <p className="mt-1">Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, run the migration and the seed script, then restart the server.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
