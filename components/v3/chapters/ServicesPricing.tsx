"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { homeCopy, SERVICES } from "@/lib/homeCopy";
import { getPlatform, type PriceRow } from "@/lib/services";
import { v3Copy } from "@/lib/v3/copy";
import { href } from "@/lib/v3/routes";
import { fmtNum, fmtPrice, isTermWarranty, realPrice, stripNo } from "@/lib/v3/format";
import { useV3 } from "../V3Context";
import Icon3 from "../ui/Icon3";
import type { DbPriceRow } from "@/lib/data";

type Row = { service: string; duration: string | null; warranty: string | null; price: string | null };

function rowsFor(slug: string, db: DbPriceRow[] | null, lang: "vi" | "en"): Row[] {
  if (db && db.length) return db.map((r) => ({ service: r.service, duration: r.duration, warranty: r.warranty, price: r.price }));
  const fb: PriceRow[] = getPlatform(slug, lang)?.pricing ?? [];
  return fb.map((r) => ({ service: r.service, duration: r.duration, warranty: r.warranty, price: r.price }));
}

// DỊCH VỤ: "mục lục biên tập" trên nền mực — tên nền tảng chữ nén khổng lồ, rê chuột thì
// vệt cobalt quét lên từ đáy, sticker icon bật ra. Bảng giá nhanh ngay bên dưới, 1 CTA duy nhất.
export default function ServicesPricing() {
  const { lang } = useLang();
  const s = homeCopy(lang).services;
  const c = v3Copy(lang);
  const { contact, pricing } = useV3();
  const services = SERVICES(lang);
  const [tab, setTab] = useState(services[0].slug);

  const tabRows = rowsFor(tab, pricing[tab] ?? null, lang);
  const showPrice = tabRows.some((r) => realPrice(r.price));
  const L = lang === "en" ? { time: "Time", warranty: "Warranty", from: "Price" } : { time: "Thời gian", warranty: "Bảo hành", from: "Giá" };

  const metaFor = (slug: string) => {
    const rows = rowsFor(slug, pricing[slug] ?? null, lang);
    const row = rows.find((r) => /t[ií]ch xanh|verif|badge/i.test(r.service)) ?? rows[0];
    if (!row) return [];
    const out: [string, string][] = [];
    if (row.duration) out.push([L.time, row.duration]);
    if (isTermWarranty(row.warranty)) out.push([L.warranty, row.warranty!]);
    if (realPrice(row.price)) out.push([L.from, fmtPrice(row.price!, lang)]);
    return out;
  };

  return (
    <section id="services" className="v3-svc v3-station v3-dark">
      <div className="v3-container">
        <div className="v3-svc-head">
          <p className="v3-eyebrow">{stripNo(s.eyebrow)} · {fmtNum(8980, lang)}+ {c.kpiRequests}</p>
          <h2 className="v3-xl">{s.h2a} <em className="v3-serif">{s.h2b}</em></h2>
          <p className="v3-lead">{s.lead}</p>
        </div>

        <ol className="v3-index">
          {services.map((svc, i) => {
            const meta = metaFor(svc.slug);
            return (
              <li key={svc.slug} className="v3-index-row">
                <Link href={href(`/dich-vu/${svc.slug}`)} className="v3-index-link" aria-label={`${svc.name} — ${s.more}`}>
                  <span className="v3-index-no">0{i + 1}</span>
                  <span className="v3-index-name">
                    {svc.name}
                    <span className="v3-index-pop" aria-hidden><Icon3 name={svc.icons[0]} size={28} /></span>
                  </span>
                  <span className="v3-index-info">
                    <span className="v3-index-desc">{svc.desc}</span>
                    <span className="v3-index-meta">
                      {meta.map(([k, v]) => <span key={k}>{k} <b>{v}</b></span>)}
                      <span><b>{fmtNum(svc.clients, lang)}</b> {s.clients}</span>
                    </span>
                  </span>
                  <span className="v3-index-go" aria-hidden>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
                  </span>
                  {svc.slug === "tiktok" && <span className="v3-index-hot">{s.popular}</span>}
                </Link>
              </li>
            );
          })}
        </ol>

        <div id="pricing" className="v3-pricing">
          <div className="v3-pricing-head">
            <h3 className="v3-pricing-title">{c.pricingTitle}</h3>
            <div className="v3-pricing-tabs" role="tablist" aria-label={c.pricingTitle}>
              {services.map((svc) => (
                <button key={svc.slug} role="tab" aria-selected={tab === svc.slug} className={tab === svc.slug ? "is-active" : ""} onClick={() => setTab(svc.slug)}>
                  {svc.name}
                </button>
              ))}
            </div>
          </div>
          <table className="v3-pricing-table">
            <thead>
              <tr>
                <th>{c.pricingCols.service}</th>
                <th>{c.pricingCols.duration}</th>
                <th>{c.pricingCols.warranty}</th>
                {showPrice && <th>{c.pricingCols.price}</th>}
              </tr>
            </thead>
            <tbody>
              {tabRows.map((r, i) => (
                <tr key={i}>
                  <td data-label={c.pricingCols.service}>{r.service}</td>
                  <td data-label={c.pricingCols.duration}>{r.duration || "—"}</td>
                  <td data-label={c.pricingCols.warranty}>{r.warranty || "—"}</td>
                  {showPrice && (
                    <td data-label={c.pricingCols.price} className={realPrice(r.price) ? "v3-price" : "v3-price-na"}>
                      {realPrice(r.price) ? fmtPrice(r.price!, lang) : c.priceContact}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="v3-pricing-foot">
            <p>{c.pricingNote}</p>
            <a className="v3-btn v3-btn-blue v3-btn-lg" href={contact.zalo} target="_blank" rel="noreferrer">{c.quoteZalo} →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
