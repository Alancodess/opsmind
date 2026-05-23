"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";

const links = [
  { href: "#platform", label: "Platform" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#incidents", label: "Incidents" },
  { href: "#analytics", label: "Analytics" },
  { href: "#work", label: "Work" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5 transition-[padding] duration-500 ${
        scrolled ? "sm:pt-3" : ""
      }`}
    >
      <nav
        className={`nav-shell mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:px-5 ${
          scrolled ? "nav-shell-scrolled" : ""
        }`}
      >
        <a href="/" className="group flex shrink-0 items-center gap-2 sm:gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] transition-all duration-300 group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent-soft)] group-hover:scale-[1.02]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-[var(--accent)]"
              />
              <circle cx="8" cy="8" r="2" fill="currentColor" className="text-[var(--accent)]" />
            </svg>
          </span>
          <span className="text-sm font-medium tracking-tight">OpsMind</span>
        </a>

        <div className="hidden items-center gap-6 lg:gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link text-[13px] text-[var(--text-secondary)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            href="/sign-in"
            variant="ghost"
            className="!hidden sm:!inline-flex !py-2"
          >
            Sign in
          </Button>
          <Button href="/dashboard" variant="primary" className="!px-3.5 !py-2 sm:!px-4">
            <span className="sm:hidden">App</span>
            <span className="hidden sm:inline">Open app</span>
          </Button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] md:hidden transition-colors hover:bg-white/[0.06]"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="sr-only">Menu</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              {menuOpen ? (
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 5h12M3 9h12M3 13h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-white/[0.08] glass-panel transition-all duration-500 ${
          menuOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <div className="flex flex-col gap-1 p-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/sign-in"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
          >
            Sign in
          </a>
          <a
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-white/[0.04]"
          >
            Open app
          </a>
        </div>
      </div>
    </header>
  );
}
