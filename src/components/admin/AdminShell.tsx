"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Building2, FileText, Inbox, LayoutDashboard, LogOut, Menu, Users, UserRound, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurrentUser } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/content", label: "Site content", icon: FileText },
  { href: "/admin/agents", label: "Agents", icon: UserRound },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminShell({ user, signOut, children }: { user: CurrentUser; signOut: () => Promise<void>; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
              active ? "bg-gold-500 text-navy-900" : "text-white/75 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="size-4" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-cream text-ink">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-900 p-5 lg:flex">
        <Link href="/admin" className="relative block h-9 w-[110px]">
          <Image src="/icons/stealthLogo.png" alt="Stealth Land Corp" fill sizes="110px" className="object-contain object-left" />
        </Link>
        <p className="mb-6 mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">Admin</p>
        {links}
        <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
          <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-white/60 hover:text-gold-400">
            <ExternalLink className="size-3.5" /> View public site
          </Link>
          <div className="text-xs text-white/60">
            <p className="truncate font-medium text-white">{user.fullName || user.email}</p>
            <p className="truncate">{user.email}</p>
          </div>
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-2 text-xs text-white/60 hover:text-gold-400">
              <LogOut className="size-3.5" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 bg-navy-900 p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-white">Admin</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="text-white/70">
                <X className="size-5" />
              </button>
            </div>
            {links}
            <form action={signOut} className="mt-8">
              <button type="submit" className="flex items-center gap-2 text-xs text-white/60 hover:text-gold-400">
                <LogOut className="size-3.5" /> Sign out
              </button>
            </form>
          </div>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="flex-1 bg-navy-950/60" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-navy-900/10 bg-white px-4 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-md p-2 text-navy-900">
            <Menu className="size-5" />
          </button>
          <span className="font-display text-sm font-bold text-navy-900">Stealth Land Admin</span>
          <span className="w-9" />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
