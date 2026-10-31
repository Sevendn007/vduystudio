"use client";

// Trang xem TẤT CẢ dự án — style Premium đồng bộ trang chủ.
// Dữ liệu đọc từ bảng projects (Supabase); DB trống → bộ showcase mặc định.

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlatformIcon, Platform } from "@/components/brand";
import { IPhone, DEFAULT_PROJECTS } from "@/components/premiumKit";
import SubHeader3 from "@/components/v3/ui/SubHeader3";
import SubFooter3 from "@/components/v3/ui/SubFooter3";
import "@/app/styles/v3-sub.css";
import { useLang } from "@/lib/i18n";
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
    <div className="v3-sub-page pj-root">
      <SubHeader3 />

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

      <SubFooter3 />

      <style>{`
.pj-root{--bg:#0c0d14;--muted:#94a3b8;--cyan:#60a5fa;--line:rgba(255,255,255,.08);--card:#12131c;
 font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:#f1f5f9;min-height:100vh;}
.pj-root *{box-sizing:border-box;}
.pj-root a{text-decoration:none;color:inherit;}
.pj-head{text-align:center;padding:clamp(40px,7vw,72px) 20px 8px;}
.pj-head h1{font-weight:900;font-size:clamp(30px,5vw,52px);letter-spacing:-0.02em;
 margin:0 0 10px;color:#fff;}
.pj-head p{margin:0;color:var(--muted);font-size:16px;}
.pj-grid{max-width:1200px;margin:0 auto;padding:clamp(28px,4vw,44px) clamp(16px,4vw,28px) 60px;
 display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.pj-card{display:flex;flex-direction:column;align-items:center;gap:16px;padding:26px 16px 22px;
 background:var(--card);border:1px solid var(--line);border-radius:20px;transition:.25s;
 animation:pjIn .5s ease both;}
@keyframes pjIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.pj-card:hover{border-color:rgba(33,64,240,.6);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.6);}
.pj-date{font-size:26px;font-weight:800;letter-spacing:1px;line-height:1;margin:12px 0 0;
 background:linear-gradient(180deg,#93c5fd 0%,#3b82f6 52%,#1d4ed8 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;
 filter:drop-shadow(0 4px 12px rgba(29,78,216,.4));opacity:0.9;}
.pj-info{text-align:center;}
.pj-plat{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--cyan);
 letter-spacing:.5px;margin-bottom:8px;}
.pj-info h3{font-weight:700;font-size:17px;margin:0 0 5px;color:#fff;}
.pj-info p{margin:0;color:var(--muted);font-size:12.5px;}
.pj-tag{display:inline-block;margin-top:10px;font-size:10.5px;font-weight:800;letter-spacing:1px;
 text-transform:uppercase;color:#fff;background:linear-gradient(135deg,#2547f4,#1732c5);
 padding:4px 12px;border-radius:100px;}

@media(max-width:980px){.pj-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.pj-grid{grid-template-columns:1fr;}}
      `}</style>
    </div>
  );
}
