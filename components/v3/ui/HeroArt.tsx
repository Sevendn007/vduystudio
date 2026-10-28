"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useV3 } from "../V3Context";
import { usesCanvas } from "@/lib/v3/quality";
import { Mark3 } from "./Logo3";
import Icon3 from "./Icon3";

// three.js chỉ nạp khi thật sự dùng (desktop T2+, bố cục 2 cột) — mobile không tải ~950KB.
const MarkCanvas = dynamic(() => import("../canvas/MarkCanvas"), { ssr: false });

// Ô nghệ thuật cột phải hero: luôn có logo phẳng (SSR, không chờ JS); desktop đủ mạnh
// thì crossfade sang bản 3D khi canvas đã render xong vài frame.
export default function HeroArt({ chips }: { chips: [string, string] | null }) {
  const { tier, tierReady } = useV3();
  const box = useRef<HTMLDivElement>(null);
  const [want3d, setWant3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!tierReady) return;
    setWant3d(usesCanvas(tier) && window.matchMedia("(min-width: 1025px)").matches);
  }, [tier, tierReady]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e?.isIntersecting ?? false), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className={`v3-art${ready ? " is-3d" : ""}`}>
      <div className="v3-art-halo" aria-hidden />
      <div className="v3-art-orbit" aria-hidden />
      <div className="v3-art-flat"><Mark3 size={320} title="VDuyStudio" /></div>
      {want3d && (
        <div className="v3-art-canvas" aria-hidden>
          <MarkCanvas active={active} onReady={() => setReady(true)} onLost={() => { setWant3d(false); setReady(false); }} />
        </div>
      )}
      {chips && (
        <>
          <span className="v3-chip v3-chip-a"><Icon3 name="verify" size={20} />{chips[0]}</span>
          <span className="v3-chip v3-chip-b"><Icon3 name="shield" size={20} />{chips[1]}</span>
        </>
      )}
    </div>
  );
}
