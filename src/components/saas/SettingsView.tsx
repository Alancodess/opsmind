"use client";

import { useAuth } from "./AuthProvider";

export function SettingsView() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Manage your profile, team preferences, and workspace configuration.
      </p>

      <section className="mt-10 saas-card">
        <h2 className="text-sm font-medium">Profile</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="saas-label">Full name</label>
            <input className="saas-input mt-1.5 w-full" defaultValue={user?.name} />
          </div>
          <div>
            <label className="saas-label">Email</label>
            <input className="saas-input mt-1.5 w-full" defaultValue={user?.email} readOnly />
          </div>
          <div className="sm:col-span-2">
            <label className="saas-label">Role</label>
            <input className="saas-input mt-1.5 w-full" defaultValue={user?.role} />
          </div>
        </div>
        <button type="button" className="btn-primary mt-6 !text-sm">
          Save changes
        </button>
      </section>

      <section className="mt-6 saas-card">
        <h2 className="text-sm font-medium">Notifications</h2>
        <ul className="mt-4 space-y-3">
          {[
            "Incident escalations",
            "SLO breach alerts",
            "Weekly reliability digest",
            "Deploy notifications",
          ].map((label) => (
            <li key={label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-[var(--text-secondary)]">{label}</span>
              <Toggle defaultOn />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 saas-card">
        <h2 className="text-sm font-medium">Security</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Two-factor authentication and API keys (demo UI).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn-secondary !text-sm">
            Enable 2FA
          </button>
          <button type="button" className="btn-secondary !text-sm">
            Manage API keys
          </button>
        </div>
      </section>
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={defaultOn}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
        defaultOn ? "bg-[var(--accent)]/80" : "bg-white/[0.1]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          defaultOn ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
