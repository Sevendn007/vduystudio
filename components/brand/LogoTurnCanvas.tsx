"use client";
/* eslint-disable @next/next/no-img-element */

// Logo xoay theo cuộn: vẽ chuỗi frame (mặt trước → cạnh 90°) lên <canvas>.
// Frame nền đen, wrapper cha đặt mix-blend-mode:screen nên nền đen "biến mất".
// Poster frame 0 hiển thị ngay (LCP); chuỗi frame tải SAU sự kiện load theo
// thứ tự chia đôi (0, cuối, giữa, ¼, ¾…) để cuộn sớm vẫn có frame gần đúng.

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type LogoTurnHandle = { setProgress: (p: number) => void };

const SIZE = { desktop: [960, 864, 50], mobile: [600, 540, 25] } as const;

function bisectOrder(n: number): number[] {
  const out = [0, n - 1];
  const seen = new Set(out);
  let step = n - 1;
  while (step > 1) {
    step = Math.ceil(step / 2);
    for (let i = 0; i < n; i += step) if (!seen.has(i)) (seen.add(i), out.push(i));
  }
  for (let i = 0; i < n; i++) if (!seen.has(i)) out.push(i);
  return out;
}

const LogoTurnCanvas = forwardRef<LogoTurnHandle, { mobile?: boolean; alt: string }>(function LogoTurnCanvas(
  { mobile = false, alt },
  ref
) {
  const kind = mobile ? "mobile" : "desktop";
  const [w, h, count] = SIZE[kind];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const target = useRef(0);
  const drawn = useRef(-1);
  const raf = useRef(0);

  const draw = () => {
    raf.current = 0;
    const c = canvasRef.current;
    if (!c) return;
    const t = target.current;
    let idx = -1;
    for (let d = 0; d < count && idx < 0; d++) {
      if (frames.current[t - d]) idx = t - d;
      else if (frames.current[t + d]) idx = t + d;
    }
    if (idx < 0 || idx === drawn.current) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(frames.current[idx]!, 0, 0, c.width, c.height);
    drawn.current = idx;
    c.dataset.ready = "1";
  };
  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  };

  useImperativeHandle(ref, () => ({
    setProgress(p: number) {
      const i = Math.round(Math.min(1, Math.max(0, p)) * (count - 1));
      if (i !== target.current) {
        target.current = i;
        schedule();
      }
    },
  }));

  useEffect(() => {
    frames.current = new Array(count).fill(null);
    drawn.current = -1;
    let cancelled = false;
    const order = bisectOrder(count);
    let k = 0;
    const next = () => {
      if (cancelled || k >= order.length) return;
      const i = order[k++];
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        if (cancelled) return;
        frames.current[i] = im;
        drawn.current = -1; // có frame mới → vẽ lại frame gần nhất
        schedule();
        next();
      };
      im.onerror = next;
      im.src = `/brand/sequence/${kind}/turn_${String(i).padStart(3, "0")}.webp`;
    };
    const start = () => {
      for (let p = 0; p < 4; p++) next();
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, count]);

  return (
    <div className="h-turn">
      <img
        className="h-turn-poster"
        src="/brand/video/logo-turn-poster.webp"
        alt={alt}
        width={960}
        height={864}
        loading="eager"
        decoding="async"
        draggable={false}
      />
      <canvas ref={canvasRef} className="h-turn-canvas" width={w} height={h} aria-hidden />
    </div>
  );
});

export default LogoTurnCanvas;
