"use client";
/* eslint-disable @next/next/no-img-element */

// 6.6 Dự án — coverflow 3D (CSS transform, không WebGL) chạy được cả desktop
// lẫn mobile; vuốt/kéo, phím ←/→, tự chạy 4.5s (dừng khi hover/tab ẩn),
// bấm thẻ giữa → lightbox. Dữ liệu: fetchProjects() → fallback DEFAULT_PROJECTS.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/home/Sections";
import { DEFAULT_PROJECTS } from "@/components/premiumKit";
import { fetchProjects, DbProject } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { homeCopy, PLATFORM_NAME } from "@/lib/homeCopy";
import { useContact } from "@/lib/useContact";
import { useReducedMotion } from "@/lib/motion";

export default function Projects() {
  const { lang } = useLang();
  const t = homeCopy(lang).projects;
  const contact = useContact();
  const reduced = useReducedMotion();
  const [db, setDb] = useState<DbProject[] | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<DbProject | null>(null);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  useEffect(() => {
    let m = true;
    fetchProjects().then((d) => m && setDb(d));
    return () => { m = false; };
  }, []);

  const items = db && db.length > 0 ? db : DEFAULT_PROJECTS;
  const n = items.length;
  const go = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n]);

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

  const cur = items[active];
  const fallback = (i: number) => DEFAULT_PROJECTS[i % DEFAULT_PROJECTS.length].image_url!;

  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          id="projects-title"
          eyebrow={t.eyebrow}
          a={t.h2a}
          b={t.h2b}
          aside={<Link href="/du-an" className="link-arrow">{t.all}</Link>}
        />
      </div>

      <div
        className="cf"
        role="region"
        aria-roledescription="carousel"
        aria-label={t.eyebrow}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
        onPointerMove={(e) => {
          const d = drag.current;
          if (d && Math.abs(e.clientX - d.x) > 40) {
            go(e.clientX < d.x ? 1 : -1);
            drag.current = { x: e.clientX, moved: true };
          }
        }}
        onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
      >
        <div className="cf-ring" aria-hidden />
        <div className="cf-track">
          {items.map((p, i) => {
            let off = i - active;
            if (off > n / 2) off -= n;
            if (off < -n / 2) off += n;
            const abs = Math.abs(off);
            return (
              <button
                key={p.id}
                className={`cf-card${off === 0 ? " is-active" : ""}`}
                style={{
                  ["--off" as string]: off,
                  ["--abs" as string]: abs,
                  zIndex: 20 - abs,
                  opacity: abs > 2 ? 0 : 1,
                  pointerEvents: abs > 2 ? "none" : undefined,
                }}
                aria-label={p.title}
                aria-current={off === 0}
                tabIndex={off === 0 ? 0 : -1}
                onClick={() => {
                  if (drag.current?.moved) return;
                  if (off === 0) setOpen(p);
                  else setActive(i);
                }}
              >
                <span className="phone">
                  <span className="phone-island" />
                  <img
                    src={p.image_url || fallback(i)}
                    alt={p.title}
                    loading={abs <= 1 ? "eager" : "lazy"}
                    draggable={false}
                    onError={(e) => ((e.currentTarget as HTMLImageElement).src = fallback(i))}
                  />
                </span>
              </button>
            );
          })}
        </div>
        <div className="cf-nav">
          <button className="cf-arrow" onClick={() => go(-1)} aria-label={t.prev}>←</button>
          <div className="cf-caption" aria-live="polite">
            <h3>{cur.title}</h3>
            {cur.result && <p>{cur.result}</p>}
            <span className="cf-chips">
              {cur.platform && <span className="chip chip-sm">{PLATFORM_NAME[cur.platform] ?? cur.platform}</span>}
              {cur.tag && <span className="chip chip-sm chip-aqua">{cur.tag}</span>}
            </span>
          </div>
          <button className="cf-arrow" onClick={() => go(1)} aria-label={t.next}>→</button>
        </div>
        <div className="cf-dots" aria-hidden>
          {items.map((p, i) => <span key={p.id} className={i === active ? "on" : ""} />)}
        </div>
      </div>

      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={open.title} onClick={() => setOpen(null)}>
          <div className="lightbox-card glass" onClick={(e) => e.stopPropagation()}>
            <img src={open.image_url || fallback(active)} alt={open.title} />
            <div className="lightbox-info">
              <h3>{open.title}</h3>
              {open.result && <p>{open.result}</p>}
              <a className="btn btn-primary" href={contact.zalo} target="_blank" rel="noreferrer">{t.similar}</a>
              <button className="btn btn-glass" onClick={() => setOpen(null)}>{t.close}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
