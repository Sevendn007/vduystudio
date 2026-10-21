"use client";

// Các section giữa/cuối trang chủ (redesign_spec.md §6.3–6.9).

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoLoop from "@/components/rb/LogoLoop/LogoLoop";
import ScrollReveal from "@/components/rb/ScrollReveal/ScrollReveal";
import ScrollVelocity from "@/components/rb/ScrollVelocity/ScrollVelocity";
import SpotlightCard from "@/components/rb/SpotlightCard/SpotlightCard";
import SplitText from "@/components/rb/SplitText/SplitText";
import Icon3D from "@/components/brand/Icon3D";
import { PersonAvatar } from "@/components/brand";
import { useLang } from "@/lib/i18n";
import { BRANDS, CLIENTS, PROCESS_ICONS, homeCopy } from "@/lib/homeCopy";
import { getProcess } from "@/lib/services";
import { siteText } from "@/lib/site";
import { fetchFeedbacks, DbFeedback } from "@/lib/data";
import { useReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/* ---------- tiêu đề section dùng chung ---------- */
export function SectionHeading({
  id,
  eyebrow,
  a,
  b,
  center = false,
  aside,
}: {
  id: string;
  eyebrow: string;
  a: string;
  b?: string;
  center?: boolean;
  aside?: React.ReactNode;
}) {
  const { lang } = useLang();
  return (
    <div className={`sec-head${center ? " center" : ""}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="sec-h2" aria-label={b ? `${a} ${b}` : a}>
          <span aria-hidden>
            <SplitText key={`${id}-${lang}-a`} tag="span" text={a} splitType="words" delay={60} duration={0.9} ease="expo.out"
              from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} />
          </span>
          {b && (
            <span className="sec-h2-b" aria-hidden>
              {" "}
              <SplitText key={`${id}-${lang}-b`} tag="span" text={b} splitType="words" delay={60} duration={0.9} ease="expo.out"
                from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} />
            </span>
          )}
        </h2>
      </div>
      {aside}
    </div>
  );
}

/* ---------- 6.3 Đồng hành cùng ---------- */
export function TrustedBy() {
  const { lang } = useLang();
  const label = homeCopy(lang).trusted;
  return (
    <section className="trusted" aria-label={label}>
      <span className="trusted-label eyebrow">{label}</span>
      <div className="trusted-loop">
        <LogoLoop
          logos={BRANDS.map((b) => ({ node: <span className="trusted-item">{b}<i>✦</i></span>, title: b }))}
          speed={40}
          direction="left"
          gap={56}
          logoHeight={28}
          pauseOnHover
          fadeOut
          fadeOutColor="#02040A"
          scaleOnHover
          ariaLabel={label}
        />
      </div>
    </section>
  );
}

/* ---------- 6.4 Tuyên ngôn ---------- */
export function Manifesto() {
  const { lang } = useLang();
  return (
    <section className="manifesto container" aria-label="Manifesto">
      <ScrollReveal key={lang} enableBlur baseOpacity={0.12} baseRotation={2} blurStrength={6} textClassName="manifesto-text">
        {homeCopy(lang).manifesto}
      </ScrollReveal>
      <div className="manifesto-icon" aria-hidden>
        <Icon3D name="verify" size={180} />
      </div>
    </section>
  );
}

/* ---------- 6.7 Khách hàng ---------- */
export function Clients() {
  const { lang } = useLang();
  const t = homeCopy(lang).clients;
  const row = (arr: string[]) => arr.map((c) => `${c}  ✦  `).join("");
  return (
    <section className="section clients" id="clients" aria-labelledby="clients-title">
      <div className="container">
        <SectionHeading id="clients-title" eyebrow={t.eyebrow} a={t.h2} center />
      </div>
      <ScrollVelocity
        texts={[row(CLIENTS), row(BRANDS)]}
        velocity={40}
        damping={50}
        stiffness={400}
        className="clients-row"
        fadeEdges
        pauseOnHover
        outlineAlternate
      />
      <ul className="sr-only">
        {CLIENTS.map((c) => <li key={c}>{c}</li>)}
      </ul>
    </section>
  );
}

/* ---------- 6.8 Quy trình ---------- */
export function Process() {
  const { lang } = useLang();
  const t = homeCopy(lang).process;
  const steps = getProcess(lang);
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty("--p", "1");
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "bottom 45%",
      scrub: true,
      onUpdate: (self) => el.style.setProperty("--p", self.progress.toFixed(3)),
    });
    return () => st.kill();
  }, [reduced]);

  return (
    <section className="section container" id="process" aria-labelledby="process-title">
      <SectionHeading id="process-title" eyebrow={t.eyebrow} a={t.h2a} b={t.h2b} />
      <ol ref={listRef} className="process" style={{ ["--n" as string]: steps.length }}>
        <span className="process-line" aria-hidden><span /></span>
        {steps.map((s, i) => (
          <li key={i} className="process-step" style={{ ["--i" as string]: i }}>
            <span className="process-node glass">
              <Icon3D name={PROCESS_ICONS[i] ?? "verify"} size={56} />
            </span>
            <span className="process-num">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- 6.9 Feedback ---------- */
export function Feedback() {
  const { lang } = useLang();
  const t = homeCopy(lang).feedback;
  const st = siteText(lang);
  const [db, setDb] = useState<DbFeedback[] | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const [all, setAll] = useState(false);

  useEffect(() => {
    let m = true;
    fetchFeedbacks().then((d) => m && setDb(d));
    return () => { m = false; };
  }, []);

  const items: DbFeedback[] =
    db ??
    st.testimonials.map((c, i) => ({ id: `t${i}`, name: c.name, company: c.company, quote: c.quote, rating: 5, image_url: null, sort_order: null, date: null }));
  const hue = (i: number) => [175, 250, 200, 40, 280, 120][i % 6];

  return (
    <section className="section container" id="feedback" aria-labelledby="feedback-title">
      <SectionHeading id="feedback-title" eyebrow={t.eyebrow} a={t.h2} />
      <div className="fb-grid">
        {(all ? items : items.slice(0, 6)).map((c, i) => (
          <SpotlightCard key={c.id} className="fb-card glass" spotlightColor="rgba(185, 167, 255, 0.14)" theme="dark">
            <div className="fb-top">
              <span className="fb-stars" aria-label={`${c.rating ?? 5}/5`}>{"★".repeat(Math.min(5, Math.max(1, c.rating ?? 5)))}</span>
              {c.date && <span className="fb-date">{c.date}</span>}
            </div>
            <blockquote>“{c.quote}”</blockquote>
            <div className="fb-person">
              <PersonAvatar name={c.name} hue={hue(i)} size={42} />
              <div>
                <b>{c.name}</b>
                {c.company && <span>{c.company}</span>}
              </div>
              {c.image_url && (
                <button className="fb-proof" onClick={() => setZoom(c.image_url)} aria-label="Xem ảnh minh chứng">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image_url} alt="" loading="lazy" />
                </button>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>
      {items.length > 6 && (
        <div className="fb-more">
          <button type="button" className="btn btn-glass" onClick={() => setAll((v) => !v)} aria-expanded={all}>
            {all ? (lang === "en" ? "Show less" : "Thu gọn") : (lang === "en" ? `Show all ${items.length} reviews` : `Xem tất cả ${items.length} đánh giá`)}
          </button>
        </div>
      )}
      {zoom && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setZoom(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="" />
        </div>
      )}
    </section>
  );
}
