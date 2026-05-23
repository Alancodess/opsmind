import { Suspense } from "react";
import { SignInForm } from "@/components/saas/SignInForm";

export const metadata = {
  title: "Sign in — OpsMind",
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139, 156, 246, 0.12), transparent 65%)",
        }}
      />
      <Suspense
        fallback={
          <div className="h-64 w-full max-w-[400px] animate-pulse rounded-xl bg-white/[0.04]" />
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
