"use client";

// Video loop logo lắc 3D nhẹ (nền đen + mix-blend-mode:screen ở wrapper).
// Chỉ phát khi nằm trong viewport; reduced-motion → chỉ hiện poster.

import { useEffect, useRef } from "react";

export default function LogoSwayVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "120px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`logo-sway ${className}`}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        poster="/brand/video/logo-turn-poster.webp"
        aria-hidden
      >
        <source src="/brand/video/logo-sway-loop-black.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
