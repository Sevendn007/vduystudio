"use client";

// Trang xem TẤT CẢ dự án — style Premium đồng bộ trang chủ.
// Dữ liệu đọc từ bảng projects (Supabase); DB trống → bộ showcase mặc định.

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlatformIcon, Platform } from "@/components/brand";
import { Mark3D, Wordmark, IPhone, DEFAULT_PROJECTS } from "@/components/premiumKit";
import { useLang, LangToggle } from "@/lib/i18n";
import { fetchAllProjects, DbProject } from "@/lib/data";
import { useContact } from "@/lib/useContact";

const PLATFORM_NAME: Record<string, string> = {
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
  "instagram-threads": "Instagram",
  "bao-chi": "Báo chí",
};
const ICON_OF: Record<string, Platform> = {
  tiktok: "tiktok",
  facebook: "facebook",
  instagram: "instagram",
  "instagram-threads": "instagram",
  "bao-chi": "press",
};

const TX = {
  vi: { back: "← Trang chủ", title: "Tất cả dự án", sub: "Kết quả thực tế đã bàn giao cho khách hàng.", cta: "Liên hệ tư vấn" },
  en: { back: "← Home", title: "All projects", sub: "Real results delivered to our clients.", cta: "Get in touch" },
};

export default function AllProjectsPage() {
  const { lang } = useLang();
  const t = TX[lang];
  const contact = useContact();
  const [dbProjects, setDbProjects] = useState<DbProject[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchAllProjects().then((d) => mounted && setDbProjects(d));
    return () => { mounted = false; };
  }, []);

  const projects = dbProjects && dbProjects.length > 0 ? dbProjects : DEFAULT_PROJECTS;

  return (
    <div className="pj-root">
      <nav className="pj-nav">
        <Link href="/" className="pj-brand">
          <span className="pj-brand-spin">
            <Mark3D layers={8} className="nav" alt="VDuyStudio" />
          </span>
          <Wordmark className="nav" />
        </Link>
        <div className="pj-nav-right">
          <Link href="/" className="pj-back">{t.back}</Link>
          <LangToggle compact />
        </div>
      </nav>

      <header className="pj-head">
        <h1>{t.title}</h1>
        <p>{t.sub}</p>
      </header>

      <main className="pj-grid">
        {projects.map((p, i) => {
          const platformName = PLATFORM_NAME[p.platform ?? ""] ?? p.platform ?? "TikTok";
          const icon = ICON_OF[p.platform ?? ""] ?? "tiktok";
          return (
            <article className="pj-card" key={p.id} style={{ animationDelay: `${(i % 8) * 0.06}s` }}>
              <IPhone src={p.image_url} fallback={DEFAULT_PROJECTS[i % 4]?.image_url} alt={p.title} size="sm" />
              {p.date && <div className="pj-date" aria-hidden>{p.date}</div>}
              <div className="pj-info">
                <span className="pj-plat">
                  <PlatformIcon kind={icon} size={22} />
                  {platformName}
                </span>
                <h3>{p.title}</h3>
                {p.result && <p>{p.result}</p>}
                {p.tag && <span className="pj-tag">{p.tag}</span>}
              </div>
            </article>
          );
        })}
      </main>

      <footer className="pj-foot">
        <a href={contact.zalo} target="_blank" rel="noreferrer" className="pj-btn">{t.cta}</a>
      </footer>

      <style>{`
.pj-root{--bg:#02090c;--muted:#8fadb5;--cyan:#2dd4bf;--line:rgba(94,209,214,.16);--card:#05141a;
 font-family:var(--pm-font-body);background:var(--bg);color:#e6f0f2;min-height:100vh;
 padding-bottom:calc(24px + env(safe-area-inset-bottom));}
.pj-root *{box-sizing:border-box;}
.pj-root a{text-decoration:none;color:inherit;}
.pj-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:14px;
 padding:12px clamp(16px,4vw,36px);background:rgba(2,9,12,.8);backdrop-filter:blur(16px);border-bottom:1px solid var(--line);}
.pj-brand{display:flex;align-items:center;gap:11px;}
.pj-brand-spin{display:block;width:46px;height:38px;perspective:420px;flex-shrink:0;}
.pj-nav-right{display:flex;align-items:center;gap:16px;}
.pj-back{font-size:13.5px;font-weight:600;color:var(--muted);transition:.2s;}
.pj-back:hover{color:#fff;}
.pj-head{text-align:center;padding:clamp(40px,7vw,72px) 20px 8px;}
.pj-head h1{font-family:var(--pm-font-heading);font-weight:700;font-size:clamp(30px,5vw,52px);letter-spacing:1px;
 text-transform:uppercase;margin:0 0 10px;
 background:linear-gradient(180deg,#fff 20%,#9db3c5 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.pj-head p{margin:0;color:var(--muted);font-size:15px;}
.pj-grid{max-width:1200px;margin:0 auto;padding:clamp(28px,4vw,44px) clamp(16px,4vw,28px) 0;
 display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.pj-card{display:flex;flex-direction:column;align-items:center;gap:16px;padding:26px 16px 22px;
 background:var(--card);border:1px solid var(--line);border-radius:20px;transition:.25s;
 animation:pjIn .5s ease both;}
@keyframes pjIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.pj-card:hover{border-color:rgba(45,212,191,.5);transform:translateY(-4px);box-shadow:0 20px 44px rgba(0,0,0,.45);}
.pj-date{font-family:var(--pm-font-display);font-size:26px;letter-spacing:1px;line-height:1;margin:12px 0 0;
 background:linear-gradient(180deg,#7dd3fc 0%,#0ea5e9 52%,#075985 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;
 filter:drop-shadow(0 4px 12px rgba(2,60,90,.5));opacity:0.85;}
.pj-info{text-align:center;}
.pj-plat{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--cyan);
 letter-spacing:.5px;margin-bottom:8px;}
.pj-info h3{font-family:var(--pm-font-heading);font-weight:700;font-size:17px;margin:0 0 5px;}
.pj-info p{margin:0;color:var(--muted);font-size:12.5px;}
.pj-tag{display:inline-block;margin-top:10px;font-size:10.5px;font-weight:800;letter-spacing:1px;
 text-transform:uppercase;color:#03222e;background:linear-gradient(90deg,#5eead4,#22d3ee);
 padding:4px 12px;border-radius:100px;}
.pj-foot{text-align:center;padding:44px 20px 24px;}
.pj-btn{display:inline-block;background:var(--cyan);color:#03222e;font-weight:800;font-size:15px;text-transform:uppercase;
 letter-spacing:1px;padding:15px 44px;border-radius:100px;transition:.3s;box-shadow:0 0 38px rgba(45,212,191,.35);}
.pj-btn:hover{transform:scale(1.04);}
@media(max-width:980px){.pj-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.pj-grid{grid-template-columns:1fr;}.pj-back{display:none;}}
      `}</style>
    </div>
  );
}
