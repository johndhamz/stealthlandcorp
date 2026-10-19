"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signIn, type ActionState } from "@/lib/admin/actions/auth";

export function LoginForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<ActionState, FormData>(signIn, {});
  const forbidden = params.get("error") === "forbidden";

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={params.get("next") ?? "/admin"} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/70">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="field" placeholder="you@stealthlandcorp.com" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-white/70">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {(state.error || forbidden) && (
        <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error ?? "This account does not have admin access."}
        </p>
      )}
      <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-navy-900 transition hover:bg-gold-400 disabled:opacity-60">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Sign in
      </button>
    </form>
  );
}
