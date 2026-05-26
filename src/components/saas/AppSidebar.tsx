"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.4 1.4M13.2 13.2l1.4 1.4M3.4 14.6l1.4-1.4M13.2 4.8l1.4-1.4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/billing",
    label: "Billing",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 7h14" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  }, {
    href: "/incidents",
    label: "Incidents",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M9 2L16 14H2L9 2Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M9 6V10"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle cx="9" cy="12.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
];

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.06] bg-[var(--bg-elevated)] transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-white/[0.06] px-4 lg:h-16 lg:px-5">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-[var(--accent)]"
              />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight">OpsMind</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3 lg:p-4">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active
                  ? "bg-white/[0.08] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
                }`}
            >
              <span className={active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3 lg:p-4">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-[var(--text-muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--text-secondary)]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M6 3L2 8l4 5M2 8h12"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Back to marketing site
        </Link>
      </div>
    </aside>
  );
}
