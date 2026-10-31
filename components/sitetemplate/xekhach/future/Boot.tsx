"use client";
// Màn mở đầu của bản 2100. Ba nhịp, tổng ~3,4 giây:
//   1. màn tối, một vạch quét chạy xuống, dòng chữ khởi động gõ ra
//   2. hạt sáng lao vào lắp thành chiếc xe, vòng xung kích lan ra
//   3. chữ KIM LÝ dựng lên, phụ đề và gợi ý cuộn hiện theo
// Kết quả được đẩy ra ngoài qua hai ref: assemble (0→1, hạt) và intro (1→0,
// camera lùi về đúng vị trí chương mở đầu).
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { isCapture } from "@/lib/sitetemplate/xekhach/quality";

export default function Boot({
  assemble,
  intro,
  rootRef,
}: {
  assemble: React.MutableRefObject<number>;
  intro: React.MutableRefObject<number>;
  rootRef: React.RefObject<HTMLDivElement>;
}) {
  const veil = useRef<HTMLDivElement>(null);
  const scan = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ?capture=1 hoặc giảm chuyển động: bỏ qua màn mở đầu, vào thẳng trạng thái cuối
    if (isCapture() || reduced) {
      assemble.current = 1;
      intro.current = 0;
      gsap.set(veil.current, { autoAlpha: 0 });
      gsap.set(root.querySelectorAll("[data-boot]"), { autoAlpha: 1, y: 0, clearProps: "transform" });
      return;
    }

    const q = (sel: string) => root.querySelectorAll(sel);
    const proxy = { a: 0, i: 1 };

    const ctx = gsap.context(() => {
      gsap.set(q("[data-boot]"), { autoAlpha: 0, y: 18 });
      gsap.set(q('[data-boot="title"]'), { y: 40 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1 — vạch quét + dòng chữ khởi động
      tl.fromTo(line.current, { width: 0 }, { width: "100%", duration: 0.75, ease: "steps(26)" }, 0.12)
        .fromTo(scan.current, { top: "0%", opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.15)
        .to(scan.current, { top: "100%", duration: 0.85, ease: "power2.inOut" }, 0.3)
        .to(scan.current, { opacity: 0, duration: 0.25 }, 0.95)

        // 2 — mở màn, hạt lắp thành xe, camera đẩy vào
        .to(veil.current, { autoAlpha: 0, duration: 0.7 }, 0.75)
        .to(proxy, { a: 1, duration: 1.75, ease: "power2.inOut", onUpdate: () => (assemble.current = proxy.a) }, 0.8)
        .to(proxy, { i: 0, duration: 2.6, ease: "power2.out", onUpdate: () => (intro.current = proxy.i) }, 0.8)
        .fromTo(
          ring.current,
          { scale: 0.2, opacity: 0.85 },
          { scale: 3.4, opacity: 0, duration: 1.5, ease: "power2.out" },
          1.25
        )

        // 3 — chữ và phần còn lại
        .to(q('[data-boot="hud"]'), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 1.5)
        .to(q('[data-boot="eyebrow"]'), { autoAlpha: 1, y: 0, duration: 0.5 }, 1.9)
        .to(q('[data-boot="title"]'), { autoAlpha: 1, y: 0, duration: 0.9, ease: "power4.out" }, 2.05)
        .to(q('[data-boot="sub"]'), { autoAlpha: 1, y: 0, duration: 0.6 }, 2.45)
        .to(q('[data-boot="chips"] > *'), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 }, 2.6)
        .to(q('[data-boot="hint"]'), { autoAlpha: 1, y: 0, duration: 0.5 }, 3.0);
    }, root);

    // Lưới an toàn: nếu trình duyệt tạm dừng requestAnimationFrame (tab ẩn,
    // khung xem trước bị tiết lưu) thì timeline đứng giữa chừng và chữ kẹt ở
    // trạng thái ẩn. setTimeout vẫn chạy, nên sau 6 giây thì ép hiện hết.
    const guard = window.setTimeout(() => {
      assemble.current = 1;
      intro.current = 0;
      gsap.set(veil.current, { autoAlpha: 0 });
      gsap.set(q("[data-boot]"), { autoAlpha: 1, y: 0 });
      gsap.set(q('[data-boot="chips"] > *'), { autoAlpha: 1, y: 0 });
    }, 6000);

    return () => {
      window.clearTimeout(guard);
      ctx.revert();
    };
  }, [assemble, intro, rootRef]);

  return (
    <div className="kl-f-boot" ref={veil} aria-hidden>
      <span className="kl-f-boot-scan" ref={scan} />
      <span className="kl-f-boot-ring" ref={ring} />
      <span className="kl-f-boot-line">
        <span ref={line}>KHỞI ĐỘNG · KIM LÝ TRANSIT 2100 · ĐẮK NÔNG ⇄ SÀI GÒN</span>
      </span>
    </div>
  );
}
