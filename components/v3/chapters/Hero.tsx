"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";
import { homeCopy, STATS } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";
import { useV3 } from "../V3Context";
import CountUp from "../ui/CountUp";
import RotatingText from "../ui/RotatingText";
import LiquidCanvas from "../canvas/LiquidCanvas";
import Seal from "../ui/Seal";

gsap.registerPlugin(ScrollTrigger);

/** Tách chữ thành từng ký tự để chạy hiệu ứng "trồi lên" (giữ nguyên từ không bị ngắt giữa chừng). */
function Chars({ text, base = 0 }: { text: string; base?: number }) {
  let i = base;
  return (
    <>
      {text.split(" ").map((word, w, arr) => (
        <span className="v3-word" key={w}>
          {Array.from(word.normalize("NFC")).map((ch, k) => (
            <span className="v3-ch" key={k} style={{ ["--i" as string]: i++ }}>{ch}</span>
          ))}
          {w < arr.length - 1 ? "\u00a0" : null}
        </span>
      ))}
    </>
  );
}

// HERO "LIQUID COBALT": chrome lỏng full-bleed + tiêu đề khổng lồ. Khi cuộn, cả khung
// thu lại thành một tấm thẻ bo góc rồi trôi lên, để lộ trang kem bên dưới.
export default function Hero() {
  const { lang } = useLang();
  const t = homeCopy(lang).hero;
  const c = v3Copy(lang);
  const { contact } = useV3();
  const stats = STATS(lang);
  const sep = lang === "en" ? "," : ".";
  const root = useRef<HTMLElement>(null);

  const big = t.h1a.replace(/[,.]$/, "").toLocaleUpperCase(lang === "en" ? "en" : "vi");
  const subWords = t.sub.split(" ");
  const subLast = subWords.pop();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        defaults: { ease: "none" },
      })
        .to(".v3-hero-stage", { clipPath: "inset(5% 2.5% 0% 2.5% round 40px)" }, 0)
        .to(".v3-hero-inner", { yPercent: -14, opacity: 0.25 }, 0)
        .to(".v3-liquid", { scale: 1.12 }, 0);
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section id="hero" ref={root} className="v3-hero v3-station" aria-labelledby="v3-hero-title">
      <div className="v3-hero-stage">
        <LiquidCanvas />
        <div className="v3-hero-shade" aria-hidden />
        <div className="v3-hero-inner">
          <p className="v3-hero-kicker v3-rise" style={{ ["--d" as string]: "0.05s" }}>
            <span className="v3-dot" aria-hidden /> VDuyStudio — {c.tagline}
          </p>

          <h1 id="v3-hero-title" className="v3-hero-h1" aria-label={`${t.h1a} ${t.h1b} ${t.accent}`}>
            <span className="v3-hero-big" aria-hidden><Chars text={big} /></span>
            <span className="v3-hero-line2" aria-hidden>
              <span className="v3-hero-small"><Chars text={t.h1b} base={10} /></span>{" "}
              <em className="v3-serif"><Chars text={t.accent} base={20} /></em>
            </span>
          </h1>

          <div className="v3-hero-foot">
            <p className="v3-hero-sub v3-rise" style={{ ["--d" as string]: "0.9s" }}>
              {subWords.join(" ")} <span className="v3-nowrap">{subLast} <RotatingText texts={t.rotating} /></span>
            </p>
            <div className="v3-hero-ctas v3-rise" style={{ ["--d" as string]: "1.05s" }}>
              <a className="v3-btn v3-btn-white v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">{t.cta1}</a>
              <a
                className="v3-btn v3-btn-glass v3-btn-lg" href="#pricing"
                onClick={(e) => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                {c.viewPricing}
              </a>
            </div>
          </div>

          <ul className="v3-hero-stats v3-rise" style={{ ["--d" as string]: "1.2s" }}>
            {stats.map((s, i) => (
              <li key={i}>
                <b><CountUp to={s.to} decimals={s.decimals} separator={sep} suffix={s.suffix} /></b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <Seal className="v3-hero-seal" text={lang === "en" ? "OFFICIAL BADGE · VERIFIED · VDUYSTUDIO · " : "TÍCH XANH CHÍNH CHỦ · ĐÃ XÁC MINH · VDUYSTUDIO · "} />
      </div>
    </section>
  );
}
