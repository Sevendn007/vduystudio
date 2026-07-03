"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import { PlatformIcon, PersonAvatar, Platform } from "@/components/brand";
import { ProjectCover } from "@/components/art";
import { useLang, Lang, LangToggle } from "@/lib/i18n";
import { siteText, site } from "@/lib/site";
import { fetchFeedbacks, fetchProjects, DbFeedback, DbProject } from "@/lib/data";
import { useContact } from "@/lib/useContact";

function ProjImage({ url, tag }: { url: string | null; tag: string }) {
  const [failed, setFailed] = useState(false);
  if (url && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={tag} loading="lazy" onError={() => setFailed(true)} />;
  }
  return <div className="pr-fallback-img">{tag}</div>;
}

const DEFAULT_PROJECTS = (lang: Lang): DbProject[] => [
  { id: "d1", platform: "tiktok", tag: "TikTok", title: "Thu Hà Schannel", result: "TikTok · 1.30B+ views · 2024", image_url: "/images/d1.png" },
  { id: "d2", platform: "facebook", tag: "Facebook", title: "Hải Triều Schannel", result: "Facebook · 540V Views Data", image_url: "/images/d2.png" },
  { id: "d3", platform: "instagram", tag: "Instagram", title: "Lê Dương Bảo Lâm", result: "Instagram · 2.2VK Views Data", image_url: "/images/d3.png" },
  { id: "d4", platform: "tiktok", tag: "Livestream", title: "Livestream Series", result: "Livestream · Multi-platform · 2024", image_url: "/images/d4.png" },
];

const BRANDS = ["Bệnh viện thẩm mỹ nam an", "Mailisa", "MQ Skin", "Mapstudy", "Cà Mèn", "Tây Bắc TV", "Sypik", "Mecowa"];
const CLIENTS = ["Nghệ sĩ Thanh Hiền", "Nghệ sĩ Kim Phương", "Nghệ sĩ Bữu Đa", "Nghệ sĩ Lê Dương Bảo Lâm", "Ca sĩ Đàm Vĩnh Hưng", "Ca sĩ Chu Bin", "Lộc FUHO", "Hằng Du Mục", "Cú Đấm Thép"];

const SERVICES = [
  { slug: "tiktok", icon: "tiktok", name: "Social Media Verification", desc: "TikTok / Facebook / IG" },
  { slug: "bao-chi", icon: "press", name: "Digital Branding", desc: "PR & Media Booking" },
  { slug: "instagram-threads", icon: "instagram", name: "Strategy & Growth", desc: "Account Management" },
  { slug: "facebook", icon: "facebook", name: "Account Rescue", desc: "Unlock & Recovery" },
];

export default function OptionPremium() {
  const { lang } = useLang();
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
  const projects = dbProjects && dbProjects.length > 0 ? dbProjects : DEFAULT_PROJECTS(lang);

  return (
    <div className="pr-root" id="pr-top">
      {/* BACKGROUND AURA */}
      <div className="pr-aura" />

      {/* NAV */}
      <nav className="pr-nav">
        <a href="#pr-top" className="pr-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="VDuyStudio" className="pr-logo-img" />
        </a>
        <div className="pr-menu">
          <a href="#pr-services">Services</a>
          <a href="#pr-portfolio">Portfolio</a>
          <a href="#pr-feedback">Feedback</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="pr-hero">
        <div className="pr-hero-content">
          <h1 className="pr-hero-title">VDUYSTUDIO</h1>
          <p className="pr-hero-sub">Bold Digital Branding & Social Verification.</p>
        </div>
      </header>

      {/* CLIENTS MARQUEE */}
      <div className="pr-marquee-wrap">
        <div className="pr-marquee">
          <div className="pr-marquee-track">
            {[...BRANDS, ...CLIENTS, ...BRANDS, ...CLIENTS].map((item, i) => (
              <span key={i} className="pr-marquee-item">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section className="pr-section" id="pr-services">
        <div className="pr-container">
          <h2 className="pr-sec-title">SERVICES</h2>
          <div className="pr-services-grid">
            {SERVICES.map((s, i) => (
              <Link href={`/dich-vu/${s.slug}`} className="pr-svc-card" key={i}>
                <div className="pr-svc-info">
                  <h3>{s.name}</h3>
                </div>
                <div className="pr-svc-icon">
                  <PlatformIcon kind={s.icon as Platform} size={28} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO (BENTO GRID) */}
      <section className="pr-section" id="pr-portfolio">
        <div className="pr-container">
          <div className="pr-sec-header">
            <h2 className="pr-sec-title">PORTFOLIO</h2>
            <div className="pr-sec-arrows">← →</div>
          </div>
          <div className="pr-bento">
            {projects.map((p, i) => (
              <div className="pr-card" key={p.id}>
                {/* Background Huge Text */}
                <div className="pr-card-bg-text">
                  {i === 0 ? "Verification 2024" : p.platform?.toUpperCase() || "DIGITAL"}
                </div>
                
                <div className="pr-card-content">
                  <div className="pr-iphone-wrap">
                    <div className="pr-iphone">
                      <ProjImage url={p.image_url} tag={p.tag ?? ""} />
                    </div>
                  </div>
                  <div className="pr-card-info">
                    <h3>{p.title}</h3>
                    <p>{p.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / FOOTER */}
      <footer className="pr-footer" id="pr-feedback">
        <div className="pr-container">
          <h2 className="pr-sec-title">READY TO SCALE?</h2>
          <div className="pr-cta">
            <a href={contact.zalo} target="_blank" rel="noreferrer" className="pr-btn">
              Let's Talk
            </a>
          </div>
          <div className="pr-footbar">
            <span>© 2026 VDuyStudio.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;800&family=Oswald:wght@700&display=swap');
        
        .pr-root {
          --bg: #0b0f15;
          --fg: #e2e8f0;
          --cyan: #38bdf8;
          --cyan-glow: rgba(56, 189, 248, 0.4);
          --card-bg: rgba(15, 23, 42, 0.4);
          --card-border: rgba(56, 189, 248, 0.15);
          font-family: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--fg);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        /* Aura Background */
        .pr-aura {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 50% 30%, rgba(14, 116, 144, 0.15) 0%, transparent 60%),
                      radial-gradient(circle at 20% 80%, rgba(3, 105, 161, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .pr-nav, .pr-hero, .pr-marquee-wrap, .pr-section, .pr-footer {
          position: relative;
          z-index: 10;
        }

        .pr-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Nav */
        .pr-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
        }
        .pr-logo-img {
          height: 32px;
          object-fit: contain;
        }
        .pr-menu {
          display: flex;
          gap: 32px;
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
        }
        .pr-menu a { transition: 0.2s; }
        .pr-menu a:hover { color: #fff; }

        /* Hero */
        .pr-hero {
          padding: 80px 0 100px;
          text-align: center;
        }
        .pr-hero-title {
          font-family: 'Anton', 'Oswald', sans-serif;
          font-size: clamp(60px, 12vw, 160px);
          line-height: 1;
          margin: 0;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -2px;
          text-shadow: 0 0 80px var(--cyan-glow);
        }
        .pr-hero-sub {
          font-size: clamp(16px, 2.5vw, 24px);
          font-weight: 600;
          color: #94a3b8;
          margin-top: 16px;
        }

        /* Marquee */
        .pr-marquee-wrap {
          padding: 24px 0;
          border-top: 1px solid var(--card-border);
          border-bottom: 1px solid var(--card-border);
          background: rgba(15, 23, 42, 0.2);
          overflow: hidden;
          margin-bottom: 80px;
        }
        .pr-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
        .pr-marquee-track {
          display: flex;
          gap: 48px;
          padding-right: 48px;
          align-items: center;
        }
        .pr-marquee-item {
          font-family: 'Oswald', sans-serif;
          font-size: 20px;
          text-transform: uppercase;
          color: #64748b;
          white-space: nowrap;
          letter-spacing: 1px;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Sections */
        .pr-section {
          padding: 40px 0 80px;
        }
        .pr-sec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .pr-sec-title {
          font-family: 'Oswald', sans-serif;
          font-size: 20px;
          color: #94a3b8;
          margin: 0 0 24px;
          letter-spacing: 2px;
        }
        .pr-sec-arrows {
          color: #475569;
          font-size: 20px;
          letter-spacing: 8px;
        }

        /* Services Grid */
        .pr-services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .pr-svc-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 32px 24px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          text-decoration: none;
          color: #fff;
          transition: 0.3s;
        }
        .pr-svc-card:hover {
          background: rgba(56, 189, 248, 0.05);
          border-color: var(--cyan);
          transform: translateY(-4px);
        }
        .pr-svc-info h3 {
          font-size: 20px;
          font-weight: 800;
          margin: 0;
          line-height: 1.2;
        }
        .pr-svc-icon {
          color: var(--cyan);
          opacity: 0.8;
        }

        /* Portfolio Bento */
        .pr-bento {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }
        .pr-card {
          position: relative;
          border-radius: 24px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .pr-card-bg-text {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Anton', sans-serif;
          font-size: clamp(80px, 10vw, 180px);
          color: rgba(255, 255, 255, 0.03);
          white-space: nowrap;
          pointer-events: none;
          z-index: 1;
        }

        .pr-card-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
        }

        /* Specific Bento Layouts */
        .pr-card:nth-child(1) {
          grid-column: span 12;
          height: 520px;
        }
        .pr-card:nth-child(1) .pr-card-content {
          flex-direction: row;
          align-items: center;
          padding: 0 80px;
          justify-content: center;
          gap: 60px;
        }
        .pr-card:nth-child(1) .pr-iphone-wrap {
          transform: rotate(8deg) translateY(20px);
        }

        .pr-card:nth-child(2), .pr-card:nth-child(3) {
          grid-column: span 6;
          height: 480px;
        }
        .pr-card:nth-child(2) .pr-card-content, 
        .pr-card:nth-child(3) .pr-card-content {
          align-items: center;
          padding: 40px;
          text-align: center;
        }

        .pr-card:nth-child(4) {
          grid-column: span 12;
          height: 520px;
        }
        .pr-card:nth-child(4) .pr-card-content {
          flex-direction: row-reverse;
          align-items: center;
          padding: 0 80px;
          justify-content: center;
          gap: 60px;
        }

        .pr-card:nth-child(n+5) {
          grid-column: span 4;
          height: 420px;
        }
        .pr-card:nth-child(n+5) .pr-card-content {
          align-items: center;
          padding: 30px;
          text-align: center;
        }

        /* iPhone Mockup */
        .pr-iphone-wrap {
          perspective: 1000px;
        }
        .pr-iphone {
          width: 240px;
          height: 480px;
          background: #000;
          border: 6px solid #1a202c;
          border-radius: 36px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1);
        }
        .pr-iphone::after {
          content: "";
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 20px;
          background: #000;
          border-radius: 12px;
          z-index: 10;
        }
        .pr-iphone img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pr-fallback-img {
          width: 100%; height: 100%; background: #1e293b; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: bold;
        }

        /* Card Info */
        .pr-card-info {
          margin-top: auto;
          text-align: left;
        }
        .pr-card:nth-child(1) .pr-card-info,
        .pr-card:nth-child(4) .pr-card-info {
          margin-top: 0;
          max-width: 400px;
        }
        .pr-card-info h3 {
          font-family: 'Anton', sans-serif;
          font-size: 32px;
          margin: 0 0 8px;
          letter-spacing: 1px;
          color: #fff;
        }
        .pr-card-info p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }

        /* Footer */
        .pr-footer {
          padding: 80px 0;
          text-align: center;
        }
        .pr-btn {
          display: inline-block;
          background: var(--cyan);
          color: #000;
          font-weight: 800;
          font-size: 20px;
          padding: 20px 60px;
          border-radius: 100px;
          text-decoration: none;
          text-transform: uppercase;
          transition: 0.3s;
          box-shadow: 0 0 40px rgba(56, 189, 248, 0.4);
        }
        .pr-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 60px rgba(56, 189, 248, 0.6);
        }
        .pr-footbar {
          margin-top: 60px;
          color: #475569;
          font-size: 14px;
        }

        /* Mobile */
        @media (max-width: 980px) {
          .pr-services-grid { grid-template-columns: repeat(2, 1fr); }
          .pr-card:nth-child(n) { grid-column: span 12; height: auto; }
          .pr-card:nth-child(n) .pr-card-content { flex-direction: column; padding: 40px 24px; gap: 40px; text-align: center; }
          .pr-card:nth-child(n) .pr-card-info { max-width: 100%; text-align: center; }
          .pr-card:nth-child(1) .pr-iphone-wrap { transform: none; }
          .pr-menu { display: none; }
        }
        @media (max-width: 560px) {
          .pr-services-grid { grid-template-columns: 1fr; }
          .pr-hero-title { font-size: 52px; }
          .pr-nav { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
