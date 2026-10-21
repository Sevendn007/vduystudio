"use client";

// HERO (redesign_spec.md §6.2)
// - Nền: ảnh tinh vân tĩnh + tia sáng CSS (không WebGL → nhẹ).
// - Chữ H1 hiện bằng CSS thuần (RevealWords) → không phụ thuộc JS, không bao giờ "mất chữ".
// - Cuộn: KHÔNG pin. Khi hero cuộn ra khỏi màn hình, logo xoay dần (chuỗi frame)
//   + nội dung trôi lên mờ dần. Không có khoảng màn hình trống.

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GradientText from "@/components/rb/GradientText/GradientText";
import RotatingText from "@/components/rb/RotatingText/RotatingText";
import ShinyText from "@/components/rb/ShinyText/ShinyText";
import CountUp from "@/components/rb/CountUp/CountUp";
import LogoTurnCanvas, { LogoTurnHandle } from "@/components/brand/LogoTurnCanvas";
import RevealWords from "@/components/brand/RevealWords";
import { useLang } from "@/lib/i18n";
import { homeCopy, STATS } from "@/lib/homeCopy";
import { useContact } from "@/lib/useContact";
import { useCanHover, useIsMobile, useLowPower, useReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const { lang } = useLang();
  const t = homeCopy(lang).hero;
  const contact = useContact();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const lowPower = useLowPower();
  const canHover = useCanHover();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef<LogoTurnHandle>(null);

  // nghiêng logo theo chuột (desktop)
  useEffect(() => {
    if (!canHover || reduced) return;
    const logo = logoRef.current;
    if (!logo) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      logo.style.setProperty("--rx", `${(-cy * 6).toFixed(2)}deg`);
      logo.style.setProperty("--ry", `${(cx * 6).toFixed(2)}deg`);
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const on = (e: PointerEvent) => {
      if (window.scrollY > window.innerHeight) return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => {
      window.removeEventListener("pointermove", on);
      cancelAnimationFrame(raf);
    };
  }, [canHover, reduced]);

  // cuộn: logo xoay + parallax khi hero rời màn hình (không pin)
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!section || !stage || !content) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.3,
            onUpdate: (self) => turnRef.current?.setProgress(Math.min(1, self.progress * 1.4)),
          },
        })
        .to(stage, { yPercent: 35, scale: 0.9 }, 0)
        .to(content, { y: -60, autoAlpha: 0, duration: 0.6 }, 0);
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  const stats = STATS(lang);
  const sep = lang === "en" ? "," : ".";

  return (
    <section ref={sectionRef} className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden>
        <div className="hero-nebula" />
        {!reduced && (
          <>
            <div className="hero-beam" />
            <div className="hero-beam b2" />
            <div className="hero-stars" />
          </>
        )}
        <div className="hero-floor" />
      </div>

      <div ref={stageRef} className="hero-stage">
        <div className="hero-glow" aria-hidden />
        <div ref={logoRef} className="hero-logo">
          <div className="hero-float">
            <LogoTurnCanvas ref={turnRef} mobile={mobile || lowPower} alt="VDuyStudio" />
          </div>
        </div>
        <div className="hero-orbit o1" aria-hidden><i /></div>
        <div className="hero-orbit o2" aria-hidden><i /></div>
      </div>

      <div ref={contentRef} className="hero-content container">
        <p className="chip hero-chip">
          <ShinyText text={t.chip} color="#9fdcd6" shineColor="#ffffff" speed={3} />
        </p>
        <h1 id="hero-title" className="hero-h1">
          <span className="hero-line">
            <RevealWords text={t.h1a} delay={0.15} />
          </span>
          <span className="hero-line">
            <RevealWords text={t.h1b} delay={0.3} />{" "}
            <span className="rw-w">
              <span style={{ animationDelay: "0.5s" }}>
                <GradientText className="hero-accent" colors={["#BFFCF6", "#5EF2E6", "#B9A7FF", "#5EF2E6", "#BFFCF6"]} animationSpeed={6}>
                  {t.accent}
                </GradientText>
              </span>
            </span>
          </span>
        </h1>
        <p className="hero-sub fade-up" style={{ animationDelay: "0.7s" }}>
          <span>{t.sub}</span>
          <RotatingText texts={t.rotating} mainClassName="hero-rot" rotationInterval={2200} staggerDuration={0.02} splitBy="characters" />
        </p>
        <div className="hero-ctas fade-up" style={{ animationDelay: "0.85s" }}>
          <a className="btn btn-primary btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">
            {t.cta1}
          </a>
          <a className="btn btn-glass btn-lg" href="#projects">
            {t.cta2}
          </a>
        </div>
        <div className="hero-stats fade-up" style={{ animationDelay: "1s" }}>
          {stats.map((s, i) => (
            <div className="hero-stat glass" key={i}>
              <b>
                <CountUp to={s.to} decimals={s.decimals} separator={sep} duration={2} />
                {s.suffix}
              </b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
