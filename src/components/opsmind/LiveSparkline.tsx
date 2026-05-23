"use client";

import { memo } from "react";

type LiveSparklineProps = {
  points: number[];
  id: string;
  className?: string;
  highlight?: boolean;
};

function LiveSparklineInner({
  points,
  id,
  className = "mt-3 h-12 w-full sm:mt-4 sm:h-16",
  highlight,
}: LiveSparklineProps) {
  const pathPoints = points
    .map((p, i) => `${(i / (points.length - 1)) * 200},${64 - (p / 100) * 56}`)
    .join(" ");

  return (
    <svg
      className={className}
      viewBox="0 0 200 64"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={
              highlight ? "rgba(139,156,246,0.35)" : "rgba(139,156,246,0.3)"
            }
          />
          <stop offset="100%" stopColor="rgba(139,156,246,0)" />
        </linearGradient>
      </defs>
      <path
        d={`M0,64 ${points.map((p, i) => `L${(i / (points.length - 1)) * 200},${64 - (p / 100) * 56}`).join(" ")} L200,64 Z`}
        fill={`url(#grad-${id})`}
        className="transition-all duration-500 ease-out"
      />
      <polyline
        fill="none"
        stroke={highlight ? "rgba(139,156,246,0.95)" : "rgba(139,156,246,0.8)"}
        strokeWidth="1.5"
        points={pathPoints}
        className="transition-all duration-500 ease-out"
      />
    </svg>
  );
}

export const LiveSparkline = memo(LiveSparklineInner);
