"use client";
// Quyết định quality tier cho v3 ở mount (lưu sessionStorage, override ?tier= / ?dpr=).
//   T0 Static : không WebGL / reduced-motion / saveData / context-lost → không mount canvas.
//   T1 Lite   : touch (hover:none | maxTouchPoints>1) hoặc ≤560px → KHÔNG nạp three ở đợt 1 (CSS 3D).
//   T2 Full   : desktop có WebGL → canvas đầy đủ.
//   T3        : tuỳ chọn (bloom), chỉ khi ?tier=3.
export type Tier = 0 | 1 | 2 | 3;

const KEY = "v3_tier";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function fromQuery(): { tier?: Tier; dpr?: number } {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const t = q.get("tier");
  const d = q.get("dpr");
  const out: { tier?: Tier; dpr?: number } = {};
  if (t !== null && /^[0-3]$/.test(t)) out.tier = Number(t) as Tier;
  if (d !== null && Number(d) > 0) out.dpr = Math.min(3, Number(d));
  return out;
}

export function detectTier(): Tier {
  if (typeof window === "undefined") return 2; // SSR giả định desktop (canvas chỉ mount ở client)
  const q = fromQuery();
  if (q.tier !== undefined) return q.tier;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (reduced || nav.connection?.saveData || !hasWebGL()) return 0;

  const touch =
    window.matchMedia("(hover: none)").matches ||
    (navigator.maxTouchPoints ?? 0) > 1 ||
    window.matchMedia("(max-width: 560px)").matches;
  if (touch) return 1;

  return 2;
}

export function tierDpr(tier: Tier): number {
  const q = fromQuery();
  if (q.dpr) return q.dpr;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  if (tier >= 3) return Math.min(dpr, 2);
  if (tier === 2) return Math.min(dpr, 1.5);
  return Math.min(dpr, 1.25);
}

export function resolveTier(): Tier {
  if (typeof window === "undefined") return 2;
  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored && /^[0-3]$/.test(stored) && fromQuery().tier === undefined) return Number(stored) as Tier;
  } catch { /* private mode */ }
  const t = detectTier();
  try { sessionStorage.setItem(KEY, String(t)); } catch { /* ignore */ }
  return t;
}

/** Hạ tier xuống 0 khi mất WebGL context (gọi runtime). */
export function downgradeToStatic(): void {
  try { sessionStorage.setItem(KEY, "0"); } catch { /* ignore */ }
}

/** true nếu tier này nạp WebGL canvas (đợt 1: chỉ T2+). */
export function usesCanvas(tier: Tier): boolean {
  return tier >= 2;
}
