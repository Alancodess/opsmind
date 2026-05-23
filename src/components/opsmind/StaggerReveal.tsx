"use client";

import { Children, type ReactNode } from "react";
import { ScrollReveal } from "./ScrollReveal";

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
};

export function StaggerReveal({
  children,
  className = "",
  stagger = 70,
  direction = "up",
}: StaggerRevealProps) {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => (
        <ScrollReveal key={i} delay={i * stagger} direction={direction}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
