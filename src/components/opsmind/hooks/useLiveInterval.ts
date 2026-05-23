"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/** Lightweight interval that pauses when tab is hidden or reduced motion is on */
export function useLiveInterval(callback: () => void, ms: number, enabled = true) {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!enabled || reduced) return;

    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        cbRef.current();
      }
    }, ms);

    return () => window.clearInterval(id);
  }, [ms, enabled, reduced]);
}
