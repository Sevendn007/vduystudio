"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPlatform, getPlatforms, PriceRow } from "@/lib/services";
import { site } from "@/lib/site";
import { BrandMark, ProjectCover } from "@/components/art";
import { useLang, LangToggle } from "@/lib/i18n";
import { fetchPricing } from "@/lib/data";
import { useContact } from "@/lib/useContact";

const TX = {
  vi: {
    home: "Trang chủ",
    contactCta: "Liên hệ tư vấn",
    allServices: "← Tất cả dịch vụ",
    serviceOf: (n: string) => `Dịch vụ ${n}`,
    getQuote: "Nhận báo giá",
    viewPricing: "Xem bảng giá",
    catTag: "Hạng mục",
    catTitle: "Chi tiết dịch vụ",
    priceTag: "Bảng giá",
    priceTitle: "Báo giá & thời gian",
    thService: "Dịch vụ",
    thDuration: "Thời gian",
    thWarranty: "Bảo hành",
    thPrice: "Giá",
    priceNote: "* Giá cụ thể phụ thuộc hiện trạng tài khoản. Liên hệ để nhận báo giá chính xác và cam kết bằng văn bản.",
    processTag: "Quy trình",
    processTitle: "Cách chúng tôi làm việc",
    projectsTag: "Dự án liên quan",
    projectsTitle: "Kết quả đã triển khai",
    faqTag: "FAQ",
    faqTitle: "Câu hỏi thường gặp",
    othersTag: "Nền tảng khác",
    othersTitle: "Bạn cũng có thể quan tâm",
    ctaTitle: (n: string) => `Sẵn sàng bắt đầu với ${n}?`,
    ctaSub: "Nhắn tin để được tư vấn và nhận báo giá miễn phí.",
  },
  en: {
    home: "Home",
    contactCta: "Get in touch",
    allServices: "← All services",
    serviceOf: (n: string) => `${n} services`,
    getQuote: "Get a quote",
    viewPricing: "View pricing",
    catTag: "Services",
    catTitle: "What we do",
    priceTag: "Pricing",
    priceTitle: "Pricing & timeline",
    thService: "Service",
    thDuration: "Timeline",
    thWarranty: "Warranty",
    thPrice: "Price",
    priceNote: "* Final pricing depends on your account's current state. Contact us for an exact quote with a written commitment.",
    processTag: "Process",
    processTitle: "How we work",
    projectsTag: "Related projects",
    projectsTitle: "Delivered results",
    faqTag: "FAQ",
    faqTitle: "Frequently asked questions",
    othersTag: "Other platforms",
    othersTitle: "You may also need",
    ctaTitle: (n: string) => `Ready to start with ${n}?`,
    ctaSub: "Message us for free consultation and a quote.",
  },
};

export default function ServiceDetail({ slug }: { slug: string }) {
  const { lang } = useLang();
  const t = TX[lang];
  const contact = useContact();
  const platform = getPlatform(slug, lang) ?? getPlatform(slug, "vi")!;
  const others = getPlatforms(lang).filter((p) => p.slug !== platform.slug);

  // Bảng giá: admin nhập trong DB thì ưu tiên, chưa có thì dùng mặc định.
  const [pricing, setPricing] = useState<PriceRow[]>(platform.pricing);
  useEffect(() => {
    let mounted = true;
    setPricing(platform.pricing);
    fetchPricing(slug).then((rows) => {
      if (!mounted || !rows) return;
      setPricing(
        rows.map((r) => ({
          service: r.service,
          duration: r.duration ?? "—",
          warranty: r.warranty ?? "—",
          price: r.price ?? "—",
        }))
      );
    });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, lang]);

  return (
    <div className="sd-root" style={{ ["--accent" as string]: platform.accent }}>
      <nav className="sd-nav">
        <Link href="/" className="sd-back">
          <BrandMark height={22} />
        </Link>
        <div className="sd-nav-links">
          <Link href="/">{t.home}</Link>
          <LangToggle compact />
          <a href={contact.zalo} target="_blank" rel="noreferrer" className="sd-nav-cta">
            {t.contactCta}
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="sd-hero">
        <Link href="/" className="sd-crumb">
          {t.allServices}
        </Link>
        <div className="sd-hero-badge" style={{ background: platform.accent }}>
          {platform.name}
        </div>
        <h1>{t.serviceOf(platform.name)}</h1>
        <p>{platform.tagline}</p>
        <div className="sd-hero-ctas">
          <a href={contact.zalo} target="_blank" rel="noreferrer" className="sd-btn">
            {t.getQuote}
          </a>
          <a href="#bang-gia" className="sd-btn ghost">
            {t.viewPricing}
          </a>
        </div>
      </header>

      {/* SERVICES */}
      <section className="sd-section">
        <div className="sd-tag">{t.catTag}</div>
        <h2>{t.catTitle}</h2>
        <div className="sd-services">
          {platform.services.map((s, i) => (
            <div className="sd-service" key={i}>
              <div className="sd-service-num">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="sd-section" id="bang-gia">
        <div className="sd-tag">{t.priceTag}</div>
        <h2>{t.priceTitle}</h2>
        <div className="sd-table-wrap">
          <table className="sd-table">
            <thead>
              <tr>
                <th>{t.thService}</th>
                <th>{t.thDuration}</th>
                <th>{t.thWarranty}</th>
                <th>{t.thPrice}</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((row, i) => (
                <tr key={i}>
                  <td data-label={t.thService}>{row.service}</td>
                  <td data-label={t.thDuration}>{row.duration}</td>
                  <td data-label={t.thWarranty}>{row.warranty}</td>
                  <td data-label={t.thPrice} className="sd-price">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sd-note">{t.priceNote}</p>
      </section>

      {/* PROCESS */}
      <section className="sd-section">
        <div className="sd-tag">{t.processTag}</div>
        <h2>{t.processTitle}</h2>
        <div className="sd-steps">
          {platform.process.map((step, i) => (
            <div className="sd-step" key={i}>
              <div className="sd-step-num">{i + 1}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="sd-section">
        <div className="sd-tag">{t.projectsTag}</div>
        <h2>{t.projectsTitle}</h2>
        <div className="sd-projects">
          {platform.projects.map((pj, i) => (
            <div className="sd-project" key={i}>
              <div className="sd-project-cover">
                <ProjectCover platform={platform.slug} handle={pj.title} tag={pj.tag} />
              </div>
              <div className="sd-project-body">
                <h4>{pj.title}</h4>
                <p>{pj.result}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="sd-section">
        <div className="sd-tag">{t.faqTag}</div>
        <h2>{t.faqTitle}</h2>
        <div className="sd-faq">
          {platform.faq.map((f, i) => (
            <div className="sd-faq-item" key={i}>
              <div className="sd-faq-q">{f.q}</div>
              <div className="sd-faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OTHER PLATFORMS */}
      <section className="sd-section">
        <div className="sd-tag">{t.othersTag}</div>
        <h2>{t.othersTitle}</h2>
        <div className="sd-others">
          {others.map((o) => (
            <Link href={`/dich-vu/${o.slug}`} key={o.slug} className="sd-other">
              <span className="sd-other-dot" style={{ background: o.accent }} />
              <div>
                <b>{o.name}</b>
                <span>{o.tagline}</span>
              </div>
              <span className="sd-other-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="sd-cta">
        <h2>{t.ctaTitle(platform.name)}</h2>
        <p>{t.ctaSub}</p>
        <div className="sd-cta-btns">
          <a href={contact.zalo} target="_blank" rel="noreferrer" className="sd-btn light">
            Chat Zalo
          </a>
          <a href={contact.messenger} target="_blank" rel="noreferrer" className="sd-btn ghost-light">
            Messenger
          </a>
        </div>
      </section>

      <footer className="sd-footer">
        <BrandMark height={20} />
        <span>© 2026 {site.name} · {site.domain}</span>
      </footer>

      <style>{`
.sd-root{--fg:#0f1115;--muted:#6b7280;--border:#e7e8ec;--bg:#fafafa;font-family:var(--font-inter),system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;}
.sd-root *{box-sizing:border-box;}
.sd-nav{display:flex;justify-content:space-between;align-items:center;padding:18px 40px;position:sticky;top:0;z-index:20;background:rgba(250,250,250,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);}
.sd-nav-links{display:flex;align-items:center;gap:24px;font-size:14px;font-weight:500;color:var(--muted);}
.sd-nav-cta{background:var(--fg);color:#fff !important;padding:9px 18px;border-radius:8px;font-weight:600;}
.sd-hero{max-width:900px;margin:0 auto;padding:70px 40px 50px;text-align:center;}
.sd-crumb{color:var(--muted);font-size:13px;font-weight:600;display:inline-block;margin-bottom:22px;}
.sd-hero-badge{display:inline-block;color:#fff;font-weight:700;font-size:13px;padding:6px 16px;border-radius:100px;margin-bottom:18px;}
.sd-hero h1{font-size:clamp(32px,5vw,52px);font-weight:800;letter-spacing:-1.5px;margin:0 0 16px;}
.sd-hero p{color:var(--muted);font-size:18px;max-width:560px;margin:0 auto 28px;line-height:1.6;}
.sd-hero-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.sd-btn{display:inline-block;background:var(--accent);color:#08131f;padding:14px 26px;border-radius:10px;font-weight:700;font-size:15px;cursor:pointer;}
.sd-btn.ghost{background:#fff;color:var(--fg);border:1px solid var(--border);}
.sd-btn.light{background:#fff;color:#000;}
.sd-btn.ghost-light{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.3);}

.sd-section{max-width:1080px;margin:0 auto;padding:56px 40px;border-top:1px solid var(--border);}
.sd-tag{color:var(--accent);font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;filter:saturate(1.4) brightness(.75);}
.sd-section h2{font-size:clamp(24px,3.4vw,34px);font-weight:800;letter-spacing:-1px;margin:0 0 32px;}

.sd-services{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.sd-service{display:flex;gap:16px;background:#fff;border:1px solid var(--border);border-radius:14px;padding:22px;}
.sd-service-num{font-weight:800;color:var(--accent);font-size:15px;filter:brightness(.8);}
.sd-service h3{margin:0 0 6px;font-size:17px;font-weight:700;}
.sd-service p{margin:0;color:var(--muted);font-size:14px;line-height:1.55;}

.sd-table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:14px;background:#fff;}
.sd-table{width:100%;border-collapse:collapse;font-size:14.5px;min-width:520px;}
.sd-table th{text-align:left;padding:16px 20px;background:#f4f5f7;color:var(--muted);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.5px;}
.sd-table td{padding:16px 20px;border-top:1px solid var(--border);}
.sd-table tbody tr:first-child td{border-top:none;}
.sd-price{font-weight:700;color:var(--fg);}
.sd-note{color:var(--muted);font-size:13px;margin:14px 2px 0;}

.sd-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.sd-step{background:#fff;border:1px solid var(--border);border-radius:14px;padding:22px;position:relative;}
.sd-step-num{width:34px;height:34px;border-radius:50%;background:var(--accent);color:#08131f;display:flex;align-items:center;justify-content:center;font-weight:800;margin-bottom:14px;}
.sd-step h4{margin:0 0 8px;font-size:16px;font-weight:700;}
.sd-step p{margin:0;color:var(--muted);font-size:13.5px;line-height:1.55;}

.sd-projects{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.sd-project{background:#fff;border:1px solid var(--border);border-radius:16px;overflow:hidden;}
.sd-project-cover{aspect-ratio:4/3;background:#111;line-height:0;}
.sd-project-body{padding:18px;}
.sd-project-body h4{margin:0 0 6px;font-size:16px;font-weight:700;}
.sd-project-body p{margin:0;color:var(--muted);font-size:13.5px;}

.sd-faq{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.sd-faq-item{background:#fff;border:1px solid var(--border);border-radius:12px;padding:22px 24px;}
.sd-faq-q{font-size:16px;font-weight:700;color:var(--fg);margin-bottom:10px;}
.sd-faq-a{color:var(--muted);font-size:14.5px;line-height:1.65;}
@media(max-width:820px){.sd-faq{grid-template-columns:1fr;}}

.sd-others{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.sd-other{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--border);border-radius:14px;padding:18px;transition:.2s;}
.sd-other:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.06);}
.sd-other-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;}
.sd-other b{display:block;font-size:15px;}
.sd-other span{font-size:12.5px;color:var(--muted);}
.sd-other-arrow{margin-left:auto;color:var(--muted);font-size:18px;}

.sd-cta{max-width:1080px;margin:40px auto;background:linear-gradient(135deg,#0f1115,#1d1f26);border-radius:24px;padding:70px 40px;text-align:center;color:#fff;}
.sd-cta h2{font-size:clamp(26px,4vw,40px);font-weight:800;margin:0 0 14px;letter-spacing:-1px;}
.sd-cta p{color:#b8bac2;margin:0 0 28px;}
.sd-cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.sd-footer{max-width:1080px;margin:0 auto;padding:30px 40px 70px;display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:13px;border-top:1px solid var(--border);flex-wrap:wrap;gap:12px;}

@media(max-width:820px){
  .sd-nav{padding:16px 20px;}
  .sd-hero{padding:50px 20px 40px;}
  .sd-section{padding:44px 20px;}
  .sd-services,.sd-steps,.sd-projects,.sd-others{grid-template-columns:1fr;}
  .sd-steps{grid-template-columns:1fr 1fr;}
  .sd-cta{margin:30px 20px;padding:50px 24px;}
  .sd-footer{padding:30px 20px 70px;}
}
@media(max-width:520px){.sd-steps{grid-template-columns:1fr;}.sd-nav-links a:not(.sd-nav-cta){display:none;}}
      `}</style>
    </div>
  );
}
