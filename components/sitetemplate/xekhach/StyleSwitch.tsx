"use client";
// Nút đổi giữa hai bản demo. Đổi ngay trong trang (không tải lại) và ghi vào
// địa chỉ bằng history.replaceState để gửi link đúng bản cho khách.
import { useLayoutEffect, useRef, useState } from "react";

export type DemoStyle = "future" | "classic";

const OPTIONS: { id: DemoStyle; label: string }[] = [
  { id: "future", label: "3D" },
  { id: "classic", label: "Cổ điển" },
];

export default function StyleSwitch({
  value,
  onChange,
}: {
  value: DemoStyle;
  onChange: (v: DemoStyle) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  // đo nút đang chọn để con trượt bám đúng bề rộng chữ
  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const active = el.querySelector<HTMLElement>('button[aria-pressed="true"]');
      if (!active) return;
      setThumb({ left: active.offsetLeft, width: active.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [value]);

  return (
    <div className="kl-switch" data-theme={value === "future" ? "dark" : "light"}>
      <span className="kl-switch-label">Phong cách</span>
      <div className="kl-switch-track" ref={track} role="group" aria-label="Chọn phong cách demo">
        {thumb && <span className="kl-switch-thumb" style={{ left: thumb.left, width: thumb.width }} aria-hidden />}
        {OPTIONS.map((o) => (
          <button key={o.id} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
