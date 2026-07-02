"use client";

// Carousel trượt ngang: hiện `per` thẻ mỗi khung, tự chạy + nút ‹ › + chấm.
// Khi số thẻ ≤ per → không hiện nút/chấm, chỉ xếp hàng bình thường.

import { useCallback, useEffect, useRef, useState, ReactNode } from "react";

export default function Carousel({
  children,
  per = 3,
  auto = true,
  interval = 5000,
  ariaLabel,
}: {
  children: ReactNode;
  per?: number;
  auto?: boolean;
  interval?: number;
  ariaLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const p = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(p);
    setActive(Math.min(p - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    window.addEventListener("resize", measure);
    // đo lại sau khi ảnh/layout ổn định
    const id = setTimeout(measure, 400);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(id);
      void el;
    };
  }, [measure]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const p = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    const idx = ((i % p) + p) % p;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (!auto || hover || pages <= 1) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const p = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
      const cur = Math.round(el.scrollLeft / el.clientWidth);
      el.scrollTo({ left: ((cur + 1) % p) * el.clientWidth, behavior: "smooth" });
    }, interval);
    return () => clearInterval(id);
  }, [auto, hover, pages, interval]);

  return (
    <div
      className="cru"
      style={{ ["--per" as string]: per }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="group"
      aria-label={ariaLabel}
              onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
    >
      <div
        className="cru-track"
        ref={trackRef}
        onScroll={() => {
          const el = trackRef.current;
          if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {children}
      </div>

      {pages > 1 && (
        <>
          <button className="cru-arrow prev" onClick={() => goTo(active - 1)} aria-label="Trước">‹</button>
          <button className="cru-arrow next" onClick={() => goTo(active + 1)} aria-label="Sau">›</button>
          <div className="cru-dots">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} className={i === active ? "on" : ""} onClick={() => goTo(i)} aria-label={`Nhóm ${i + 1}`} />
            ))}
          </div>
        </>
      )}

      <style>{`
.cru{--per:3;--g:18px;position:relative;}
.cru-track{display:flex;gap:var(--g);overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding-bottom:4px;}
.cru-track::-webkit-scrollbar{display:none;}
.cru-track>*{flex:0 0 calc((100% - (var(--per) - 1) * var(--g)) / var(--per));scroll-snap-align:start;}
.cru-arrow{position:absolute;top:calc(50% - 30px);transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:1px solid rgba(139,147,184,.35);background:rgba(3,4,12,.75);backdrop-filter:blur(6px);color:#e8ecff;font-size:24px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;z-index:2;}
.cru-arrow:hover{background:#67e8f9;color:#04101a;border-color:#67e8f9;}
.cru-arrow.prev{left:-8px;}
.cru-arrow.next{right:-8px;}
.cru-dots{display:flex;justify-content:center;gap:8px;margin-top:20px;}
.cru-dots button{width:8px;height:8px;border-radius:50%;border:none;background:rgba(139,147,184,.4);cursor:pointer;transition:.2s;padding:0;}
.cru-dots button.on{background:#67e8f9;width:22px;border-radius:100px;}
@media(max-width:980px){.cru{--per:2;}.cru-arrow{display:none;}}
@media(max-width:560px){.cru{--per:1;}}
      `}</style>
    </div>
  );
}
