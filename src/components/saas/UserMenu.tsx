"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    setOpen(false);
    router.push("/sign-in");
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] py-1 pl-1 pr-2 transition-colors hover:bg-white/[0.06] sm:pr-3"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[11px] font-semibold text-[var(--accent)]">
          {user.avatar}
        </span>
        <span className="hidden text-left md:block">
          <span className="block text-[12px] font-medium leading-tight">{user.name}</span>
          <span className="block text-[10px] text-[var(--text-muted)]">{user.role}</span>
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-[220px] overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--bg-card)] shadow-xl shadow-black/40">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{user.email}</p>
          </div>
          <div className="p-1">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-[13px] text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
            >
              Profile & settings
            </Link>
            <Link
              href="/billing"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-[13px] text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
            >
              Billing
            </Link>
          </div>
          <div className="border-t border-white/[0.06] p-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-[var(--danger)] hover:bg-[var(--danger)]/10"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
