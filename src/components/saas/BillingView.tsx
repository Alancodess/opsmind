"use client";

const INVOICES = [
  { id: "INV-2406", date: "Jun 1, 2026", amount: "$2,400", status: "Paid" },
  { id: "INV-2405", date: "May 1, 2026", amount: "$2,400", status: "Paid" },
  { id: "INV-2404", date: "Apr 1, 2026", amount: "$2,180", status: "Paid" },
];

export function BillingView() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Subscription, usage, and invoice history for your workspace.
      </p>

      <section className="mt-10 saas-card glow-accent">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--accent)]">
              Current plan
            </p>
            <h2 className="mt-1 text-xl font-semibold">Enterprise</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Unlimited incidents · AI analysis · 99.9% SLA
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl font-semibold tabular-nums">$2,400</p>
            <p className="text-[12px] text-[var(--text-muted)]">per month · billed annually</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-primary !text-sm">
            Upgrade plan
          </button>
          <button type="button" className="btn-secondary !text-sm">
            Manage payment method
          </button>
        </div>
      </section>

      <section className="mt-6 saas-card">
        <h2 className="text-sm font-medium">Usage this period</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Monitored services", value: "47", cap: "50" },
            { label: "AI analyses", value: "1,204", cap: "5,000" },
            { label: "Team seats", value: "12", cap: "25" },
          ].map((u) => (
            <div key={u.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[12px] text-[var(--text-muted)]">{u.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {u.value}
                <span className="text-sm font-normal text-[var(--text-muted)]"> / {u.cap}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 saas-card overflow-hidden !p-0">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-sm font-medium">Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-mono text-[13px]">{inv.id}</td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">{inv.date}</td>
                  <td className="px-5 py-3 tabular-nums">{inv.amount}</td>
                  <td className="px-5 py-3">
                    <span className="text-[var(--success)]">{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
