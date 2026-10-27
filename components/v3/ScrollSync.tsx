"use client";
import { useEffect } from "react";
import { CHAPTERS, scrollStore, type Chapter } from "@/lib/v3/scrollStore";

// Đồng bộ cuộn → scrollStore: chương hiện tại (section nào chiếm giữa viewport),
// tiến độ trong chương, tiến độ toàn trang, vận tốc. Chạy với scroll native lẫn Lenis.
export default function ScrollSync() {
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const els = () => CHAPTERS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    let sections = els();
    const measure = () => { sections = els(); };
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      scrollStore.y = y;
      scrollStore.pageP = Math.min(1, Math.max(0, y / max));
      scrollStore.vy += ((y - lastY) - scrollStore.vy) * 0.2;
      lastY = y;
      // chương = section có tâm gần giữa viewport nhất (ưu tiên section đang phủ giữa màn)
      const mid = vh * 0.5;
      let best: Chapter = "hero", bestD = Infinity, bestP = 0;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
        if (d < bestD) {
          bestD = d; best = el.id as Chapter;
          bestP = Math.min(1, Math.max(0, (mid - r.top) / Math.max(1, r.height)));
        }
      }
      scrollStore.chapter = best;
      scrollStore.chapterP = bestP;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { measure(); onScroll(); });
    const ro = new ResizeObserver(() => { measure(); onScroll(); });
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
