"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { btn } from "./ui";

/** Two-step inline confirmation that avoids blocking browser dialogs. */
export function ConfirmButton({
  action,
  children,
  confirmLabel = "Confirm delete",
  variant = "danger",
}: {
  action: () => Promise<{ error?: string } | void>;
  children: React.ReactNode;
  confirmLabel?: string;
  variant?: keyof typeof btn;
}) {
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (!armed) {
    return (
      <button type="button" onClick={() => setArmed(true)} className={btn[variant]}>
        {children}
      </button>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await action();
            if (res && "error" in res && res.error) setError(res.error);
          })
        }
        className={btn.danger}
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {confirmLabel}
      </button>
      <button type="button" onClick={() => setArmed(false)} className={btn.secondary}>
        Cancel
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
