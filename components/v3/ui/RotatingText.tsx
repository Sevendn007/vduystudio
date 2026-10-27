"use client";
import { useEffect, useState } from "react";

// Chữ xoay vòng (TikTok/Facebook/…), fade CSS, không phụ thuộc `motion`.
export default function RotatingText({ texts, interval = 2200 }: { texts: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % texts.length), interval);
    return () => clearInterval(id);
  }, [texts.length, interval]);
  return (
    <span className="v3-rot" aria-live="polite">
      <span key={i} className="v3-rot-word">{texts[i]}</span>
    </span>
  );
}
