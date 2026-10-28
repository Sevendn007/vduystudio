"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";
import { homeCopy, CLIENTS } from "@/lib/homeCopy";
import { DEFAULT_PROJECTS } from "@/components/premiumKit";
import { href } from "@/lib/v3/routes";
import { stripNo, tidy } from "@/lib/v3/format";
import { useV3 } from "../V3Context";

gsap.registerPlugin(ScrollTrigger);

// DỰ ÁN: desktop (chuột) → ghim section, cuộn dọc = trượt ngang cả dải thẻ.
// Cảm ứng / màn hẹp → vuốt ngang native + nút trước/sau. Khách hàng: sticker xoay lệch.
export default function ResultBelt() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const { projects } = useV3();
  const items = (projects && projects.length ? projects : DEFAULT_PROJECTS).slice(0, 8);
  const root = useRef<HTMLElement>(null);
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

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".v3-work");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  useGSAP(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      el.classList.add("is-pinned");
      const tr = track.current!;
      const dist = () => Math.max(0, tr.scrollWidth - tr.clientWidth);
      const tw = gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: el.querySelector(".v3-works-pin"),
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (st) => el.style.setProperty("--wp", st.progress.toFixed(3)),
        },
      });
      gsap.fromTo(".v3-work", { rotate: (i) => (i % 2 ? 3 : -3) }, { rotate: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "top top", scrub: true } });
      return () => { tw.scrollTrigger?.kill(); el.classList.remove("is-pinned"); gsap.set(tr, { clearProps: "x" }); };
    });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => { window.clearTimeout(id); mm.revert(); };
  }, { scope: root });

  const prev = lang === "en" ? "Previous" : "Trước";
  const next = lang === "en" ? "Next" : "Sau";

  return (
    <section id="projects" ref={root} className="v3-works v3-station">
      <div className="v3-works-pin">
        <div className="v3-container v3-works-head">
          <div>
            <p className="v3-eyebrow">{stripNo(t.projects.eyebrow)}</p>
            <h2 className="v3-xl">{t.projects.h2a} <em className="v3-serif">{t.projects.h2b}</em></h2>
          </div>
          <div className="v3-works-tools">
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

        <div className="v3-works-track" ref={track} onScroll={measure}>
          {items.map((p, i) => {
            const img = p.image_url || `/images/d${(i % 4) + 1}.webp`;
            const title = tidy(p.title);
            const result = tidy(p.result);
            return (
              <figure className="v3-work" key={p.id || i}>
                <div className="v3-work-img">
                  <NextImage src={img} alt={title} fill sizes="(max-width:760px) 72vw, 320px" style={{ objectFit: "cover" }} />
                  <span className="v3-work-no" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                  {p.tag && <span className="v3-work-tag">{tidy(p.tag)}</span>}
                </div>
                <figcaption>
                  <b>{title}</b>
                  {result && result !== title && <span>{result}</span>}
                </figcaption>
              </figure>
            );
          })}
        </div>
        <div className="v3-container"><div className="v3-works-progress" aria-hidden><i /></div></div>
      </div>

      <div id="clients" className="v3-container v3-clients">
        <p className="v3-eyebrow">{stripNo(t.clients.eyebrow)}</p>
        <h3 className="v3-clients-h">{t.clients.h2}</h3>
        <ul className="v3-stickers">
          {CLIENTS.map((cl, i) => <li key={cl} className={`v3-stk v3-stk-${i % 4}`} style={{ ["--r" as string]: `${[-4, 3, -2, 5, -5, 2, 4, -3, 1][i % 9]}deg` }}>{cl}</li>)}
        </ul>
      </div>
    </section>
  );
}
