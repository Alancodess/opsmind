"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("alex@opsmind.dev");
  const [loading, setLoading] = useState(false);

  const from = searchParams.get("from") || "/dashboard";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    signIn(email);
    router.push(from.startsWith("/") ? from : "/dashboard");
  };

  const handleDemo = () => {
    setLoading(true);
    signIn("demo@opsmind.dev");
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-[400px]">
      <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-[var(--accent)]"
            />
          </svg>
        </span>
        <span className="text-sm font-semibold">OpsMind</span>
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Sign in</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Access your operations command center. Mock authentication for demo.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[12px] font-medium text-[var(--text-secondary)]">
            Work email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="saas-input w-full"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-[12px] font-medium text-[var(--text-secondary)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            defaultValue="••••••••"
            className="saas-input w-full"
            placeholder="Any value works"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.06]" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
          <span className="bg-[var(--bg-base)] px-2 text-[var(--text-muted)]">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDemo}
        disabled={loading}
        className="btn-secondary w-full justify-center !py-3"
      >
        Continue with demo account
      </button>

      <p className="mt-8 text-center text-[12px] text-[var(--text-muted)]">
        No account?{" "}
        <Link href="/" className="text-[var(--accent)] hover:underline">
          Explore the platform
        </Link>
      </p>
    </div>
  );
}
