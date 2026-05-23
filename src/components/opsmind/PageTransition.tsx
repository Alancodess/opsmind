"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useReducedMotion } from "./hooks/useReducedMotion";

export function PageTransition({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  return (
    <>
      {!reduced && (
        <div
          className={`page-loader fixed inset-0 z-[200] bg-[var(--bg-base)] ${ready ? "page-loader-done" : ""}`}
          aria-hidden
        />
      )}
      <div className={ready ? "page-content-ready" : "page-content-loading"}>
        {children}
      </div>
    </>
  );
}
