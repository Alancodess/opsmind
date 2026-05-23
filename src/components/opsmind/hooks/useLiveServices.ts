"use client";

import { useCallback, useState } from "react";
import {
  INITIAL_SERVICES,
  tickServices,
  type LiveService,
} from "@/lib/live-ops";
import { useLiveInterval } from "./useLiveInterval";

export function useLiveServices(intervalMs = 2500) {
  const [services, setServices] = useState<LiveService[]>(INITIAL_SERVICES);

  const tick = useCallback(() => {
    setServices((prev) => tickServices(prev));
  }, []);

  useLiveInterval(tick, intervalMs);

  return services;
}
