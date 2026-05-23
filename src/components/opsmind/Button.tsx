"use client";

import { type AnchorHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  icon?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  icon,
  ...props
}: ButtonProps) {
  return (
    <a
      className={`${variantClass[variant]} ${icon ? "btn-icon" : ""} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
