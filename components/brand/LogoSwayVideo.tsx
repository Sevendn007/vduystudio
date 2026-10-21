"use client";

// Video loop logo lắc 3D nhẹ — dùng bản có ALPHA thật (không còn khung đen):
//   Safari → HEVC alpha (.mov), Chrome/Firefox/Edge → VP9 alpha (.webm).
// Chỉ tải + phát khi gần viewport; reduced-motion → chỉ hiện poster (đã tách nền).

import { useEffect, useRef, useState } from "react";

function pickSrc(): string {
  const ua = navigator.userAgent;
  const isSafari = /Safari\//.test(ua) && !/Chrome\/|Chromium\/|Edg\/|CriOS\/|FxiOS\//.test(ua);
  return isSafari ? "/brand/video/logo-sway-loop-alpha-hevc.mov" : "/brand/video/logo-sway-loop-alpha.webm";
}

export default function LogoSwayVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSrc((s) => s ?? pickSrc());
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "200px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (src) ref.current?.play().catch(() => {});
  }, [src]);

  return (
    <div className={`logo-sway ${className}`}>
      <video
        ref={ref}
        src={src ?? undefined}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        poster="/brand/logo/vduy-logo-3d-1024.webp"
        aria-hidden
      />
    </div>
  );
}
