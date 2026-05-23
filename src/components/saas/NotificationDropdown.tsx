"use client";

import { useEffect, useRef, useState } from "react";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "P2 — Elevated latency on ml-inference",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    title: "Deploy completed: api-gateway v2.14.1",
    time: "18m ago",
    unread: true,
  },
  {
    id: "3",
    title: "Weekly SLO report ready",
    time: "1h ago",
    unread: false,
  },
];

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[var(--text-secondary)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-primary)]"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M9 2a4 4 0 0 1 4 4v2.5c0 .5.2 1 .5 1.4L14 11H4l.5-1.1c.3-.4.5-.9.5-1.4V6a4 4 0 0 1 4-4z"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path d="M7.5 13a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] status-dot-live" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--bg-card)] shadow-xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <span className="text-sm font-medium">Notifications</span>
            <span className="text-[11px] text-[var(--text-muted)]">{unread} unread</span>
          </div>
          <ul className="max-h-[280px] overflow-y-auto scrollbar-hide">
            {NOTIFICATIONS.map((n) => (
              <li
                key={n.id}
                className={`border-b border-white/[0.04] px-4 py-3 transition-colors hover:bg-white/[0.02] ${
                  n.unread ? "bg-white/[0.02]" : ""
                }`}
              >
                <p className="text-[13px] font-medium leading-snug">{n.title}</p>
                <p className="mt-1 text-[11px] text-[var(--text-muted)]">{n.time}</p>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/[0.06] p-2">
            <button
              type="button"
              className="w-full rounded-lg py-2 text-center text-[12px] text-[var(--accent)] hover:bg-white/[0.04]"
            >
              View all activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
