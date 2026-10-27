"use client";
import dynamic from "next/dynamic";
import { useLang } from "@/lib/i18n";
import { homeCopy, STATS } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";
import { useV3 } from "../V3Context";
import CountUp from "../ui/CountUp";
import RotatingText from "../ui/RotatingText";
import Icon3D from "@/components/brand/Icon3D";

// Logo V-D 3D thật (three.js) — chỉ nạp ở T2 (desktop có WebGL); T0/T1 dùng ảnh PNG
// render sẵn từ chính cảnh 3D này (public/brand/v3/logo-vd-3d.png).
const LogoCanvas = dynamic(() => import("../canvas/V3LogoCanvas"), { ssr: false });

const PLACEHOLDER_PRICE = /^(li[eê]n h[eệ] b[aá]o gi[aá]|contact for quote|)$/i;

function priceAnchor(
  rows: { service: string; duration: string | null; warranty: string | null; price: string | null }[] | null,
  lang: "vi" | "en"
): string | null {
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
  const useCanvas = tierReady && tier >= 2;

  return (
    <section id="hero" className="v3-hero v3-station" aria-labelledby="v3-hero-title">
      <span className="v3-giant-word" aria-hidden>VDUYSTUDIO</span>

      <div className="v3-container v3-hero-grid">
        <div className="v3-hero-copy">
          <p className="v3-eyebrow">{c.tagline} · {c.heroTag}</p>
          <h1 id="v3-hero-title" className="v3-hero-h1">
            {t.h1a}<br />{t.h1b}<br /><em className="v3-blue">{t.accent}</em>
          </h1>
          <p className="v3-hero-sub">
            {t.sub} <RotatingText texts={t.rotating} />
          </p>
          <p className="v3-anchor">{anchor}</p>
          <div className="v3-ctas">
            <a className="v3-btn v3-btn-primary v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">
              {t.cta1}
            </a>
            <a
              className="v3-btn v3-btn-outline v3-btn-lg"
              href="#pricing"
              onClick={(e) => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              {c.viewPricing}
            </a>
          </div>
        </div>

        <div className="v3-hero-stage" aria-hidden>
          {useCanvas ? (
            <LogoCanvas />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="v3-hero-logo-img" src="/brand/v3/logo-vd-3d.png" alt="" width={1024} height={1024} fetchPriority="high" decoding="async" />
          )}
          <Icon3D name="verify" size={96} className="v3-hero-ic i1" />
          <Icon3D name="tiktok" size={96} className="v3-hero-ic i2" />
          <Icon3D name="facebook" size={96} className="v3-hero-ic i3" />
          <Icon3D name="instagram" size={96} className="v3-hero-ic i4" />
        </div>
      </div>

      <div className="v3-container v3-rules">
        {stats.map((s, i) => (
          <div className="v3-rule" key={i}>
            <b><CountUp to={s.to} decimals={s.decimals} separator={sep} suffix={s.suffix} /></b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
