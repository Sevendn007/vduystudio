"use client";
// Biến vị trí cuộn thành một con số 0→1 và phát cho cả cảnh 3D lẫn lớp chữ.
// Không dùng state React để tránh render lại 60 lần/giây: ghi thẳng vào ref và
// vào các biến CSS --cN (độ hiện) / --tN (độ trượt) trên phần tử gốc.
import { useEffect } from "react";
import { CHAPTERS, chapterDrift, chapterPresence } from "./scene/journey";
import { pinnedProgress } from "@/lib/sitetemplate/xekhach/quality";

const DRIFT_PX = 26;

export default function ScrollDriver({
  rootRef,
  progress,
  onChapter,
}: {
  rootRef: React.RefObject<HTMLDivElement>;
  progress: React.MutableRefObject<number>;
  onChapter: (index: number) => void;
}) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const pinned = pinnedProgress();
    let raf = 0;
    let last = -1;
    let lastChapter = -1;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));

    const apply = (p: number) => {
      progress.current = p;
      root.style.setProperty("--p", p.toFixed(4));
      let active = 0;
      for (let i = 0; i < CHAPTERS.length; i++) {
        const c = CHAPTERS[i];
        const v = chapterPresence(p, c.from, c.to);
        root.style.setProperty(`--c${i}`, v.toFixed(3));
        root.style.setProperty(`--t${i}`, (chapterDrift(p, c.from, c.to) * -DRIFT_PX).toFixed(1));
        // chương mờ hẳn thì ẩn luôn, nếu không nó vẫn chặn chuột
        const sec = sections[i];
        if (sec) {
          const on = v > 0.015 ? "1" : "0";
          if (sec.dataset.on !== on) sec.dataset.on = on;
        }
        if (v > 0.5) active = i;
      }
      if (active !== lastChapter) {
        lastChapter = active;
        onChapter(active);
      }
    };

    const measure = () => {
      if (pinned !== null) return pinned;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const tick = () => {
      const p = measure();
      if (Math.abs(p - last) > 0.0004) {
        last = p;
        apply(p);
      }
      raf = requestAnimationFrame(tick);
    };

    apply(measure());
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rootRef, progress, onChapter]);

  return null;
}

/** Cuộn tới giữa một chương (dùng cho thanh điều hướng dọc). */
export function scrollToChapter(index: number): void {
  const c = CHAPTERS[index];
  if (!c) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const at = c.id === "hero" ? 0 : (c.from + c.to) / 2;
  window.scrollTo({ top: at * max, behavior: "smooth" });
}
