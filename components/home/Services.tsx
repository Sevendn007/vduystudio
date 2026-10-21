"use client";

// 6.5 Dịch vụ — bento giàu nội dung (không còn thẻ trống):
//  - Hàng 1: tiêu đề + lời dẫn + số liệu tổng | thẻ TikTok nổi bật kèm "hồ sơ đang lên tích" động.
//  - Hàng 2: Facebook | Instagram/Threads | Báo chí (icon 3D + danh sách hạng mục).
//  - Hàng 3: Website (cửa sổ code động) | thẻ tư vấn nhanh (CTA Zalo).
// Hiệu ứng: đèn spotlight theo chuột + viền sáng, icon 3D nghiêng khi hover (CSS, không WebGL).

import Link from "next/link";
import { Fragment } from "react";
import type { CSSProperties, PointerEvent as RPointerEvent } from "react";
import Icon3D from "@/components/brand/Icon3D";
import CountUp from "@/components/rb/CountUp/CountUp";
import { SectionHeading } from "@/components/home/Sections";
import { useLang } from "@/lib/i18n";
import { SERVICES, homeCopy, type HomeService } from "@/lib/homeCopy";
import { getPlatforms } from "@/lib/services";
import { useContact } from "@/lib/useContact";

const ACCENT: Record<string, string> = {
  tiktok: "94, 242, 230",
  facebook: "96, 150, 255",
  "instagram-threads": "236, 120, 200",
  "bao-chi": "255, 190, 92",
  website: "170, 140, 255",
};

function spot(e: RPointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Services() {
  const { lang } = useLang();
  const t = homeCopy(lang).services;
  const contact = useContact();
  const sep = lang === "en" ? "," : ".";
  const list = SERVICES(lang);
  const by = (slug: string) => list.find((s) => s.slug === slug)!;
  const items = (slug: string, n = 3) =>
    (getPlatforms(lang).find((p) => p.slug === slug)?.services ?? []).slice(0, n).map((s) => s.title);
  const total = list.reduce((a, s) => a + s.clients, 0);

  const foot = (s: HomeService) => (
    <span className="svc-foot">
      <span className="chip chip-sm">
        <b><CountUp to={s.clients} separator={sep} duration={1.8} /></b>&nbsp;{t.clients}
      </span>
      <span className="svc-more">{t.more} <i aria-hidden>→</i></span>
    </span>
  );

  const card = (s: HomeService, className: string, children: React.ReactNode) => (
    <Link
      href={`/dich-vu/${s.slug}`}
      className={`svc ${className}`}
      style={{ "--ac": ACCENT[s.slug] } as CSSProperties}
      onPointerMove={spot}
      aria-label={`${s.name} — ${t.more}`}
    >
      <span className="svc-spot" aria-hidden />
      {children}
    </Link>
  );

  const tk = by("tiktok");
  const web = by("website");

  return (
    <section className="section container" id="services" aria-labelledby="services-title">
      <div className="svc-grid">
        {/* intro */}
        <div className="svc-intro">
          <SectionHeading id="services-title" eyebrow={t.eyebrow} a={t.h2a} b={t.h2b} />
          <p className="svc-lead">{t.lead}</p>
          <ul className="svc-kpis">
            <li><b><CountUp to={total} separator={sep} duration={2} />+</b><span>{t.kpi1}</span></li>
            <li><b>5</b><span>{t.kpi2}</span></li>
            <li><b>100%</b><span>{t.kpi3}</span></li>
          </ul>
        </div>

        {/* TikTok nổi bật */}
        {card(tk, "svc-tiktok", <>
          <span className="svc-body">
            <span className="svc-icons" aria-hidden>
              <Icon3D name="tiktok" size={112} className="svc-ic" />
              <Icon3D name="verify" size={54} className="svc-ic svc-ic2" />
            </span>
            <span className="svc-badge">{t.popular}</span>
            <h3>{tk.name}</h3>
            <p>{tk.desc}</p>
            <span className="svc-tags">
              {items("tiktok", 4).map((x) => <span key={x}>{x.replace(/\s*\(.*\)/, "")}</span>)}
            </span>
            {foot(tk)}
          </span>
          {/* mô phỏng hồ sơ đang được xác minh */}
          <span className="svc-profile" aria-hidden>
            <span className="pf-cover" />
            <span className="pf-avatar"><Icon3D name="tiktok" size={44} /></span>
            <span className="pf-name">@yourbrand <i className="pf-check">✓</i></span>
            <span className="pf-meta"><b>2.1M</b> followers · <b>48.6M</b> likes</span>
            <span className="pf-steps">
              <span className="on">{t.step1}</span>
              <span className="on">{t.step2}</span>
              <span className="pf-done">{t.step3}</span>
            </span>
            <span className="pf-bar"><i /></span>
            <span className="pf-grid"><i /><i /><i /></span>
          </span>
        </>)}

        {(["facebook", "instagram-threads", "bao-chi"] as const).map((slug) => {
          const s = by(slug);
          return (
            <Fragment key={slug}>{card(s, `svc-mid svc-${slug}`, <>
              <span className="svc-body">
                <span className="svc-icons" aria-hidden>
                  {s.icons.map((ic, k) => <Icon3D key={ic} name={ic} size={84} className={`svc-ic${k ? " svc-ic2b" : ""}`} />)}
                </span>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <ul className="svc-list">
                  {items(slug).map((x) => <li key={x}>{x}</li>)}
                </ul>
                {foot(s)}
              </span>
            </>)}</Fragment>
          );
        })}

        {/* Website */}
        {card(web, "svc-web", <>
          <span className="svc-body">
            <span className="svc-icons" aria-hidden>
              <Icon3D name="website" size={96} className="svc-ic" />
            </span>
            <h3>{web.name}</h3>
            <p>{web.desc}</p>
            <span className="svc-tags">
              {items("website").map((x) => <span key={x}>{x}</span>)}
            </span>
            {foot(web)}
          </span>
          <span className="svc-code" aria-hidden>
            <span className="cw-bar"><i /><i /><i /><em>vduystudio.com</em></span>
            <span className="cw-lines">
              <span style={{ width: "62%" }} />
              <span style={{ width: "84%" }} className="a" />
              <span style={{ width: "48%" }} />
              <span style={{ width: "72%" }} className="b" />
              <span style={{ width: "56%" }} />
              <span style={{ width: "90%" }} className="a" />
            </span>
            <span className="cw-score"><b>98</b> PageSpeed</span>
          </span>
        </>)}

        {/* CTA tư vấn */}
        <div className="svc svc-cta" onPointerMove={spot} style={{ "--ac": "94, 242, 230" } as CSSProperties}>
          <span className="svc-spot" aria-hidden />
          <span className="svc-body">
            <Icon3D name="chat" size={88} className="svc-ic" />
            <h3>{t.ctaTitle}</h3>
            <p>{t.ctaDesc}</p>
            <span className="svc-cta-btns">
              <a className="btn btn-primary" href={contact.zalo} target="_blank" rel="noreferrer">{t.ctaBtn}</a>
              <a className="btn btn-glass" href="#process">{t.ctaBtn2}</a>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
