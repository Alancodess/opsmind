"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { SaasPageTransition } from "./SaasPageTransition";
import { useAuth } from "./AuthProvider";
import { MOCK_USER } from "@/lib/auth";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user && document.cookie.includes("opsmind_session=")) {
      signIn(MOCK_USER.email);
    }
  }, [user, signIn]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--bg-base)]">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <SaasPageTransition>{children}</SaasPageTransition>
        </main>
      </div>
    </div>
  );
}
