"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { btn } from "./ui";

export function SubmitButton({ children, variant = "primary", className }: { children: React.ReactNode; variant?: keyof typeof btn; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${btn[variant]} ${className ?? ""}`}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
