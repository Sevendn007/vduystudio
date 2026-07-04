"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPlatform, getPlatforms, PriceRow } from "@/lib/services";
import { site } from "@/lib/site";
import { Mark3D, Wordmark, IPhone, DEFAULT_PROJECTS } from "@/components/premiumKit";
import { PremiumFooter } from "@/components/PremiumFooter";
import { useLang, LangToggle } from "@/lib/i18n";
import { fetchPricing, fetchProjects, DbProject } from "@/lib/data";
import { useContact } from "@/lib/useContact";

// Dự án cùng nền tảng (instagram-threads ~ instagram).
function matchPlatform(p: DbProject, slug: string): boolean {
  if (!p.platform) return false;
  if (p.platform === slug) return true;
  return slug === "instagram-threads" && p.platform === "instagram";
}

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

  // Dự án thật từ DB theo nền tảng — không có thì fallback showcase.
  const [dbProjects, setDbProjects] = useState<DbProject[] | null>(null);
  useEffect(() => {
    let mounted = true;
    fetchProjects().then((d) => mounted && setDbProjects(d));
    return () => { mounted = false; };
  }, []);
  const related = (dbProjects ?? []).filter((p) => matchPlatform(p, platform.slug));
  const projects: DbProject[] = related.length > 0 ? related.slice(0, 3) : DEFAULT_PROJECTS.slice(0, 3);

  // Bảng giá: admin nhập trong DB thì ưu tiên, chưa có thì dùng mặc định.
  const [pricing, setPricing] = useState<PriceRow[]>(platform.pricing);
  useEffect(() => {
    let mounted = true;
    setPricing(platform.pricing);
    fetchPricing(slug).then((rows) => {
      if (!mounted || !rows) return;
      const contactPrice = lang === "en" ? "Contact for quote" : "Liên hệ báo giá";
      setPricing(
        rows.map((r) => ({
          service: r.service,
          duration: r.duration || "—",
          warranty: r.warranty || "—",
          price: r.price || contactPrice,
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
      <div className="sd-space" aria-hidden>
        <div className="sd-stars" />
        <div className="sd-nebula" />
      </div>
      <nav className="sd-nav">
        <Link href="/" className="sd-back" style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span style={{ display: "block", width: 42, height: 35, perspective: 420 }}>
            <Mark3D layers={8} className="nav" alt="VDuyStudio" />
          </span>
          <Wordmark className="nav" />
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
          {projects.map((pj, i) => (
            <div className="sd-project" key={pj.id ?? i}>
              <IPhone src={pj.image_url} fallback={DEFAULT_PROJECTS[i]?.image_url} alt={pj.title} size="sm" />
              <div className="sd-project-body">
                <h4>{pj.title}</h4>
                {pj.result && <p>{pj.result}</p>}
                {pj.tag && <span className="sd-project-tag">{pj.tag}</span>}
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

      <PremiumFooter />

      <style>{`
.sd-root{--fg:#e6f0f2;--muted:#8fadb5;--line:rgba(94,209,214,.16);--panel:rgba(45,212,191,.05);--cyan:#2dd4bf;--bg:#02090c;font-family:var(--font-grotesk),var(--font-inter),system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;position:relative;overflow-x:hidden;padding-bottom:calc(24px + env(safe-area-inset-bottom));}
.sd-root *{box-sizing:border-box;}
.sd-space{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.sd-stars{position:absolute;inset:-100px;background-image:
 radial-gradient(1.2px 1.2px at 25px 35px,#fff,transparent),
 radial-gradient(1px 1px at 125px 88px,rgba(255,255,255,.8),transparent),
 radial-gradient(1.4px 1.4px at 210px 160px,#cfe3ff,transparent),
 radial-gradient(1px 1px at 310px 55px,rgba(255,255,255,.7),transparent),
 radial-gradient(1.1px 1.1px at 80px 220px,#fff,transparent);
 background-size:360px 320px;opacity:.6;}
.sd-nebula{position:absolute;inset:0;background:
 radial-gradient(700px 500px at 82% 4%,rgba(45,212,191,.1),transparent 65%),
 radial-gradient(640px 520px at 8% 30%,rgba(8,145,178,.12),transparent 65%);}
.sd-root>*:not(.sd-space){position:relative;z-index:1;}

.sd-nav{display:flex;justify-content:space-between;align-items:center;padding:12px clamp(16px,4vw,40px);position:sticky;top:0;z-index:20;background:rgba(2,9,12,.8);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);}
.sd-nav-links{display:flex;align-items:center;gap:18px;font-size:14px;font-weight:500;color:var(--muted);}
.sd-nav-cta{border:1px solid var(--accent);color:var(--fg);background:color-mix(in srgb,var(--accent) 14%,transparent);padding:9px 18px;border-radius:100px;font-weight:600;}
.sd-nav-cta:hover{background:var(--accent);color:#04101a;}
.sd-hero{max-width:900px;margin:0 auto;padding:64px clamp(16px,4vw,40px) 46px;text-align:center;}
.sd-crumb{color:var(--muted);font-size:13px;font-weight:600;display:inline-block;margin-bottom:22px;}
.sd-crumb:hover{color:var(--fg);}
.sd-hero-badge{display:inline-block;color:#04101a;font-weight:700;font-size:13px;padding:6px 16px;border-radius:100px;margin-bottom:18px;box-shadow:0 0 30px color-mix(in srgb,var(--accent) 45%,transparent);}
.sd-hero h1{font-size:clamp(32px,5vw,52px);font-weight:800;letter-spacing:-1.5px;margin:0 0 16px;}
.sd-hero p{color:var(--muted);font-size:18px;max-width:560px;margin:0 auto 28px;line-height:1.6;}
.sd-hero-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.sd-btn{display:inline-block;background:var(--accent);color:#04101a;padding:14px 26px;border-radius:100px;font-weight:700;font-size:15px;cursor:pointer;box-shadow:0 10px 30px color-mix(in srgb,var(--accent) 30%,transparent);}
.sd-btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line);box-shadow:none;}
.sd-btn.ghost:hover{border-color:var(--accent);color:var(--accent);}
.sd-btn.light{background:#fff;color:#04101a;}
.sd-btn.ghost-light{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.3);}

.sd-section{max-width:1080px;margin:0 auto;padding:52px clamp(16px,4vw,40px);border-top:1px solid var(--line);}
.sd-tag{color:var(--accent);font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;}
.sd-section h2{font-size:clamp(24px,3.4vw,34px);font-weight:800;letter-spacing:-1px;margin:0 0 30px;}

.sd-services{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.sd-service{display:flex;gap:16px;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:22px;}
.sd-service-num{font-weight:800;color:var(--accent);font-size:15px;}
.sd-service h3{margin:0 0 6px;font-size:17px;font-weight:700;}
.sd-service p{margin:0;color:var(--muted);font-size:14px;line-height:1.55;}

.sd-table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:16px;background:var(--panel);}
.sd-table{width:100%;border-collapse:collapse;font-size:14.5px;min-width:520px;}
.sd-table th{text-align:left;padding:16px 20px;background:rgba(139,147,184,.08);color:var(--muted);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.5px;}
.sd-table td{padding:16px 20px;border-top:1px solid var(--line);}
.sd-table tbody tr:first-child td{border-top:none;}
.sd-price{font-weight:700;color:var(--accent);}
.sd-note{color:var(--muted);font-size:13px;margin:14px 2px 0;}

.sd-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.sd-step{background:var(--panel);border:1px solid var(--line);border-left:2px solid var(--accent);border-radius:14px;padding:22px;}
.sd-step-num{width:34px;height:34px;border-radius:50%;background:var(--accent);color:#04101a;display:flex;align-items:center;justify-content:center;font-weight:800;margin-bottom:14px;}
.sd-step h4{margin:0 0 8px;font-size:16px;font-weight:700;}
.sd-step p{margin:0;color:var(--muted);font-size:13.5px;line-height:1.55;}

.sd-projects{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.sd-project{display:flex;flex-direction:column;align-items:center;gap:16px;background:var(--panel);
 border:1px solid var(--line);border-radius:20px;padding:26px 16px 22px;transition:.25s;}
.sd-project:hover{border-color:rgba(45,212,191,.5);transform:translateY(-4px);}
.sd-project-body{text-align:center;padding:0;}
.sd-project-body h4{margin:0 0 6px;font-size:16px;font-weight:700;}
.sd-project-body p{margin:0;color:var(--muted);font-size:13.5px;}
.sd-project-tag{display:inline-block;margin-top:10px;font-size:10.5px;font-weight:800;letter-spacing:1px;
 text-transform:uppercase;color:#03222e;background:linear-gradient(90deg,#5eead4,#22d3ee);
 padding:4px 12px;border-radius:100px;}

.sd-faq{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.sd-faq-item{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px 24px;}
.sd-faq-q{font-size:16px;font-weight:700;color:var(--fg);margin-bottom:10px;}
.sd-faq-a{color:var(--muted);font-size:14.5px;line-height:1.65;}
@media(max-width:820px){.sd-faq{grid-template-columns:1fr;}}

.sd-others{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.sd-other{display:flex;align-items:center;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;transition:.2s;color:var(--fg);}
.sd-other:hover{transform:translateY(-3px);border-color:var(--accent);}
.sd-other-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;}
.sd-other b{display:block;font-size:15px;}
.sd-other span{font-size:12.5px;color:var(--muted);}
.sd-other-arrow{margin-left:auto;color:var(--muted);font-size:18px;}


@media(max-width:820px){
  .sd-hero{padding-top:46px;}
  .sd-services,.sd-steps,.sd-projects,.sd-others{grid-template-columns:1fr;}
  .sd-steps{grid-template-columns:1fr 1fr;}
}
@media(max-width:520px){.sd-steps{grid-template-columns:1fr;}.sd-nav-links a:not(.sd-nav-cta):not(.sd-lng){display:none;}}
      `}</style>
    </div>
  );
}
