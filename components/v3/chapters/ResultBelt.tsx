"use client";
/* eslint-disable @next/next/no-img-element */
import VerifiedTick from "@/components/v3/ui/VerifiedTick";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { homeCopy, CLIENTS, PLATFORM_NAME } from "@/lib/homeCopy";
import { DEFAULT_PROJECTS } from "@/components/premiumKit";
import { href } from "@/lib/v3/routes";
import { localizeVi, stripNo, tidy as tidyRaw } from "@/lib/v3/format";
import { useV3 } from "../V3Context";
import PlatformMark from "../ui/PlatformMark";
import { toView } from "./projects/model";

// DỰ ÁN — coverflow 3D như v2 (chủ site chọn 2026-10-29), phối lại theo palette kem/mực/cobalt.
// CSS transform (không WebGL), chạy cả desktop & mobile: vuốt/kéo, phím ←/→, tự chạy 4.5s
// (dừng khi rê chuột/tab ẩn/reduced-motion), bấm thẻ giữa → lightbox. Dữ liệu: server (useV3).
export default function ResultBelt() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const p = t.projects;
  const { projects, contact } = useV3();
  const items = projects && projects.length ? projects : DEFAULT_PROJECTS;
  const tidy = (x?: string | null) => localizeVi(tidyRaw(x), lang);
  const n = items.length;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<(typeof items)[number] | null>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; dx: number; moved: boolean; id: number } | null>(null);
  const wheelLock = useRef(0);
  const prevOff = useRef<number[]>([]);
  const prevActive = useRef(0);
  const [spin, setSpin] = useState(0); // vòng tròn nền quay theo hướng chuyển thẻ

  const go = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (reduced || paused || open || n < 2) return;
    const id = window.setInterval(() => !document.hidden && go(1), 4500);
    return () => window.clearInterval(id);
  }, [reduced, paused, open, n, go]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const fallback = (i: number) => DEFAULT_PROJECTS[i % DEFAULT_PROJECTS.length].image_url || `/images/d${(i % 4) + 1}.webp`;

  // Kéo/vuốt: thẻ chạy theo tay (CSS var --drag, không re-render), thả ra thì bắt về thẻ gần nhất.
  const cardStep = () => (trackRef.current?.querySelector<HTMLElement>(".v3-cf-card")?.offsetWidth ?? 240) * 0.78;
  const setDrag = (v: number, dragging: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.setProperty("--drag", v.toFixed(3));
    el.classList.toggle("is-dragging", dragging);
  };
  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, dx: 0, moved: false, id: e.pointerId };
  };
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id) return;
      d.dx = e.clientX - d.x;
      if (Math.abs(d.dx) > 6) d.moved = true;
      if (d.moved) setDrag(d.dx / cardStep(), true);
    };
    const up = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id) return;
      const steps = Math.round(-d.dx / cardStep());
      const flick = steps === 0 && Math.abs(d.dx) > 30 ? (d.dx < 0 ? 1 : -1) : steps;
      setDrag(0, false);
      if (d.moved && flick) go(flick);
      setTimeout(() => (drag.current = null), 0);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [go]);
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    const now = Date.now();
    if (now - wheelLock.current < 450) return;
    wheelLock.current = now;
    go(e.deltaX > 0 ? 1 : -1);
  };

  // Thẻ "vòng qua" đầu bên kia (off nhảy > 2) phải dịch chuyển tức thì, nếu không sẽ thấy nó bay ngang màn hình.
  const offs = items.map((_, i) => { let o = i - active; if (o > n / 2) o -= n; if (o < -n / 2) o += n; return o; });
  const jumped = offs.map((o, i) => prevOff.current[i] !== undefined && Math.abs(o - prevOff.current[i]) > 2);
  useEffect(() => { prevOff.current = offs; });
  useEffect(() => {
    let d = active - prevActive.current;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    prevActive.current = active;
    if (d) setSpin((v) => v + d * 60);
  }, [active, n]);

  const views = items.map((r, i) => toView(r, lang, i));
  const cur = views[active];

  return (
    <section id="projects" className="v3-works v3-station">
      <div className="v3-container v3-works-head">
        <div>
          <p className="v3-eyebrow">{stripNo(p.eyebrow)}</p>
          <h2 className="v3-xl">{p.h2a} <em className="v3-serif">{p.h2b}</em></h2>
        </div>
        <Link className="v3-link" href={href("/du-an")}>{p.all}</Link>
      </div>

      <div
        className="v3-cf"
        role="region"
        aria-roledescription="carousel"
        aria-label={stripNo(p.eyebrow)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onWheel={onWheel}
      >
        <div ref={trackRef} className="v3-cf-track" onPointerDown={onDown}>
          {/* Quỹ đạo của các thẻ: elip dẹt rộng đúng bằng đường đi của thẻ, neo theo khung ảnh. SVG kéo dẹt + viền không co giãn. */}
          <div className="v3-cf-orbit" aria-hidden>
            <svg viewBox="0 0 120 120" preserveAspectRatio="none">
              <circle className="v3-cf-orbit-line" cx="60" cy="60" r="56" vectorEffect="non-scaling-stroke" />
              <circle className="v3-cf-orbit-dash" cx="60" cy="60" r="40" vectorEffect="non-scaling-stroke" />
              <g className="v3-cf-orbit-spin" style={{ transform: `rotate(${spin}deg)` }}>
                <circle className="v3-cf-orbit-halo" cx="60" cy="4" r="6" />
                <circle className="v3-cf-orbit-dot" cx="60" cy="4" r="3" />
              </g>
              <circle className="v3-cf-orbit-pulse" key={active} cx="60" cy="60" r="56" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          {items.map((it, i) => {
            const off = offs[i];
            const abs = Math.abs(off);
            const title = tidy(it.title);
            return (
              <button
                key={it.id || i}
                className={`v3-cf-card${off === 0 ? " is-active" : ""}`}
                style={{
                  ["--off" as string]: off,
                  ["--abs" as string]: abs,
                  zIndex: 20 - abs,
                  opacity: abs > 2 ? 0 : 1,
                  transition: jumped[i] ? "none" : undefined,
                  pointerEvents: abs > 2 ? "none" : undefined,
                }}
                aria-label={title}
                aria-current={off === 0}
                tabIndex={off === 0 ? 0 : -1}
                onClick={() => {
                  if (drag.current?.moved) return;
                  if (off === 0) setOpen(it);
                  else setActive(i);
                }}
              >
                <span className="v3-cf-phone">
                  <span className="v3-cf-island" />
                  <img
                    src={it.image_url || fallback(i)}
                    alt={title}
                    loading={abs <= 1 ? "eager" : "lazy"}
                    draggable={false}
                    onError={(e) => ((e.currentTarget as HTMLImageElement).src = fallback(i))}
                  />
                  <span className="v3-cf-dim" aria-hidden />
                </span>
              </button>
            );
          })}
          <button className="v3-cf-arrow v3-cf-prev" onClick={() => go(-1)} aria-label={p.prev}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="v3-cf-arrow v3-cf-next" onClick={() => go(1)} aria-label={p.next}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        <div className="v3-cf-caption" aria-live="polite">
          <span className="v3-cf-count">{String(active + 1).padStart(2, "0")}<small>/{String(n).padStart(2, "0")}</small></span>
          <div className="v3-bar" key={cur.id}>
            <PlatformMark platform={cur.platform} size={40} />
            <div className="v3-bar-main">
              <h3>{cur.title}</h3>
              <p>{cur.handle ? (cur.href ? <a href={cur.href} target="_blank" rel="noreferrer">{cur.handle} ↗</a> : cur.handle) : cur.note ?? cur.platformName}</p>
            </div>
            {cur.outcome ? (
              <p className="v3-bar-outcome">
                <VerifiedTick size={18} check="#fff" />
                <span>{cur.outcome}</span>
              </p>
            ) : <span />}
            {cur.days != null ? <p className="v3-bar-days"><b>{cur.days}</b><small>{lang === "en" ? "days" : "ngày"}</small></p> : <span />}
          </div>
        </div>
      </div>

      <div id="clients" className="v3-container v3-clients">
        <p className="v3-eyebrow">{stripNo(t.clients.eyebrow)}</p>
        <h3 className="v3-clients-h">{t.clients.h2}</h3>
        {/* Danh sách chỉ để ĐỌC (không bấm được): thẻ phẳng, không hover, con trỏ mặc định. */}
        <ul className="v3-stickers">
          {CLIENTS.map((cl, i) => <li key={cl} className={`v3-stk v3-stk-${i % 4}`} style={{ ["--r" as string]: `${[-4, 3, -2, 5, -5, 2, 4, -3, 1][i % 9]}deg` }}>{localizeVi(cl, lang)}</li>)}
        </ul>
      </div>

      {open && createPortal(
        <div className="v3-lightbox" role="dialog" aria-modal="true" aria-label={tidy(open.title)} data-lenis-prevent onClick={() => setOpen(null)}>
          <div className="v3-lightbox-card" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <img src={open.image_url || fallback(active)} alt={tidy(open.title)} />
            <div className="v3-lightbox-info">
              <h3>{tidy(open.title)}</h3>
              {open.result && <p>{tidy(open.result)}</p>}
              <a className="v3-btn v3-btn-blue v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">{p.similar}</a>
              <button className="v3-btn v3-btn-ink v3-btn-lg" onClick={() => setOpen(null)}>{p.close}</button>
            </div>
          </div>
        </div>,
        document.querySelector(".v3") ?? document.body
      )}
    </section>
  );
}
