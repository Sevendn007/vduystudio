"use client";

// Lenis smooth scroll đồng bộ với GSAP ScrollTrigger. Tắt khi reduced-motion
// và trên thiết bị cảm ứng (dùng cuộn native cho mượt và đúng quán tính iOS).

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    let lenis: Lenis | null = null;

    // Link neo trong trang (#feedback...) KHÔNG để trình duyệt tự đẩy một mục lịch sử: mục đó không mang state
    // của Next App Router nên bấm Back từ /blog về "/#feedback" chỉ đổi URL + cuộn mà không chuyển trang.
    // Thay vào đó cuộn tay rồi replaceState (giữ nguyên history.state của Next).
    const onAnchor = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -80 });
      else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      window.history.replaceState(window.history.state, "", url.hash);
    };
    document.addEventListener("click", onAnchor);

    if (reduced || touch) return () => document.removeEventListener("click", onAnchor);

    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      document.removeEventListener("click", onAnchor);
      gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);
  return null;
}
