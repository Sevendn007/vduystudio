"use client";
// Quality tier cho demo Kim Lý (theo pattern lib/v3/quality.ts, key riêng).
//   T0 Static : không WebGL / reduced-motion / saveData / context-lost → poster tĩnh.
//   T1 Lite   : touch hoặc ≤560px → canvas nhẹ (dpr 1, ít hạt, không bloom).
//   T2 Full   : desktop có WebGL → đầy đủ.
// Query hỗ trợ debug/chụp ảnh: ?tier=0..2  ?dpr=  ?p=0..1 (ghim progress)
//                               ?capture=1 (bỏ idle motion)  ?debug=1 (expose window.__kl)
export type Tier = 0 | 1 | 2;

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function query(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export function detectTier(): Tier {
  if (typeof window === "undefined") return 2;
  const q = query();
  const t = q.get("tier");
  if (t && /^[0-2]$/.test(t)) return Number(t) as Tier;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (reduced || nav.connection?.saveData || !hasWebGL()) return 0;

  const touch =
    window.matchMedia("(hover: none)").matches ||
    (navigator.maxTouchPoints ?? 0) > 1 ||
    window.matchMedia("(max-width: 560px)").matches;
  return touch ? 1 : 2;
}

// Không lưu tier: đo lại mỗi lần mount. Lưu vào sessionStorage từng làm trang
// kẹt ở bản tĩnh sau một lần mất WebGL context lúc rời trang.
export function resolveTier(): Tier {
  return detectTier();
}

export function tierDpr(tier: Tier): number {
  const d = query().get("dpr");
  if (d && Number(d) > 0) return Math.min(3, Number(d));
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  if (tier === 2) return Math.min(dpr, 1.5);
  return 1;
}

/** progress bị ghim bởi ?p= (chụp ảnh tĩnh ở một chương bất kỳ), hoặc null. */
export function pinnedProgress(): number | null {
  const p = query().get("p");
  if (p === null) return null;
  const n = Number(p);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : null;
}

export function isCapture(): boolean {
  return query().get("capture") === "1";
}

export function isDebug(): boolean {
  return query().get("debug") === "1";
}
