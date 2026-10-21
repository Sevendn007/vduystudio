"use client";

// HERO (redesign_spec.md §6.2): nền tinh vân tĩnh + tia sáng CSS (không WebGL), logo xoay
// theo cuộn (chuỗi frame), H1 SplitText + GradientText, RotatingText, CTA
// ClickSpark, stats CountUp. Biên đạo cuộn: pin + scrub (GSAP ScrollTrigger).

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "@/components/rb/SplitText/SplitText";
import GradientText from "@/components/rb/GradientText/GradientText";
import RotatingText from "@/components/rb/RotatingText/RotatingText";
import ShinyText from "@/components/rb/ShinyText/ShinyText";
import CountUp from "@/components/rb/CountUp/CountUp";
import ClickSpark from "@/components/rb/ClickSpark/ClickSpark";
import LogoTurnCanvas, { LogoTurnHandle } from "@/components/brand/LogoTurnCanvas";
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
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const slitRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef<LogoTurnHandle>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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

  // biên đạo cuộn
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const logo = logoRef.current;
    const content = contentRef.current;
    const stats = statsRef.current;
    const slit = slitRef.current;
    if (!section || !logo || !content || !stats || !slit) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (mobile ? 0.8 : 1.2)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => turnRef.current?.setProgress(Math.min(1, self.progress / 0.65)),
        },
      });
      tl.to(stats, { autoAlpha: 0, y: -24, duration: 0.2 }, 0)
        .to(content.children, { autoAlpha: 0, y: -48, stagger: 0.04, duration: 0.26 }, 0)
        .fromTo(logo, { "--s": 1 }, { "--s": 1.25, duration: 0.65 }, 0)
        .to(glowRef.current, { "--glowO": 1, scale: 1.3, duration: 0.2 }, 0.65)
        .fromTo(slit, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.12 }, 0.85)
        .to(logo, { autoAlpha: 0, duration: 0.08 }, 0.9)
        .to(slit, { autoAlpha: 0, duration: 0.05 }, 0.95)
        .to({}, { duration: 0 }, 1);
    }, section);
    return () => ctx.revert();
  }, [reduced, mobile]);

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

      <div className="hero-stage">
        <div className="hero-glow" ref={glowRef} aria-hidden />
        <div ref={logoRef} className="hero-logo">
          <div className="hero-float">
            <LogoTurnCanvas ref={turnRef} mobile={mobile || lowPower} alt="VDuyStudio" />
          </div>
        </div>
        <div className="hero-orbit o1" aria-hidden><i /></div>
        <div className="hero-orbit o2" aria-hidden><i /></div>
      </div>

      <div className="hero-content container">
        <div ref={contentRef} className="hero-copy">
          <p className="chip">
            <ShinyText text={t.chip} color="#9fdcd6" shineColor="#E8F4FF" speed={3} />
          </p>
          <h1 id="hero-title" className="hero-h1" aria-label={`${t.h1a} ${t.h1b} ${t.accent}`}>
            <span className="hero-line" aria-hidden>
              <SplitText
                key={`a-${lang}`}
                tag="span"
                text={t.h1a}
                splitType="chars"
                delay={25}
                duration={0.9}
                ease="expo.out"
                from={{ opacity: 0, y: 40, rotateX: -60 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                trigger="load"
              />
            </span>
            <span className="hero-line" aria-hidden>
              <SplitText
                key={`b-${lang}`}
                tag="span"
                text={t.h1b}
                splitType="chars"
                delay={25}
                duration={0.9}
                ease="expo.out"
                from={{ opacity: 0, y: 40, rotateX: -60 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                trigger="load"
              />{" "}
              <GradientText
                className="hero-accent"
                colors={["#BFFCF6", "#5EF2E6", "#B9A7FF", "#5EF2E6", "#E8F4FF"]}
                animationSpeed={6}
              >
                {t.accent}
              </GradientText>
            </span>
          </h1>
          <p className="hero-sub">
            {t.sub}{" "}
            <RotatingText
              texts={t.rotating}
              mainClassName="hero-rot"
              rotationInterval={2200}
              staggerDuration={0.02}
              splitBy="characters"
            />
          </p>
          <div className="hero-ctas">
            <ClickSpark sparkColor="#5EF2E6" sparkCount={10} sparkRadius={22}>
              <a className="btn btn-primary btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">
                {t.cta1}
              </a>
            </ClickSpark>
            <a className="btn btn-glass btn-lg" href="#projects">
              {t.cta2}
            </a>
          </div>
        </div>
        <div ref={statsRef} className="hero-stats">
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

      <div ref={slitRef} className="hero-slit" aria-hidden />
      <div className="hero-scroll" aria-hidden>{t.scroll}</div>
    </section>
  );
}
