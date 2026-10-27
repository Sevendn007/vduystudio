"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { homeCopy, SERVICES } from "@/lib/homeCopy";
import { getPlatform, type PriceRow } from "@/lib/services";
import { v3Copy, V3_ACCENT } from "@/lib/v3/copy";
import { href } from "@/lib/v3/routes";
import { useV3 } from "../V3Context";
import Icon3D from "@/components/brand/Icon3D";
import type { DbPriceRow } from "@/lib/data";

const PLACEHOLDER = /^(li[eê]n h[eệ] b[aá]o gi[aá]|contact for quote|)$/i;
const real = (p?: string | null) => Boolean(p && !PLACEHOLDER.test(p.trim()));

type Row = { service: string; duration: string | null; warranty: string | null; price: string | null };

function rowsFor(slug: string, db: DbPriceRow[] | null, lang: "vi" | "en"): Row[] {
  if (db && db.length) return db.map((r) => ({ service: r.service, duration: r.duration, warranty: r.warranty, price: r.price }));
  const fb: PriceRow[] = getPlatform(slug, lang)?.pricing ?? [];
  return fb.map((r) => ({ service: r.service, duration: r.duration, warranty: r.warranty, price: r.price }));
}

export default function ServicesPricing() {
  const { lang } = useLang();
  const s = homeCopy(lang).services;
  const c = v3Copy(lang);
  const { contact, pricing } = useV3();
  const services = SERVICES(lang);
  const [tab, setTab] = useState(services[0].slug);

  const tabRows = rowsFor(tab, pricing[tab] ?? null, lang);
  const showPrice = tabRows.some((r) => real(r.price));

  const miniFor = (slug: string): string => {
    const rows = rowsFor(slug, pricing[slug] ?? null, lang);
    const row = rows.find((r) => /t[ií]ch xanh|verif|badge/i.test(r.service)) ?? rows[0];
    if (!row) return c.priceContact;
    const bits = [row.duration, row.warranty && ((lang === "en" ? "warranty " : "BH ") + row.warranty)].filter(Boolean);
    if (real(row.price)) bits.push(row.price!);
    else bits.push(c.priceContact);
    return bits.join(" · ");
  };

  return (
    <section id="services" className="v3-section v3-station">
      <span id="pm-services" aria-hidden style={{ position: "absolute", marginTop: -90 }} />
      <div className="v3-container">
        <p className="v3-eyebrow">{s.eyebrow}</p>
        <h2 className="v3-h2">{s.h2a} <span className="v3-accent">{s.h2b}</span></h2>
        <p className="v3-lead">{s.lead}</p>

        <div className="v3-kpis">
          <div><b>8.980+</b><span>{c.kpiRequests}</span></div>
          <div><b>5</b><span>{s.kpi2}</span></div>
          <div><b>100%</b><span>{s.kpi3}</span></div>
        </div>

        <div className="v3-svc-grid">
          {services.map((svc, i) => (
            <article className="v3-svc v3-glass" key={svc.slug} style={{ ["--accent" as string]: V3_ACCENT[svc.slug] ?? "#5ef2e6" }}>
              <span className="v3-svc-no" aria-hidden>0{i + 1}</span>
              {svc.slug === "tiktok" && <span className="v3-svc-pop">{s.popular}</span>}
              <Icon3D name={svc.icons[0]} size={56} className="v3-svc-ic" />
              <h3>{svc.name}</h3>
              <p className="v3-svc-desc">{svc.desc}</p>
              <p className="v3-svc-mini">{miniFor(svc.slug)}</p>
              <p className="v3-svc-clients"><b>{svc.clients.toLocaleString()}</b> {s.clients}</p>
              <div className="v3-svc-actions">
                <a className="v3-btn v3-btn-primary v3-btn-sm" href={contact.zalo} target="_blank" rel="noreferrer">{c.quoteZalo}</a>
                <Link className="v3-svc-more" href={href(`/dich-vu/${svc.slug}`)}>{s.more} →</Link>
              </div>
            </article>
          ))}

          <article className="v3-svc v3-svc-cta v3-glass">
            <h3>{s.ctaTitle}</h3>
            <p className="v3-svc-desc">{s.ctaDesc}</p>
            <div className="v3-svc-actions">
              <a className="v3-btn v3-btn-primary v3-btn-sm" href={contact.zalo} target="_blank" rel="noreferrer">{s.ctaBtn}</a>
              <a className="v3-svc-more" href="#process" onClick={(e) => { e.preventDefault(); document.getElementById("process")?.scrollIntoView({ behavior: "smooth" }); }}>{s.ctaBtn2} →</a>
            </div>
          </article>
        </div>

        {/* Bảng giá nhanh */}
        <div id="pricing" className="v3-pricing">
          <h3 className="v3-pricing-title">{c.pricingTitle}</h3>
          <div className="v3-pricing-tabs" role="tablist">
            {services.map((svc) => (
              <button key={svc.slug} role="tab" aria-selected={tab === svc.slug} className={tab === svc.slug ? "is-active" : ""} onClick={() => setTab(svc.slug)}>
                {svc.name}
              </button>
            ))}
          </div>
          <table className="v3-pricing-table">
            <thead>
              <tr>
                <th>{c.pricingCols.service}</th>
                <th>{c.pricingCols.duration}</th>
                <th>{c.pricingCols.warranty}</th>
                {showPrice && <th>{c.pricingCols.price}</th>}
                <th aria-label="CTA" />
              </tr>
            </thead>
            <tbody>
              {tabRows.map((r, i) => (
                <tr key={i}>
                  <td data-label={c.pricingCols.service}>{r.service}</td>
                  <td data-label={c.pricingCols.duration}>{r.duration ?? "—"}</td>
                  <td data-label={c.pricingCols.warranty}>{r.warranty ?? "—"}</td>
                  {showPrice && <td data-label={c.pricingCols.price}>{real(r.price) ? r.price : c.priceContact}</td>}
                  <td>
                    <a className="v3-btn v3-btn-glass v3-btn-sm" href={contact.zalo} target="_blank" rel="noreferrer">{c.quoteZalo}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="v3-pricing-note">{c.pricingNote}</p>
        </div>
      </div>
    </section>
  );
}
