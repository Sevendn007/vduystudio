"use client";

import { useRef, ReactNode, CSSProperties } from "react";

// Hiệu ứng nghiêng 3D theo con trỏ chuột — dùng cho card ở Option E/F.
export default function Tilt({
  children,
  className,
  style,
  id,
  max = 9,
  scale = 1.02,
  glare = false,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
      2
    )}deg) scale(${scale})`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(
        0
      )}% ${(py * 100).toFixed(0)}%, rgba(255,255,255,.28), transparent 45%)`;
    }
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glareRef.current) glareRef.current.style.background = "transparent";
  }

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={{
        transition: "transform .25s cubic-bezier(.2,.8,.2,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        position: "relative",
        ...style,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            mixBlendMode: "overlay",
            transition: "background .2s",
          }}
        />
      )}
    </div>
  );
}
