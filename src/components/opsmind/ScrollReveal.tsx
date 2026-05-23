"use client";

import { type ReactNode } from "react";
import { useInView } from "./useInView";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  /** When true, skips blur for nested layouts */
  subtle?: boolean;
};

const directionClass = {
  up: "reveal-up",
  down: "reveal-down",
  left: "reveal-left",
  right: "reveal-right",
  none: "reveal-none",
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  subtle = false,
}: ScrollRevealProps) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      className={`reveal ${subtle ? "reveal-subtle" : ""} ${directionClass[direction]} ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
