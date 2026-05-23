"use client";

import { useSmoothValue } from "./hooks/useSmoothValue";

type LiveNumberProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function LiveNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: LiveNumberProps) {
  const smooth = useSmoothValue(value, 550);
  const formatted =
    decimals > 0 ? smooth.toFixed(decimals) : Math.round(smooth).toLocaleString();

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
