"use client";

import { useCallback, useState } from "react";
import { INCIDENTS } from "@/lib/incidents";
import type { Incident, IncidentStatus } from "@/types/incident";
import { useLiveInterval } from "./useLiveInterval";

const STATUS_CYCLE: IncidentStatus[] = ["investigating", "monitoring"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function useLiveIncidents(intervalMs = 12000) {
  const [incidents, setIncidents] = useState<Incident[]>(() => [...INCIDENTS]);

  const tick = useCallback(() => {
    setIncidents((prev) => {
      const active = prev.filter((i) => i.status !== "resolved");
      if (active.length === 0 || Math.random() > 0.45) return prev;

      const target = randomItem(active);
      const idx = prev.findIndex((i) => i.id === target.id);
      if (idx === -1) return prev;

      const next = [...prev];
      const current = next[idx]!;

      if (current.status === "resolved") return prev;

      const newStatus =
        current.status === "investigating"
          ? "monitoring"
          : current.status === "monitoring"
            ? "investigating"
            : randomItem(STATUS_CYCLE);

      next[idx] = {
        ...current,
        status: newStatus,
        time: current.status !== newStatus ? "just now" : current.time,
      };

      return next;
    });
  }, []);

  useLiveInterval(tick, intervalMs);

  return incidents;
}
