"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { useLang } from "@/lib/i18n";
import { homeCopy, CLIENTS } from "@/lib/homeCopy";
import { DEFAULT_PROJECTS } from "@/components/premiumKit";
import { v3Copy } from "@/lib/v3/copy";
import { href } from "@/lib/v3/routes";
import { stripNo, tidy } from "@/lib/v3/format";
import { useV3 } from "../V3Context";

export default function ResultBelt() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const c = v3Copy(lang);
  const { projects } = useV3();
  const items = (projects && projects.length ? projects : DEFAULT_PROJECTS).slice(0, 8);
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Trượt đúng 1 thẻ mỗi lần bấm (bàn phím/chuột không cần kéo ngang).
  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".v3-figure");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  const prev = lang === "en" ? "Previous" : "Trước";
  const next = lang === "en" ? "Next" : "Sau";

  return (
    <section id="projects" className="v3-section v3-station">
      <div className="v3-container">
        <div className="v3-section-head">
          <div>
            <p className="v3-eyebrow">{c.stations.projects.no} — {stripNo(t.projects.eyebrow)}</p>
            <h2 className="v3-h2">{t.projects.h2a} <span className="v3-accent">{t.projects.h2b}</span></h2>
          </div>
          <div className="v3-section-tools">
            <div className="v3-arrows">
              <button className="v3-arrow" onClick={() => step(-1)} disabled={edge.start} aria-label={prev}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>
              </button>
              <button className="v3-arrow" onClick={() => step(1)} disabled={edge.end} aria-label={next}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
            <Link className="v3-link" href={href("/du-an")}>{t.projects.all}</Link>
          </div>
        </div>

        <div className="v3-belt-track" ref={track} onScroll={measure}>
          {items.map((p, i) => {
            const img = p.image_url || `/images/d${(i % 4) + 1}.webp`;
            const title = tidy(p.title);
            const result = tidy(p.result);
            return (
              <figure className="v3-figure" key={p.id || i}>
                <div className="v3-phone">
                  <NextImage src={img} alt={title} fill sizes="(max-width:760px) 70vw, 290px" style={{ objectFit: "cover" }} />
                </div>
                <figcaption>
                  <b>{title}</b>
                  {result && result !== title && <span>{result}</span>}
                  {p.tag && <span className="v3-tag">{tidy(p.tag)}</span>}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div id="clients" className="v3-container v3-clients">
        <p className="v3-eyebrow">{stripNo(t.clients.eyebrow)}</p>
        <h3 className="v3-h3">{t.clients.h2}</h3>
        <ul className="v3-clients-row">
          {CLIENTS.map((cl) => <li key={cl} className="v3-client">{cl}</li>)}
        </ul>
      </div>
    </section>
  );
}
