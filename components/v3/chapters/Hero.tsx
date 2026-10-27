"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { homeCopy, STATS } from "@/lib/homeCopy";
import { v3Copy } from "@/lib/v3/copy";
import { useV3 } from "../V3Context";
import CountUp from "../ui/CountUp";
import RotatingText from "../ui/RotatingText";

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
  const { contact, pricing } = useV3();
  const stats = STATS(lang);
  const sep = lang === "en" ? "," : ".";

  const DEFAULT_HANDLE = "yourbrand";
  const [handle, setHandle] = useState(DEFAULT_HANDLE);
  const [editing, setEditing] = useState(false);
  const verified = handle.trim().length > 0;
  const anchor = priceAnchor(pricing["tiktok"], lang) ?? c.priceAnchorFallback;
  const cta1 = handle !== DEFAULT_HANDLE && handle.trim() ? c.ctaHandle(handle.trim()) : t.cta1;

  return (
    <section id="hero" className="v3-hero v3-station" aria-labelledby="v3-hero-title">
      <div className="v3-hero-bg" aria-hidden>
        <div className="v3-nebula" />
        <div className="v3-stars" />
        <div className="v3-stars v3-stars-2" />
      </div>

      <span className="v3-giant-word" aria-hidden>VDUYSTUDIO</span>

      <div className="v3-hero-stage" aria-hidden>
        {/* Poster logo — canvas WebGL (M1) sẽ vẽ đè đúng vị trí này; poster không bao giờ fade. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="v3-hero-logo" src="/brand/video/logo-turn-poster.webp" alt="" width={960} height={864} fetchPriority="high" decoding="async" />
        <span className="v3-hero-glow" />
      </div>

      <div className="v3-hero-content v3-container">
        <p className="v3-chip">{c.heroTag}</p>
        <h1 id="v3-hero-title" className="v3-hero-h1">
          {t.h1a} {t.h1b} <span className="v3-accent">{t.accent}</span>
        </h1>
        <p className="v3-hero-sub">
          {t.sub} <RotatingText texts={t.rotating} />
        </p>

        <p className="v3-anchor">{anchor}</p>

        <div className="v3-ctas">
          <a className="v3-btn v3-btn-primary v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">
            {cta1}
          </a>
          <a className="v3-btn v3-btn-glass v3-btn-lg" href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}>
            {c.viewPricing}
          </a>
        </div>

        <div className="v3-stats">
          {stats.map((s, i) => (
            <div className="v3-stat" key={i}>
              <b><CountUp to={s.to} decimals={s.decimals} separator={sep} suffix={s.suffix} /></b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hồ sơ mô phỏng — lễ trao tích (CSS) + @handle cá nhân hoá */}
      <aside className={`v3-profile${verified ? " is-verified" : ""}`} aria-label={c.simulate}>
        <div className="v3-profile-top">
          <span className="v3-profile-avatar" aria-hidden>{handle.trim().charAt(0).toUpperCase() || "V"}</span>
          <div className="v3-profile-id">
            <b className="v3-profile-name">
              @{handle.trim() || DEFAULT_HANDLE}
              <span className="v3-profile-check" aria-hidden>✓</span>
            </b>
            <span className="v3-profile-sub">{c.profileFollowers}</span>
          </div>
        </div>
        <ol className="v3-profile-steps">
          <li>{homeCopy(lang).services.step1}</li>
          <li>{homeCopy(lang).services.step2}</li>
          <li className="is-done">{homeCopy(lang).services.step3}</li>
        </ol>
        <button className="v3-profile-try" onClick={() => setEditing((v) => !v)}>
          {c.tryName}
        </button>
        {editing && (
          <input
            className="v3-profile-input"
            value={handle}
            maxLength={24}
            placeholder={c.handlePlaceholder}
            onChange={(e) => setHandle(e.target.value.replace(/[^\w.]/g, "").slice(0, 24))}
            autoFocus
            aria-label={c.handlePlaceholder}
          />
        )}
        <span className="v3-profile-note">{c.simulate}</span>
      </aside>

      <a className="v3-scroll-hint" href="#services" onClick={(e) => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}>
        {c.scrollHint} ↓
      </a>
    </section>
  );
}
