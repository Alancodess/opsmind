"use client";

import { WorkspaceSelector } from "./WorkspaceSelector";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserMenu } from "./UserMenu";

type AppHeaderProps = {
  onMenuClick: () => void;
};

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-[var(--bg-base)]/80 px-4 backdrop-blur-xl lg:h-16 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[var(--text-secondary)] lg:hidden"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <WorkspaceSelector />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-[var(--success)]/20 bg-[var(--success)]/10 px-2.5 py-1 text-[10px] font-medium text-[var(--success)] sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] status-dot-live" />
          All systems operational
        </span>
        <NotificationDropdown />
        <UserMenu />
      </div>
    </header>
  );
}
