"use client";

// Hook dùng chung cho hiệu ứng: tôn trọng reduced-motion và tự hạ cấp trên
// máy yếu (xem redesign_spec.md §4.5).

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsMobile = () => useMediaQuery("(max-width: 560px)");
export const useCanHover = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export function detectLowPower(): boolean {
  if (typeof window === "undefined") return false;
  const n = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (n.connection?.saveData) return true;
  if ((n.hardwareConcurrency ?? 8) <= 4) return true;
  if ((n.deviceMemory ?? 8) <= 4) return true;
  try {
    const c = document.createElement("canvas");
    if (!(c.getContext("webgl2") || c.getContext("webgl"))) return true;
  } catch {
    return true;
  }
  return false;
}

/** true khi máy yếu / tiết kiệm dữ liệu / không có WebGL → tắt nền WebGL. */
export function useLowPower(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => setLow(detectLowPower()), []);
  return low;
}
