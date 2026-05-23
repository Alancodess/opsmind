export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-[var(--accent)]"
              />
            </svg>
          </span>
          <span className="text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} OpsMind
          </span>
        </div>
        <p className="order-last text-[11px] text-[var(--text-muted)] sm:order-none sm:text-[12px]">
          AI operations · Built for excellence
        </p>
        <div className="flex flex-wrap justify-center gap-5 text-[11px] text-[var(--text-muted)] sm:gap-6 sm:text-[12px]">
          <a href="#" className="footer-link">
            Privacy
          </a>
          <a href="#" className="footer-link">
            Terms
          </a>
          <a
            href="https://github.com"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
