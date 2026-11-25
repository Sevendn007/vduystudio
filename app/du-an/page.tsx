"use client";

// Trang xem TẤT CẢ dự án — style Premium đồng bộ trang chủ.
// Dữ liệu đọc từ bảng projects (Supabase); DB trống → bộ showcase mặc định.

import VerifiedTick from "@/components/v3/ui/VerifiedTick";
import { useEffect, useState } from "react";
import { IPhone, DEFAULT_PROJECTS } from "@/components/premiumKit";
import SubFooter3 from "@/components/v3/ui/SubFooter3";
import PlatformMark, { platformLabel } from "@/components/v3/ui/PlatformMark";
import { projectLabels, toView } from "@/components/v3/chapters/projects/model";
import "@/app/styles/v3-sub.css";
import { useLang } from "@/lib/i18n";
import { fetchAllProjects, DbProject } from "@/lib/data";

const TX = {
  vi: { back: "← Trang chủ", title: "Tất cả dự án", sub: "Kết quả thực tế đã bàn giao cho khách hàng.", cta: "Liên hệ tư vấn" },
  en: { back: "← Home", title: "All projects", sub: "Real results delivered to our clients.", cta: "Get in touch" },
};

export default function AllProjectsPage() {
  const { lang } = useLang();
  const t = TX[lang];
  const [dbProjects, setDbProjects] = useState<DbProject[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchAllProjects().then((d) => mounted && setDbProjects(d));
    return () => { mounted = false; };
  }, []);

  const L = projectLabels(lang);
  const list = (dbProjects && dbProjects.length > 0 ? dbProjects : DEFAULT_PROJECTS).map((p, i) => toView(p, lang, i));
  const platforms = Array.from(new Set(list.map((p) => p.platform).filter(Boolean))) as string[];
  const [filter, setFilter] = useState("");
  const shown = filter ? list.filter((p) => p.platform === filter) : list;

  return (
    <div className="v3-sub-page pj-root">

      <header className="pj-head">
        <h1>{t.title}</h1>
        <p>{t.sub}</p>
        {platforms.length > 1 && (
          <div className="pj-tabs" role="tablist">
            <button role="tab" aria-selected={!filter} className={!filter ? "on" : ""} onClick={() => setFilter("")}>{lang === "en" ? "All" : "Tất cả"}</button>
            {platforms.map((pl) => (
              <button key={pl} role="tab" aria-selected={filter === pl} className={filter === pl ? "on" : ""} onClick={() => setFilter(pl)}>{platformLabel(pl)}</button>
            ))}
          </div>
        )}
      </header>

      <main className="pj-grid">
        {shown.map((p, i) => {
          const body = (
            <>
              <IPhone src={p.image} fallback={DEFAULT_PROJECTS[i % 4]?.image_url} alt={p.title} size="sm" />
              <div className="pj-info">
                <span className="pj-plat">
                  <PlatformMark platform={p.platform} size={22} />
                  {p.platformName}{p.date ? <em> · {p.date}</em> : null}
                </span>
                <h3>{p.title}</h3>
                <span className="pj-handle">
                  {p.handle ? <>{p.handle}{p.href && <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 17 17 7M9 7h8v8" /></svg>}</> : p.note ?? "\u00a0"}
                </span>
                <span className="pj-result">
                  {p.outcome && (
                    <>
                      <VerifiedTick size={16} check="#0c0d14" />
                      <span>{p.outcome}{p.days != null ? <em> · {L.days(p.days)}</em> : null}</span>
                    </>
                  )}
                </span>
              </div>
            </>
          );
          return p.href ? (
            <a className="pj-card is-link" key={p.id} href={p.href} target="_blank" rel="noreferrer" style={{ animationDelay: `${(i % 8) * 0.06}s` }}>{body}</a>
          ) : (
            <article className="pj-card" key={p.id} style={{ animationDelay: `${(i % 8) * 0.06}s` }}>{body}</article>
          );
        })}
      </main>

      <SubFooter3 />

      <style dangerouslySetInnerHTML={{ __html: `
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
 animation:pjIn .5s ease both;cursor:default;}
@keyframes pjIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.pj-card.is-link{cursor:pointer;}
.pj-card.is-link:hover{border-color:rgba(33,64,240,.6);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.6);}
.pj-info{width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;margin-top:auto;}
.pj-plat{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--muted);letter-spacing:.5px;min-height:24px;}
.pj-plat em{font-style:normal;font-weight:500;}
.pj-info h3{font-weight:700;font-size:17px;margin:0;line-height:1.35;color:#fff;min-height:2.7em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.pj-handle{display:inline-flex;align-items:center;gap:5px;min-height:20px;max-width:100%;font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pj-card.is-link .pj-handle{color:#7f9bff;font-weight:600;}
.pj-result{display:flex;align-items:flex-start;justify-content:center;gap:6px;min-height:2.7em;font-size:12.5px;line-height:1.35;color:#cbd5e1;text-align:left;}
.pj-result svg{flex:none;margin-top:1px;color:#7f9bff;}
.pj-result span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.pj-result em{font-style:normal;color:var(--muted);}
.pj-tabs{display:flex;justify-content:center;flex-wrap:wrap;gap:6px 26px;margin:22px auto 0;max-width:1200px;border-bottom:1px solid var(--line);}
.pj-tabs button{position:relative;padding:12px 2px;border:0;background:none;cursor:pointer;font:inherit;font-size:14px;font-weight:600;color:var(--muted);transition:color .25s;}
.pj-tabs button::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:#2140f0;transform:scaleX(0);transition:transform .35s;}
.pj-tabs button:hover,.pj-tabs button.on{color:#fff;}
.pj-tabs button.on::after{transform:scaleX(1);}

@media(max-width:980px){.pj-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.pj-grid{grid-template-columns:1fr;}}
      ` }} />
    </div>
  );
}
