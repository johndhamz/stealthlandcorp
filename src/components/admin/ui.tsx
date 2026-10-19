import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-navy-600">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className, title, description }: { children: ReactNode; className?: string; title?: string; description?: string }) {
  return (
    <section className={cn("rounded-xl border border-navy-900/10 bg-white p-5 shadow-sm sm:p-6", className)}>
      {title && (
        <div className="mb-5">
          <h2 className="font-display text-base font-bold text-navy-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-navy-600">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Alert({ state }: { state?: { error?: string; success?: string } }) {
  if (!state?.error && !state?.success) return null;
  return (
    <p
      role="alert"
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        state.error ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-300 bg-emerald-50 text-emerald-700",
      )}
    >
      {state.error ?? state.success}
    </p>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "gold" | "green" | "red" | "blue" }) {
  const tones = {
    neutral: "bg-navy-900/5 text-navy-700",
    gold: "bg-gold-500/15 text-gold-600",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-sky-100 text-sky-700",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", tones[tone])}>{children}</span>;
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-navy-900/10 bg-white shadow-sm">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("whitespace-nowrap border-b border-navy-900/10 bg-cream px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-navy-600", className)}>{children}</th>;
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("border-b border-navy-900/5 px-4 py-3 align-middle text-navy-900", className)}>{children}</td>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-navy-900/15 bg-white p-12 text-center">
      <h3 className="font-display text-lg font-bold text-navy-900">{title}</h3>
      {text && <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export const btn = {
  primary: "inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60",
  gold: "inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-gold-400 disabled:opacity-60",
  secondary: "inline-flex items-center justify-center gap-2 rounded-md border border-navy-900/15 bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-cream disabled:opacity-60",
  danger: "inline-flex items-center justify-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60",
  link: "text-sm font-medium text-navy-900 underline-offset-4 hover:underline",
};

export function LinkButton({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: keyof typeof btn }) {
  return (
    <Link href={href} className={btn[variant]}>
      {children}
    </Link>
  );
}

export const label = "mb-1.5 block text-xs font-semibold text-navy-700";
export const input = "field field-light";
export const help = "mt-1 text-xs text-navy-600";

export function Field({ id, label: text, hint, children }: { id?: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={label}>
        {text}
      </label>
      {children}
      {hint && <p className={help}>{hint}</p>}
    </div>
  );
}

export function formatDate(iso?: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(iso));
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "new" ? "gold" : status === "contacted" ? "blue" : status === "qualified" ? "green" : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}
