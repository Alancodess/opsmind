"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

export function WorkspaceSelector() {
  const { workspaces, workspaceId, setWorkspaceId } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = workspaces.find((w) => w.id === workspaceId) ?? workspaces[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-[200px] items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-left transition-colors hover:border-white/[0.12] hover:bg-white/[0.05] lg:max-w-[240px]"
        aria-expanded={open}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[10px] font-semibold text-[var(--accent)]">
          {current.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-medium">{current.name}</span>
          <span className="block truncate text-[10px] text-[var(--text-muted)]">
            {current.plan}
          </span>
        </span>
        <svg
          className={`shrink-0 text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-[260px] overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--bg-card)] shadow-xl shadow-black/40">
          <p className="border-b border-white/[0.06] px-3 py-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Workspaces
          </p>
          <ul className="p-1">
            {workspaces.map((ws) => (
              <li key={ws.id}>
                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceId(ws.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    ws.id === workspaceId
                      ? "bg-white/[0.08] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {ws.plan}
                  </span>
                  <span className="truncate font-medium">{ws.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
