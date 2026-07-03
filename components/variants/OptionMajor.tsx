"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import { PlatformIcon, PersonAvatar, Platform } from "@/components/brand";
import { ProjectCover } from "@/components/art";
import { VDuyBadge, VDuyWordmark } from "@/components/logo";
import { useLang, Lang, LangToggle } from "@/lib/i18n";
import { siteText, site } from "@/lib/site";
import { getProcess } from "@/lib/services";
import { fetchFeedbacks, fetchProjects, DbFeedback, DbProject } from "@/lib/data";
import { useContact } from "@/lib/useContact";

function ProjImage({ url, platform, id, tag }: { url: string | null; platform: string; id: string; tag: string }) {
  const [failed, setFailed] = useState(false);
  if (url && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={tag} loading="lazy" onError={() => setFailed(true)} />;
  }
  return <ProjectCover platform={platform} handle={id} tag={tag} />;
}

const SERVICES = (lang: Lang): { slug: string; icon: Platform; name: string; desc: string }[] => [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", desc: lang === "en" ? "Verification badge · account recovery · livestream & shop cart unlocks" : "Tích xanh chính thống · mở khóa tài khoản · livestream & giỏ hàng" },
  { slug: "facebook", icon: "facebook", name: "Facebook", desc: lang === "en" ? "Verification badge · personal account & fanpage recovery" : "Tích xanh · mở khóa tài khoản cá nhân & Fanpage" },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram / Threads", desc: lang === "en" ? "Official badge & account recovery per Meta policy" : "Tích xanh & mở khóa tài khoản theo chính sách Meta" },
  { slug: "bao-chi", icon: "press", name: lang === "en" ? "Press & PR" : "Báo chí", desc: lang === "en" ? "Press booking · SEO-standard PR writing on major outlets" : "Booking báo chí · viết bài PR chuẩn SEO trên đầu báo lớn" },
];

const DEFAULT_PROJECTS = (lang: Lang): DbProject[] => [
  { id: "d1", platform: "tiktok", tag: lang === "en" ? "TikTok · Verified" : "TikTok · Tích xanh", title: lang === "en" ? "@brand.hub — 2.1M followers" : "@brand.hub — 2.1M follow", result: lang === "en" ? "Verified in 18 days, shop cart unlocked" : "Tích xanh sau 18 ngày, mở khóa giỏ hàng", image_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=70" },
  { id: "d2", platform: "facebook", tag: "Facebook · Fanpage", title: lang === "en" ? "Northern F&B fanpage" : "Fanpage F&B miền Bắc", result: lang === "en" ? "Locked fanpage recovered within 48 hours" : "Khôi phục fanpage bị khóa trong 48 giờ", image_url: null },
  { id: "d3", platform: "bao-chi", tag: lang === "en" ? "Press · PR" : "Báo chí · PR", title: lang === "en" ? "Cosmetics launch campaign" : "Chiến dịch ra mắt mỹ phẩm", result: lang === "en" ? "6 major press outlets booked" : "Booking 6 đầu báo lớn", image_url: null },
];

const TX = {
  vi: {
    nav: ["Dịch vụ", "Quy trình", "Dự án", "Feedback"],
    navCta: "Liên hệ tư vấn",
    heroTag: "SYSTEM_READY: ACCOUNT_PROTECTION",
    heroA: "Xây dựng",
    heroB: "uy tín số",
    heroC: "cho thương hiệu.",
    heroSub: "Giải pháp xác minh, phục hồi và truyền thông số. Tối ưu, minh bạch và cam kết bằng văn bản.",
    heroCta: "Triển khai ngay",
    heroCta2: "Tài liệu dịch vụ",
    svcTag: "MODULE_SERVICES",
    svcTitle: "Nền tảng hỗ trợ",
    svcGo: "Xem chi tiết →",
    valTag: "CORE_VALUES",
    valTitle: "Tiêu chuẩn kỹ thuật",
    values: [
      ["Chính thống", "Tuân thủ chính sách nền tảng, không rủi ro."],
      ["Minh bạch", "Cam kết KPI và timeline bằng văn bản."],
      ["Hỗ trợ", "Cập nhật tiến độ 24/7."],
    ],
    prcTag: "EXECUTION_FLOW",
    prcTitle: "Quy trình triển khai",
    step: "PHASE",
    prjTag: "DEPLOYED_PROJECTS",
    prjTitle: "Kết quả thực tế",
    fbTag: "USER_FEEDBACK",
    fbTitle: "Đánh giá",
    ctaTitle: "Khởi tạo chiến dịch?",
    ctaSub: "Gửi yêu cầu để nhận phản hồi và báo giá ngay.",
    ctaBtn: "Liên hệ VDuyStudio",
  },
  en: {
    nav: ["Services", "Process", "Projects", "Feedback"],
    navCta: "Get in touch",
    heroTag: "SYSTEM_READY: ACCOUNT_PROTECTION",
    heroA: "Building",
    heroB: "digital trust",
    heroC: "for your brand.",
    heroSub: "Verification, recovery and digital PR solutions. Optimized, transparent and guaranteed.",
    heroCta: "Deploy Now",
    heroCta2: "Service Docs",
    svcTag: "MODULE_SERVICES",
    svcTitle: "Supported Platforms",
    svcGo: "View details →",
    valTag: "CORE_VALUES",
    valTitle: "Technical Standards",
    values: [
      ["Official", "Compliant with platform policies."],
      ["Transparent", "Guaranteed timelines and SLAs."],
      ["Supportive", "24/7 status updates."],
    ],
    prcTag: "EXECUTION_FLOW",
    prcTitle: "Implementation",
    step: "PHASE",
    prjTag: "DEPLOYED_PROJECTS",
    prjTitle: "Real results",
    fbTag: "USER_FEEDBACK",
    fbTitle: "Feedback",
    ctaTitle: "Initialize campaign?",
    ctaSub: "Submit your request for immediate quotation.",
    ctaBtn: "Contact VDuyStudio",
  },
};

export default function OptionMajor() {
  const { lang } = useLang();
  const t = TX[lang];
  const st = siteText(lang);
  const contact = useContact();

  const [dbFeedbacks, setDbFeedbacks] = useState<DbFeedback[] | null>(null);
  const [dbProjects, setDbProjects] = useState<DbProject[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchFeedbacks().then((d) => mounted && setDbFeedbacks(d));
    fetchProjects().then((d) => mounted && setDbProjects(d));
    return () => { mounted = false; };
  }, []);

  const feedbacks: DbFeedback[] = dbFeedbacks ?? st.testimonials.map((c, i) => ({ id: `t${i}`, name: c.name, company: c.company, quote: c.quote, rating: 5, image_url: null }));
  const projects = dbProjects ?? DEFAULT_PROJECTS(lang);

  return (
    <div className="mj-root" id="mj-top">
      {/* HEADER */}
      <nav className="mj-nav">
        <a href="#mj-top" className="mj-brand">
          <VDuyWordmark fontSize={14} shine={false} />
        </a>
        <div className="mj-menu">
          <a href="#mj-services">/{t.nav[0]}</a>
          <a href="#mj-process">/{t.nav[1]}</a>
          <a href="#mj-projects">/{t.nav[2]}</a>
        </div>
        <a href={contact.zalo} target="_blank" rel="noreferrer" className="mj-btn small">
          {t.navCta}
        </a>
      </nav>

      {/* HERO */}
      <header className="mj-hero">
        <div className="mj-container">
          <div className="mj-mono-tag">{t.heroTag}</div>
          <h1>{t.heroA} <span>{t.heroB}</span><br/>{t.heroC}</h1>
          <p>{t.heroSub}</p>
          <div className="mj-hero-actions">
            <a href={contact.zalo} target="_blank" rel="noreferrer" className="mj-btn primary">{t.heroCta}</a>
            <a href="#mj-services" className="mj-btn secondary">{t.heroCta2}</a>
          </div>
          <div className="mj-metrics">
            {st.stats.map((s, i) => (
              <div key={i} className="mj-metric">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* SERVICES */}
      <section className="mj-section" id="mj-services">
        <div className="mj-container">
          <div className="mj-mono-tag">{t.svcTag}</div>
          <h2>{t.svcTitle}</h2>
          <div className="mj-grid-4">
            {SERVICES(lang).map((s) => (
              <Link href={`/dich-vu/${s.slug}`} className="mj-card" key={s.slug}>
                <PlatformIcon kind={s.icon} size={32} />
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <span className="mj-link">{t.svcGo}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mj-section alt" id="mj-process">
        <div className="mj-container">
          <div className="mj-mono-tag">{t.prcTag}</div>
          <h2>{t.prcTitle}</h2>
          <div className="mj-process-list">
            {getProcess(lang).map((s, i) => (
              <div className="mj-step" key={i}>
                <div className="mj-step-num">0{i + 1}</div>
                <div className="mj-step-content">
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="mj-section" id="mj-projects">
        <div className="mj-container">
          <div className="mj-mono-tag">{t.prjTag}</div>
          <h2>{t.prjTitle}</h2>
          <Carousel per={3} ariaLabel={t.prjTitle}>
            {projects.map((p) => (
              <div className="mj-card no-pad" key={p.id}>
                <div className="mj-project-img">
                  <ProjImage url={p.image_url} platform={p.platform ?? "tiktok"} id={p.id} tag={p.tag ?? ""} />
                  {p.tag && <span className="mj-ptag">{p.tag}</span>}
                </div>
                <div className="mj-project-body">
                  <h4>{p.title}</h4>
                  {p.result && <p>{p.result}</p>}
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="mj-footer" id="mj-cta">
        <div className="mj-container">
          <div className="mj-cta-box">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSub}</p>
            <a href={contact.zalo} target="_blank" rel="noreferrer" className="mj-btn primary big">{t.ctaBtn}</a>
          </div>
          <div className="mj-foot-bottom">
            <span>© 2026 VDuyStudio. Major Media Theme.</span>
            <span>{site.domain}</span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');
        
        .mj-root {
          --bg: #000000;
          --fg: #aec2d1;
          --fg-bright: #e5f4ff;
          --primary: #0068fa;
          --primary-hover: #0050c8;
          --line: #1a1a1a;
          --card-bg: #080808;
          font-family: 'Host Grotesk', sans-serif;
          background: var(--bg);
          color: var(--fg);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        .mj-container { max-width: 1024px; margin: 0 auto; padding: 0 24px; }
        
        /* Typography */
        h1, h2, h3, h4 { color: var(--fg-bright); font-weight: 500; margin: 0; }
        h1 { font-size: clamp(40px, 6vw, 72px); letter-spacing: -2px; line-height: 1.1; margin: 24px 0; }
        h1 span { color: var(--primary); }
        h2 { font-size: clamp(28px, 4vw, 40px); letter-spacing: -1px; margin-bottom: 40px; }
        p { line-height: 1.6; margin: 0; }
        
        .mj-mono-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #757575;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        /* Nav */
        .mj-nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); z-index: 50; }
        .mj-brand { color: var(--fg-bright); text-decoration: none; }
        .mj-menu { display: flex; gap: 32px; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
        .mj-menu a { color: var(--fg); text-decoration: none; transition: 0.2s; }
        .mj-menu a:hover { color: var(--primary); }

        /* Buttons */
        .mj-btn { display: inline-flex; align-items: center; justify-content: center; font-weight: 500; text-decoration: none; border-radius: 4px; transition: 0.2s; cursor: pointer; }
        .mj-btn.primary { background: var(--primary); color: #fff; padding: 14px 28px; font-size: 16px; }
        .mj-btn.primary:hover { background: var(--primary-hover); }
        .mj-btn.secondary { background: transparent; color: var(--fg-bright); border: 1px solid var(--line); padding: 14px 28px; font-size: 16px; }
        .mj-btn.secondary:hover { border-color: var(--primary); color: var(--primary); }
        .mj-btn.small { padding: 8px 16px; font-size: 13px; border: 1px solid var(--line); color: var(--fg-bright); }
        .mj-btn.small:hover { border-color: var(--primary); }
        
        /* Hero */
        .mj-hero { padding: 120px 0 80px; border-bottom: 1px solid var(--line); }
        .mj-hero p { max-width: 600px; font-size: 18px; color: var(--fg); margin-bottom: 40px; }
        .mj-hero-actions { display: flex; gap: 16px; margin-bottom: 64px; }
        .mj-metrics { display: flex; gap: 48px; border-top: 1px solid var(--line); padding-top: 32px; }
        .mj-metric strong { display: block; font-size: 32px; color: var(--fg-bright); font-weight: 500; }
        .mj-metric span { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #757575; }

        /* Sections */
        .mj-section { padding: 80px 0; border-bottom: 1px solid var(--line); }
        .mj-section.alt { background: #030303; }
        .mj-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        
        /* Cards */
        .mj-card { background: var(--card-bg); border: 1px solid var(--line); padding: 32px; border-radius: 8px; text-decoration: none; display: flex; flex-direction: column; gap: 16px; transition: 0.2s; }
        .mj-card:hover { border-color: #333; transform: translateY(-2px); }
        .mj-card.no-pad { padding: 0; }
        .mj-card h3 { font-size: 20px; }
        .mj-link { margin-top: auto; color: var(--primary); font-family: 'JetBrains Mono', monospace; font-size: 13px; }

        /* Process */
        .mj-process-list { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
        .mj-step { display: flex; padding: 32px; background: var(--card-bg); border-bottom: 1px solid var(--line); }
        .mj-step:last-child { border-bottom: none; }
        .mj-step-num { font-family: 'JetBrains Mono', monospace; color: var(--primary); font-size: 24px; width: 80px; flex-shrink: 0; }
        .mj-step-content h4 { font-size: 20px; margin-bottom: 8px; }

        /* Projects */
        .mj-project-img { aspect-ratio: 16/10; position: relative; border-bottom: 1px solid var(--line); background: #000; }
        .mj-project-img img { width: 100%; height: 100%; object-fit: contain; }
        .mj-ptag { position: absolute; top: 16px; left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px; background: rgba(0,0,0,0.8); border: 1px solid var(--line); color: var(--fg-bright); padding: 4px 8px; border-radius: 4px; }
        .mj-project-body { padding: 24px; }
        .mj-project-body h4 { font-size: 18px; margin-bottom: 8px; }
        .mj-project-body p { font-size: 14px; }

        /* Footer */
        .mj-footer { padding: 80px 0 40px; }
        .mj-cta-box { background: var(--card-bg); border: 1px solid var(--line); border-radius: 8px; padding: 64px; text-align: center; margin-bottom: 80px; }
        .mj-cta-box h2 { margin-bottom: 16px; }
        .mj-cta-box p { margin-bottom: 32px; font-size: 18px; }
        .mj-foot-bottom { display: flex; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 24px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #757575; }

        @media(max-width: 980px) {
          .mj-grid-4 { grid-template-columns: 1fr 1fr; }
          .mj-menu { display: none; }
          .mj-metrics { flex-direction: column; gap: 24px; }
        }
        @media(max-width: 560px) {
          .mj-grid-4 { grid-template-columns: 1fr; }
          .mj-hero { padding: 60px 0; }
          .mj-hero-actions { flex-direction: column; }
          .mj-btn { width: 100%; }
          .mj-step { flex-direction: column; gap: 16px; padding: 24px; }
          .mj-cta-box { padding: 32px 16px; }
        }
      `}</style>
    </div>
  );
}
