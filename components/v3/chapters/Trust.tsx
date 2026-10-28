"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";
import { homeCopy, BRANDS } from "@/lib/homeCopy";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = /^(dấu|tích|uy|tín|số|trust|badge|badges\.?)[.,:]?$/i;

// ĐỐI TÁC + TUYÊN NGÔN: hai dải chữ chạy bắt chéo (cobalt / mực) rồi một câu tuyên ngôn
// khổng lồ "tô mực" từng chữ theo thanh cuộn.
export default function Trust() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const root = useRef<HTMLElement>(null);
  const words = t.manifesto.split(" ");

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".v3-mf-w", { opacity: 0.16 }, {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ".v3-mf", start: "top 78%", end: "bottom 45%", scrub: true },
      });
      gsap.fromTo(".v3-band-a .v3-band-track", { xPercent: 0 }, { xPercent: -18, ease: "none", scrollTrigger: { trigger: ".v3-bands", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".v3-band-b .v3-band-track", { xPercent: -18 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".v3-bands", start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  }, { scope: root });

  const band = (list: string[]) => (
    <div className="v3-band-track">
      {[...list, ...list, ...list].map((b, k) => (
        <span key={k} className="v3-band-item">{b}<i aria-hidden>✦</i></span>
      ))}
    </div>
  );
  const half = Math.ceil(BRANDS.length / 2);
  const brandsB = [...BRANDS.slice(half), ...BRANDS.slice(0, half)];

  return (
    <section id="trust" ref={root} className="v3-trust v3-station">
      <h2 className="sr-only">{t.trusted}</h2>
      <ul className="sr-only">{BRANDS.map((b) => <li key={b}>{b}</li>)}</ul>
      <div className="v3-bands" aria-hidden>
        <div className="v3-band v3-band-a">{band(BRANDS)}</div>
        <div className="v3-band v3-band-b">{band(brandsB)}</div>
        <span className="v3-bands-label">{t.trusted}</span>
      </div>

      <div className="v3-container">
        <p className="v3-mf">
          {words.map((w, i) => (
            <span key={i} className={`v3-mf-w${ACCENT.test(w) ? " is-accent" : ""}`}>{w} </span>
          ))}
        </p>
      </div>
    </section>
  );
}
