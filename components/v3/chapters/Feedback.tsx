"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";
import { homeCopy } from "@/lib/homeCopy";
import { siteText } from "@/lib/site";
import { v3Copy } from "@/lib/v3/copy";
import { hasVietnamese, localizeVi, stripNo, tidy } from "@/lib/v3/format";
import { useV3 } from "../V3Context";
import type { DbFeedback } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// FEEDBACK: tường masonry (cao thấp tuỳ độ dài lời) — lời dài bị cắt 6 dòng và mở trong hộp thoại,
// nên bấm "Đọc thêm" không làm các thẻ khác nhảy/đổi hàng như kiểu mở rộng tại chỗ.
// Hộp thoại có data-lenis-prevent: Lenis (cuộn mượt toàn trang) nếu không sẽ nuốt wheel, chỉ cuộn được nền.
function Card({ f, idx, onOpen, tagVi }: { f: DbFeedback; idx: number; onOpen: (f: DbFeedback) => void; tagVi: string | null }) {
  const { lang } = useLang();
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [clamped, setClamped] = useState(false);
  const stars = Math.min(5, Math.max(1, f.rating ?? 5));
  const more = lang === "en" ? "Read more" : "Đọc thêm";

  useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [f.quote]);

  return (
    <figure className={`v3-q${idx === 1 ? " is-blue" : ""}`}>
      <span className="v3-q-mark" aria-hidden>“</span>
      <div className="v3-q-stars" role="img" aria-label={`${stars}/5`}>{"★".repeat(stars)}</div>
      <blockquote ref={quoteRef} lang={hasVietnamese(f.quote) ? "vi" : undefined} className="v3-q-clamp">{f.quote}</blockquote>
      {clamped && <button className="v3-q-toggle" onClick={() => onOpen(f)}>{more}</button>}
      <figcaption>
        <span className="v3-q-avatar" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {f.image_url ? <img src={f.image_url} alt="" loading="lazy" /> : (f.name?.charAt(0) ?? "?")}
        </span>
        <span>
          <b>{f.name}</b>
          {f.company && <em>{localizeVi(tidy(f.company), lang)}</em>}
        </span>
        {tagVi && <span className="v3-q-lang" title={tagVi}>VI</span>}
      </figcaption>
    </figure>
  );
}

export default function Feedback() {
  const { lang } = useLang();
  const t = homeCopy(lang).feedback;
  const c = v3Copy(lang);
  const { feedbacks } = useV3();
  const root = useRef<HTMLElement>(null);
  const list: DbFeedback[] =
    feedbacks && feedbacks.length
      ? feedbacks
      : siteText(lang).testimonials.map((f, i) => ({ id: `t${i}`, name: f.name, company: f.company, quote: f.quote, rating: 5, image_url: null, sort_order: null, date: null }));
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<DbFeedback | null>(null);
  const shown = expanded ? list : list.slice(0, 6);
  const avg = (list.reduce((a, f) => a + Math.min(5, Math.max(1, f.rating ?? 5)), 0) / list.length).toFixed(1);
  const en = lang === "en";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = prev; };
  }, [open]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".v3-q", { opacity: 0, y: 36 });
      ScrollTrigger.batch(".v3-q", {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [shown.length] });

  const tagFor = (f: DbFeedback) => (en && hasVietnamese(f.quote) ? "Vietnamese original" : null);

  return (
    <section id="feedback" ref={root} className="v3-fbk v3-station">
      <div className="v3-container">
        <div className="v3-fbk-head">
          <div>
            <p className="v3-eyebrow">{stripNo(t.eyebrow)}</p>
            <h2 className="v3-xl">{t.h2}<em className="v3-serif">{en ? "" : "?"}</em></h2>
          </div>
          <div className="v3-fbk-score" aria-label={`${avg}/5`}>
            <b>{en ? avg : avg.replace(".", ",")}</b>
            <span><i aria-hidden>★★★★★</i>{list.length} {en ? "reviews" : "đánh giá"}</span>
          </div>
        </div>
        <div className="v3-fbk-grid">
          {shown.map((f, idx) => <Card key={f.id} f={f} idx={idx} onOpen={setOpen} tagVi={tagFor(f)} />)}
        </div>
        {en && list.some((f) => hasVietnamese(f.quote)) && <p className="v3-fbk-note">VI — {"Reviews are shown in their original Vietnamese."}</p>}
        {list.length > 6 && (
          <div className="v3-fbk-more">
            <button className="v3-btn v3-btn-ink" onClick={() => setExpanded((v) => !v)}>
              {expanded ? c.collapse : c.allReviews(list.length)}
            </button>
          </div>
        )}
      </div>

      {open && createPortal(
        <div className="v3-qm" role="dialog" aria-modal="true" aria-label={open.name} data-lenis-prevent onClick={() => setOpen(null)}>
          <div className="v3-qm-card" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <span className="v3-q-mark" aria-hidden>“</span>
            <div className="v3-q-stars" role="img" aria-label={`${open.rating ?? 5}/5`}>{"★".repeat(Math.min(5, Math.max(1, open.rating ?? 5)))}</div>
            <blockquote lang={hasVietnamese(open.quote) ? "vi" : undefined}>{open.quote}</blockquote>
            <div className="v3-qm-foot">
              <span><b>{open.name}</b>{open.company && <em>{localizeVi(tidy(open.company), lang)}</em>}</span>
              <button className="v3-btn v3-btn-ink" onClick={() => setOpen(null)}>{en ? "Close" : "Đóng"}</button>
            </div>
          </div>
        </div>,
        document.querySelector(".v3") ?? document.body
      )}
    </section>
  );
}
