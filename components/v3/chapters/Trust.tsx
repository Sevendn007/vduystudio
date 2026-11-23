"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";
import { homeCopy, BRANDS } from "@/lib/homeCopy";

gsap.registerPlugin(ScrollTrigger);

// ĐỐI TÁC + TUYÊN NGÔN: hai dải chữ chạy bắt chéo (cobalt / mực) rồi một câu tuyên ngôn
// khổng lồ "tô mực" từng chữ theo thanh cuộn.
export default function Trust() {
  const { lang } = useLang();
  const t = homeCopy(lang);
  const root = useRef<HTMLElement>(null);
  // Tách tuyên ngôn: phần dẫn (trước dấu ":") + 3 trụ cột (sau dấu ":").
  const [lead, rest] = t.manifesto.split(/:\s*/);
  const pillars = rest.replace(/\.$/, "").split(/,\s*/).map((x) => x.charAt(0).toUpperCase() + x.slice(1));
  // Cụm nhấn mạnh giữ nguyên một khối, không bị ngắt dòng giữa chừng.
  const accentRe = new RegExp(`(${t.manifestoAccent.join("|")})`, "i");
  const chunks = lead.split(accentRe).filter(Boolean);
  let accentIdx = 0;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Hiện theo cụm có nghĩa (không theo từng từ): mỗi cụm sáng lên lần lượt, rồi gạch/đánh dấu cụm nhấn.
      const n = gsap.utils.toArray(".v3-mf-ph").length;
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".v3-mf", start: "top 80%", end: "bottom 40%", scrub: true },
      })
        .fromTo(".v3-mf-ph", { opacity: 0.16 }, { opacity: 1, duration: 1, stagger: 1 }, 0)
        .fromTo(".v3-mf-ph.is-strike", { "--p": 0 }, { "--p": 1, duration: 0.8 }, 2)
        .fromTo(".v3-mf-ph.is-mark", { "--p": 0 }, { "--p": 1, duration: 0.8 }, n);
      gsap.fromTo(".v3-mf-pillar", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, stagger: 0.18, ease: "power2.out",
        scrollTrigger: { trigger: ".v3-mf-pillars", start: "top 85%", end: "bottom 60%", scrub: true },
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
        <div className="v3-mf-grid">
          <p className="v3-mf">
            {chunks.map((c, i) => {
              const isAccent = accentRe.test(c);
              return (
                <span key={i}>
                  {/^\s/.test(c) && " "}
                  <span className={isAccent ? `v3-mf-ph is-accent ${accentIdx++ === 0 ? "is-strike" : "is-mark"}` : "v3-mf-ph"}>
                    {c.trim()}
                  </span>
                  {/\s$/.test(c) && " "}
                </span>
              );
            })}
          </p>
          <ol className="v3-mf-pillars">
            {pillars.map((p, i) => (
              <li key={i} className="v3-mf-pillar"><span>0{i + 1}</span>{p}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
