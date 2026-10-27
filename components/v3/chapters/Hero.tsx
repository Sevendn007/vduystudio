"use client";
import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { homeCopy, STATS } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";
import { useV3 } from "../V3Context";
import CountUp from "../ui/CountUp";
import RotatingText from "../ui/RotatingText";

// Hero = lớp overlay trên canvas kính (PrismCanvas cố định phía sau).
// Khối kính chiếm giữa-phải; chữ ở góc dưới-trái; số liệu cột mono góc dưới-phải.
// Reveal chữ bằng CSS khi <html class="v3-ready"> (PrismCanvas thêm sau frame 2, hoặc fallback 2.5s).

const PLACEHOLDER_PRICE = /^(li[eê]n h[eệ] b[aá]o gi[aá]|contact for quote|)$/i;
function priceAnchor(rows: { service: string; duration: string | null; warranty: string | null; price: string | null }[] | null, lang: "vi" | "en"): string | null {
  if (!rows || rows.length === 0) return null;
  const row = rows.find((r) => /t[ií]ch xanh|verif|badge/i.test(r.service)) ?? rows[0];
  const parts = [row.service];
  if (row.duration) parts.push(row.duration);
  if (row.warranty) parts.push((lang === "en" ? "warranty " : "BH ") + row.warranty);
  if (row.price && !PLACEHOLDER_PRICE.test(row.price.trim())) parts.push(row.price);
  return parts.join(" · ");
}

export default function Hero() {
  const { lang } = useLang();
  const t = homeCopy(lang).hero;
  const c = v3Copy(lang);
  const { contact, pricing, tier, tierReady } = useV3();
  const stats = STATS(lang);
  const sep = lang === "en" ? "," : ".";
  const anchor = priceAnchor(pricing["tiktok"], lang) ?? c.priceAnchorFallback;

  // T0 (không canvas): hiện chữ ngay.
  useEffect(() => {
    if (tierReady && tier === 0) document.documentElement.classList.add("v3-ready");
  }, [tier, tierReady]);

  return (
    <section id="hero" className="v3-hero v3-station" aria-labelledby="v3-hero-title">
      <div className="v3-container v3-hero-layout">
        <p className="v3-kicker"><i aria-hidden /> VDuyStudio — {c.tagline}</p>

        <div className="v3-hero-copy">
          <h1 id="v3-hero-title" className="v3-hero-h1">
            <span className="v3-line"><span>{t.h1a} {t.h1b}</span></span>
            <span className="v3-line"><span className="v3-blue">{t.accent}</span></span>
          </h1>
          <p className="v3-hero-sub v3-fade" style={{ transitionDelay: "1.5s" }}>
            {t.sub} <RotatingText texts={t.rotating} />
          </p>
          <p className="v3-anchor v3-fade" style={{ transitionDelay: "1.65s" }}>{anchor}</p>
          <div className="v3-ctas v3-fade" style={{ transitionDelay: "1.8s" }}>
            <a className="v3-btn v3-btn-primary v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">{t.cta1}</a>
            <a className="v3-btn v3-btn-outline v3-btn-lg" href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}>{c.viewPricing}</a>
          </div>
        </div>

        <ul className="v3-hero-stats v3-fade" style={{ transitionDelay: "2s" }}>
          {stats.map((s, i) => (
            <li key={i}>
              <b><CountUp to={s.to} decimals={s.decimals} separator={sep} suffix={s.suffix} /></b>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
