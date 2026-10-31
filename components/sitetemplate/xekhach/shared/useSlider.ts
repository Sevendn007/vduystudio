"use client";
// Slider dùng chung: autoplay (dừng khi hover/ẩn tab/reduced-motion), kéo thả
// bằng pointer, phím ←/→. Trả về index + các handler để component tự vẽ.
import { useCallback, useEffect, useRef, useState } from "react";

export function useSlider(count: number, autoplayMs = 5500, autoplay = true) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; active: boolean }>({ x: 0, active: false });

  const go = useCallback(
    (n: number) => setIndex(((n % count) + count) % count),
    [count]
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplay, paused, count, autoplayMs]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    drag.current = { x: e.clientX, active: true };
    setPaused(true);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.x;
      drag.current.active = false;
      setPaused(false);
      if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
    },
    [next, prev]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    },
    [next, prev]
  );

  const stageProps = {
    onPointerDown,
    onPointerUp,
    onPointerCancel: () => {
      drag.current.active = false;
      setPaused(false);
    },
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onKeyDown,
    tabIndex: 0,
  };

  /** "active" | "prev" | "next" cho từng slide (để CSS xoay 3D). */
  const stateOf = (i: number) => {
    if (i === index) return "active";
    const before = (index - 1 + count) % count;
    return i === before ? "prev" : "next";
  };

  return { index, go, next, prev, stageProps, stateOf, setPaused };
}
