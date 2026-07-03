"use client";

// PREMIUM — thiết kế theo mockup "dark-teal editorial": ít chữ, nhiều hình
// ảnh chất lượng cao. Toàn bộ dữ liệu động (dự án, feedback, liên hệ) dùng
// chung lớp Supabase với bản Galaxy — DB trống thì fallback bộ showcase
// mặc định bên dưới (4 ảnh d1–d4 trong khung iPhone).

import { useEffect, useState } from "react";
import Link from "next/link";
import { PersonAvatar } from "@/components/brand";
import { useLang, LangToggle } from "@/lib/i18n";
import { siteText, site } from "@/lib/site";
import { getProcess } from "@/lib/services";
import { fetchFeedbacks, fetchProjects, DbFeedback, DbProject } from "@/lib/data";
import { useContact } from "@/lib/useContact";

/* ================= dữ liệu tĩnh ================= */

const BRANDS = [
  "Bệnh viện Thẩm mỹ Nam An",
  "Mailisa",
  "MQ Skin",
  "Mapstudy",
  "Cà Mèn",
  "Tây Bắc TV",
  "Sypik",
  "Mecowa",
];

const CLIENTS = [
  "Nghệ sĩ Thanh Hiền",
  "Nghệ sĩ Kim Phương",
  "Nghệ sĩ Bữu Đa",
  "Nghệ sĩ Lê Dương Bảo Lâm",
  "Ca sĩ Đàm Vĩnh Hưng",
  "Ca sĩ Chu Bin",
  "Lộc FUHO",
  "Hằng Du Mục",
  "Cú Đấm Thép",
];

// Dự án showcase khi DB trống — 4 profile thật trong khung iPhone.
type ShowProject = DbProject & {
  big?: string;
  small?: string;
  handle?: string;
  stats?: [string, string][];
};

const DEFAULT_PROJECTS: ShowProject[] = [
  {
    id: "p1", platform: "tiktok", tag: "Verification",
    title: "Khuyến Dương", handle: "@khuyenduong299",
    result: "TikTok · 1,7Tr Follower · 62,7Tr Thích",
    image_url: "/images/d1.png", big: "Verification", small: "TikTok",
  },
  {
    id: "p2", platform: "tiktok", tag: "Verification",
    title: "Chí Khang", handle: "@chikhang0311",
    result: "TikTok · 2,7Tr Follower · 239,3Tr Thích",
    image_url: "/images/d2.png", big: "2,7Tr", small: "Follower",
  },
  {
    id: "p3", platform: "tiktok", tag: "Verification",
    title: "Chuyện Ma Chú 3 Duy", handle: "@chu3duy0305",
    result: "TikTok · 3,2Tr Follower · 148,5Tr Thích",
    image_url: "/images/d3.png", big: "3,2Tr", small: "Follower",
  },
  {
    id: "p4", platform: "tiktok", tag: "Verification",
    title: "Mai Trí Thức", handle: "@maitrithuc2020",
    result: "TikTok · 2,2Tr Follower · 178,1Tr Thích",
    image_url: "/images/d4.png", big: "TikTok", small: "Creator",
    stats: [["2,2Tr", "Follower"], ["178,1Tr", "Lượt thích"], ["34,9Tr", "Top video"]],
  },
];

const SVC_ICONS: Record<string, JSX.Element> = {
  verify: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M2 21v-.8A7 7 0 0 1 13 14.5" />
      <path d="m15 18 2.4 2.4L22 15.8" />
    </svg>
  ),
  brand: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.2 2.3 2.3 4.7-5" />
    </svg>
  ),
  growth: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  ),
  mega: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 15-7v16L3 14v-3Z" />
      <path d="M11.6 17.5A3 3 0 1 1 6 15.6" />
      <path d="M21 9v4" />
    </svg>
  ),
};

const SERVICES = [
  { slug: "tiktok", icon: "verify", name: ["Social Media", "Verification"] },
  { slug: "facebook", icon: "brand", name: ["Digital", "Branding"] },
  { slug: "instagram-threads", icon: "growth", name: ["Strategy &", "Growth"] },
  { slug: "bao-chi", icon: "mega", name: ["PR &", "Booking"] },
];

/* ================= components ================= */

// Khung iPhone: viền titan, Dynamic Island, phản chiếu mặt kính.
function IPhone({ src, alt, size = "md", tilt }: { src: string | null; alt: string; size?: "lg" | "md" | "sm"; tilt?: "l" | "r" }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`pm-phone ${size} ${tilt === "l" ? "tilt-l" : tilt === "r" ? "tilt-r" : ""}`}>
      <div className="pm-phone-screen">
        {src && !failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
        ) : (
          <div className="pm-phone-empty">{alt}</div>
        )}
        <span className="pm-island" />
      </div>
    </div>
  );
}

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

  const feedbacks: DbFeedback[] =
    dbFeedbacks ??
    st.testimonials.map((c, i) => ({ id: `t${i}`, name: c.name, company: c.company, quote: c.quote, rating: 5, image_url: null }));
  const hueOf = (i: number) => [330, 210, 160, 40, 280, 120][i % 6];
  const projects: ShowProject[] = dbProjects && dbProjects.length > 0 ? dbProjects : DEFAULT_PROJECTS;

  return (
    <div className="pm-root" id="pm-top">
      {/* NAV */}
      <nav className="pm-nav">
        <a href="#pm-top" className="pm-brand">
          <span className="pm-brandmark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="" />
          </span>
          <span className="pm-brandname">VDUYSTUDIO</span>
        </a>
        <div className="pm-menu">
          <a href="#pm-services">Services</a>
          <a href="#pm-process">Process</a>
          <a href="#pm-projects">Projects</a>
          <a href="#pm-feedback">Feedback</a>
        </div>
        <div className="pm-nav-right">
          <LangToggle compact />
        </div>
      </nav>

      {/* HERO */}
      <header className="pm-hero">
        <div className="pm-hero-fx" aria-hidden />
        <h1 className="pm-hero-title">VDUYSTUDIO</h1>
        <p className="pm-hero-sub">Bold Digital Branding &amp; Social Verification.</p>
      </header>

      {/* THƯƠNG HIỆU ĐÃ HỢP TÁC */}
      <div className="pm-marquee-wrap" aria-label="Thương hiệu đã hợp tác">
        <span className="pm-marquee-label">Trusted by</span>
        <div className="pm-marquee">
          <div className="pm-marquee-track">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span className="pm-marquee-item" key={i}>
                {b} <i>✦</i>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section className="pm-section" id="pm-services">
        <div className="pm-container">
          <h2 className="pm-label">Services</h2>
          <div className="pm-services">
            {SERVICES.map((s) => (
              <Link href={`/dich-vu/${s.slug}`} className="pm-svc" key={s.slug}>
                <span className="pm-svc-name">
                  {s.name[0]}
                  <br />
                  {s.name[1]}
                </span>
                <span className="pm-svc-icon">{SVC_ICONS[s.icon]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO — bento + iPhone mockup */}
      <section className="pm-section" id="pm-projects">
        <div className="pm-container">
          <div className="pm-label-row">
            <h2 className="pm-label">Portfolio</h2>
            <span className="pm-arrows" aria-hidden>← →</span>
          </div>
          <div className="pm-bento">
            {projects.map((p, i) => {
              const sp = p as ShowProject;
              return (
                <article className="pm-card" key={p.id}>
                  <div className="pm-card-bgword" aria-hidden>
                    {(sp.big ?? p.platform ?? "TIKTOK").toUpperCase()}
                  </div>

                  {i === 0 && (
                    <div className="pm-stage hero-stage">
                      <div className="pm-ovl">
                        <b>{sp.big ?? p.tag ?? "Verified"}</b>
                        <span>{sp.small ?? p.platform ?? ""}</span>
                      </div>
                      <IPhone src={p.image_url} alt={p.title} size="lg" tilt="r" />
                      <div className="pm-year" aria-hidden>2024</div>
                    </div>
                  )}

                  {(i === 1 || i === 2) && (
                    <div className="pm-stage side-stage">
                      <div className="pm-ovl num">
                        <b>{sp.big ?? p.tag ?? ""}</b>
                        <span>{sp.small ?? p.platform ?? ""}</span>
                      </div>
                      <IPhone src={p.image_url} alt={p.title} size="md" tilt={i === 1 ? "l" : "r"} />
                    </div>
                  )}

                  {i === 3 && (
                    <div className="pm-stage wide-stage">
                      <IPhone src={p.image_url} alt={p.title} size="lg" />
                      <div className="pm-spot">
                        <h3>{p.title}</h3>
                        {sp.handle && <span className="pm-handle">{sp.handle}</span>}
                        {sp.stats ? (
                          <div className="pm-stats">
                            {sp.stats.map(([v, l]) => (
                              <div key={l}>
                                <b>{v}</b>
                                <span>{l}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          p.result && <p className="pm-spot-sub">{p.result}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {i > 3 && (
                    <div className="pm-stage mini-stage">
                      <IPhone src={p.image_url} alt={p.title} size="sm" />
                    </div>
                  )}

                  {i !== 3 && (
                    <div className="pm-card-info">
                      <h3>{p.title}</h3>
                      {p.result && <p>{p.result}</p>}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* KHÁCH HÀNG */}
      <section className="pm-section" id="pm-clients">
        <div className="pm-container">
          <h2 className="pm-label center">Clients</h2>
          <div className="pm-clients">
            {CLIENTS.map((c, i) => (
              <span className="pm-client" key={i}>
                <span>{c}</span>
                {i < CLIENTS.length - 1 && <i aria-hidden>✦</i>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* QUY TRÌNH */}
      <section className="pm-section" id="pm-process">
        <div className="pm-container">
          <h2 className="pm-label">Process</h2>
          <div className="pm-process">
            {getProcess(lang).map((s, i) => (
              <div className="pm-step" key={i}>
                <span className="pm-step-num">0{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="pm-section" id="pm-feedback">
        <div className="pm-container">
          <h2 className="pm-label">Feedback</h2>
          <div className="pm-fb-grid">
            {feedbacks.slice(0, 3).map((c, i) => (
              <div className="pm-fb" key={c.id}>
                <div className="pm-fb-stars">{"★".repeat(Math.min(5, Math.max(1, c.rating ?? 5)))}</div>
                <p>“{c.quote}”</p>
                <div className="pm-fb-person">
                  <PersonAvatar name={c.name} hue={hueOf(i)} size={40} />
                  <div>
                    <b>{c.name}</b>
                    {c.company && <span>{c.company}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / FOOTER */}
      <footer className="pm-footer">
        <div className="pm-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="VDuyStudio" className="pm-foot-logo" />
          <h2 className="pm-foot-title">Ready to scale?</h2>
          <a href={contact.zalo} target="_blank" rel="noreferrer" className="pm-btn">
            Let&apos;s Talk
          </a>
          {(contact.isSet("email") || contact.isSet("phone") || contact.isSet("telegram") || contact.isSet("messenger")) && (
            <div className="pm-foot-contact">
              {contact.isSet("email") && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
              {contact.isSet("phone") && <a href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}>{contact.phone}</a>}
              {contact.isSet("telegram") && <a href={contact.telegram} target="_blank" rel="noreferrer">Telegram</a>}
              {contact.isSet("messenger") && <a href={contact.messenger} target="_blank" rel="noreferrer">Messenger</a>}
            </div>
          )}
          <div className="pm-footbar">
            <span>© 2026 VDuyStudio</span>
            <span>{site.domain}</span>
          </div>
        </div>
      </footer>

      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&family=Inter:wght@400;600;700&display=swap');

.pm-root{
 --bg:#04080d;--fg:#e6edf3;--muted:#8ca3b5;--cyan:#38bdf8;--cyan-soft:rgba(56,189,248,.14);
 --line:rgba(120,180,215,.16);--card:#070e15;
 font-family:'Inter',sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;overflow-x:hidden;
 padding-bottom:calc(20px + env(safe-area-inset-bottom));}
.pm-root *{box-sizing:border-box;}
.pm-root [id]{scroll-margin-top:80px;}
.pm-root a{text-decoration:none;color:inherit;}
.pm-container{max-width:1200px;margin:0 auto;padding:0 clamp(16px,4vw,28px);}

/* ===== nav ===== */
.pm-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:14px;
 padding:12px clamp(16px,4vw,36px);background:rgba(4,8,13,.78);backdrop-filter:blur(16px);border-bottom:1px solid rgba(120,180,215,.1);}
.pm-brand{display:flex;align-items:center;gap:11px;min-width:0;}
.pm-brandmark{width:38px;height:38px;border-radius:11px;overflow:hidden;flex-shrink:0;box-shadow:0 0 0 1px rgba(120,180,215,.22),0 0 22px rgba(99,102,241,.35);}
.pm-brandmark img{width:100%;height:100%;object-fit:cover;transform:scale(2.35);}
.pm-brandname{font-family:'Anton',sans-serif;font-size:15px;letter-spacing:2px;color:var(--cyan);text-shadow:0 0 20px rgba(56,189,248,.65);}
.pm-menu{display:flex;gap:30px;font-size:13.5px;font-weight:600;color:var(--muted);}
.pm-menu a{padding:8px 0;transition:.2s;}
.pm-menu a:hover{color:#fff;}
.pm-nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}

/* ===== hero ===== */
.pm-hero{position:relative;margin:14px clamp(10px,2vw,20px) 0;border-radius:26px;overflow:hidden;text-align:center;
 padding:clamp(88px,13vw,170px) 20px clamp(96px,14vw,180px);
 background:
  radial-gradient(1000px 460px at 50% 118%,rgba(34,211,238,.30),transparent 64%),
  radial-gradient(720px 340px at 14% 96%,rgba(8,90,120,.5),transparent 70%),
  radial-gradient(640px 300px at 86% 84%,rgba(56,189,248,.16),transparent 70%),
  radial-gradient(520px 240px at 70% 8%,rgba(14,60,88,.5),transparent 70%),
  linear-gradient(180deg,#0a141d 0%,#071420 55%,#03101b 100%);
 border:1px solid rgba(120,180,215,.12);}
.pm-hero-fx{position:absolute;inset:0;pointer-events:none;
 background-image:
  radial-gradient(1.3px 1.3px at 12% 24%,rgba(255,255,255,.9),transparent),
  radial-gradient(1px 1px at 28% 66%,rgba(255,255,255,.55),transparent),
  radial-gradient(1.5px 1.5px at 44% 18%,rgba(190,240,255,.85),transparent),
  radial-gradient(1px 1px at 58% 74%,rgba(255,255,255,.5),transparent),
  radial-gradient(1.2px 1.2px at 72% 30%,rgba(255,255,255,.8),transparent),
  radial-gradient(1px 1px at 86% 58%,rgba(190,240,255,.6),transparent),
  radial-gradient(1.4px 1.4px at 93% 14%,rgba(255,255,255,.75),transparent),
  radial-gradient(1px 1px at 8% 82%,rgba(255,255,255,.5),transparent);}
.pm-hero-title{position:relative;margin:0;font-family:'Anton',sans-serif;font-weight:400;
 font-size:clamp(58px,12.5vw,182px);line-height:.98;letter-spacing:.5px;text-transform:uppercase;
 background:linear-gradient(180deg,#ffffff 6%,#e3edf5 36%,#93a9bc 52%,#eef5fa 62%,#aec0d0 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;
 filter:drop-shadow(0 14px 44px rgba(0,0,0,.55)) drop-shadow(0 0 60px rgba(56,189,248,.18));}
.pm-hero-sub{position:relative;margin:22px 0 0;font-size:clamp(15px,2.2vw,23px);font-weight:700;color:#eaf3f9;
 text-shadow:0 2px 22px rgba(0,0,0,.6);}

/* ===== marquee thương hiệu ===== */
.pm-marquee-wrap{display:flex;align-items:center;margin:26px 0 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
 background:rgba(10,20,29,.5);overflow:hidden;}
.pm-marquee-label{flex-shrink:0;padding:16px 26px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
 color:var(--cyan);border-right:1px solid var(--line);}
.pm-marquee{flex:1;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);
 mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);}
.pm-marquee-track{display:flex;width:max-content;animation:pmMarquee 32s linear infinite;}
.pm-marquee-item{font-family:'Oswald',sans-serif;font-weight:600;font-size:17px;text-transform:uppercase;letter-spacing:1.5px;
 color:#a9bfce;white-space:nowrap;padding:15px 0 15px 34px;}
.pm-marquee-item i{font-style:normal;color:rgba(56,189,248,.55);font-size:12px;margin-left:34px;}
@keyframes pmMarquee{to{transform:translateX(-50%)}}

/* ===== section chung ===== */
.pm-section{padding:clamp(48px,7vw,84px) 0 0;}
.pm-label{font-family:'Oswald',sans-serif;font-weight:700;font-size:17px;letter-spacing:3px;text-transform:uppercase;
 color:#93aabb;margin:0 0 26px;}
.pm-label.center{text-align:center;}
.pm-label-row{display:flex;justify-content:space-between;align-items:center;}
.pm-arrows{color:#4a6274;font-size:19px;letter-spacing:8px;margin-bottom:26px;}

/* ===== services ===== */
.pm-services{display:grid;grid-template-columns:repeat(4,1fr);}
.pm-svc{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:10px 26px 14px;transition:.25s;}
.pm-svc+.pm-svc{border-left:1px solid var(--line);}
.pm-svc:first-child{padding-left:0;}
.pm-svc-name{font-family:'Oswald',sans-serif;font-weight:700;font-size:clamp(17px,1.9vw,22px);line-height:1.25;color:#fff;}
.pm-svc-icon{color:var(--cyan);opacity:.9;flex-shrink:0;width:44px;height:44px;border:1px solid rgba(56,189,248,.3);border-radius:50%;
 display:flex;align-items:center;justify-content:center;transition:.25s;}
.pm-svc:hover .pm-svc-icon{background:var(--cyan-soft);box-shadow:0 0 24px rgba(56,189,248,.25);}
.pm-svc:hover .pm-svc-name{color:var(--cyan);}

/* ===== bento portfolio ===== */
.pm-bento{display:grid;grid-template-columns:repeat(12,1fr);gap:22px;}
.pm-card{position:relative;overflow:hidden;border-radius:24px;border:1px solid rgba(56,189,248,.22);
 background:
  radial-gradient(560px 300px at 18% 88%,rgba(34,211,238,.14),transparent 65%),
  radial-gradient(520px 280px at 85% 12%,rgba(14,90,130,.28),transparent 70%),
  linear-gradient(180deg,#081119 0%,#050c13 100%);
 display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.45);}
.pm-card:nth-child(1),.pm-card:nth-child(4){grid-column:span 12;}
.pm-card:nth-child(2),.pm-card:nth-child(3){grid-column:span 6;}
.pm-card:nth-child(n+5){grid-column:span 4;}
.pm-card-bgword{position:absolute;top:46%;left:50%;transform:translate(-50%,-50%);font-family:'Anton',sans-serif;
 font-size:clamp(90px,13vw,210px);letter-spacing:6px;color:rgba(180,220,245,.04);white-space:nowrap;pointer-events:none;}

.pm-stage{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;
 gap:clamp(26px,5vw,70px);padding:clamp(36px,5vw,60px) clamp(20px,4vw,56px) clamp(24px,3vw,36px);}
.pm-ovl{display:flex;flex-direction:column;line-height:1.02;}
.pm-ovl b{font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(34px,4.6vw,60px);color:#fff;letter-spacing:1px;
 text-shadow:0 6px 34px rgba(0,0,0,.6);}
.pm-ovl span{font-family:'Oswald',sans-serif;font-weight:600;font-size:clamp(16px,2vw,25px);color:var(--cyan);
 letter-spacing:2px;margin-top:8px;text-shadow:0 0 26px rgba(56,189,248,.5);}
.pm-ovl.num b{font-size:clamp(50px,6.4vw,92px);
 background:linear-gradient(180deg,#bae6fd 0%,#38bdf8 48%,#0369a1 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;
 filter:drop-shadow(0 8px 30px rgba(2,60,90,.6));}
.pm-year{font-family:'Anton',sans-serif;font-size:clamp(58px,8.5vw,128px);letter-spacing:2px;line-height:1;
 background:linear-gradient(180deg,#7dd3fc 0%,#0ea5e9 52%,#075985 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;
 filter:drop-shadow(0 10px 34px rgba(2,60,90,.65));}

/* card 3: đảo chiều để nhịp bento so le */
.pm-card:nth-child(3) .pm-stage{flex-direction:row-reverse;}

/* card 4: spotlight — phone trái, thông tin + stats phải */
.pm-spot{max-width:460px;}
.pm-spot h3{font-family:'Oswald',sans-serif;font-weight:700;font-size:clamp(28px,3.4vw,44px);margin:0;letter-spacing:.5px;}
.pm-handle{display:block;margin-top:8px;color:var(--cyan);font-size:14px;font-weight:600;letter-spacing:.5px;}
.pm-spot-sub{color:var(--muted);font-size:14px;margin:18px 0 0;}
.pm-stats{display:flex;margin-top:28px;border-top:1px solid var(--line);}
.pm-stats>div{padding:16px 26px 2px 0;margin-right:26px;border-right:1px solid var(--line);}
.pm-stats>div:last-child{border-right:none;margin-right:0;padding-right:0;}
.pm-stats b{display:block;font-family:'Oswald',sans-serif;font-weight:700;font-size:clamp(20px,2.2vw,27px);color:#fff;}
.pm-stats span{font-size:12px;color:var(--muted);letter-spacing:.5px;}

.pm-card-info{position:relative;z-index:2;padding:0 clamp(20px,3vw,30px) clamp(20px,3vw,26px);}
.pm-card-info h3{font-family:'Oswald',sans-serif;font-weight:700;font-size:clamp(19px,2.2vw,25px);margin:0 0 6px;letter-spacing:.5px;}
.pm-card-info p{margin:0;color:var(--muted);font-size:13px;}

/* ===== iPhone mockup ===== */
.pm-phone{position:relative;flex-shrink:0;border-radius:46px;padding:7px;
 background:linear-gradient(160deg,#57616e 0%,#181e28 26%,#0a0f16 72%,#3b4450 100%);
 box-shadow:0 34px 74px rgba(0,0,0,.62),0 0 56px rgba(56,189,248,.13),inset 0 0 2px rgba(255,255,255,.4);}
.pm-phone::before{content:"";position:absolute;right:-2.5px;top:118px;width:3px;height:62px;border-radius:2px;background:#3b4450;}
.pm-phone::after{content:"";position:absolute;left:-2.5px;top:96px;width:3px;height:30px;border-radius:2px;background:#3b4450;box-shadow:0 44px 0 #3b4450;}
.pm-phone.lg{width:clamp(210px,22vw,252px);}
.pm-phone.md{width:clamp(190px,20vw,218px);}
.pm-phone.sm{width:180px;}
.pm-phone.tilt-l{transform:rotate(-6deg);}
.pm-phone.tilt-r{transform:rotate(6deg);}
.pm-phone-screen{position:relative;border-radius:39px;overflow:hidden;aspect-ratio:1320/2868;background:#000;}
.pm-phone-screen img{width:100%;height:100%;object-fit:cover;display:block;}
.pm-phone-screen::after{content:"";position:absolute;inset:0;pointer-events:none;
 background:linear-gradient(115deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,.03) 26%,transparent 44%);}
.pm-island{position:absolute;top:13px;left:50%;transform:translateX(-50%);width:27%;height:21px;background:#000;
 border-radius:20px;z-index:5;box-shadow:inset 0 0 3px rgba(255,255,255,.18);}
.pm-phone-empty{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#3d5364;
 font-family:'Oswald',sans-serif;font-size:15px;letter-spacing:1px;text-transform:uppercase;}

/* ===== clients ===== */
.pm-clients{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;gap:12px 0;max-width:1020px;
 margin:0 auto;text-align:center;}
.pm-client{display:inline-flex;align-items:baseline;font-family:'Oswald',sans-serif;font-weight:600;
 font-size:clamp(19px,2.9vw,33px);text-transform:uppercase;letter-spacing:1px;color:#d7e4ee;white-space:nowrap;transition:.2s;}
.pm-client>span:hover{color:var(--cyan);text-shadow:0 0 30px rgba(56,189,248,.5);}
.pm-client i{font-style:normal;color:rgba(56,189,248,.5);font-size:13px;margin:0 20px;}

/* ===== process ===== */
.pm-process{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line);border-radius:20px;overflow:hidden;
 background:rgba(9,17,25,.55);}
.pm-step{padding:26px 24px;border-left:1px solid var(--line);}
.pm-step:first-child{border-left:none;}
.pm-step-num{font-family:'Anton',sans-serif;font-size:14px;letter-spacing:3px;color:var(--cyan);}
.pm-step h4{font-family:'Oswald',sans-serif;font-weight:600;font-size:16px;text-transform:uppercase;letter-spacing:.5px;margin:12px 0 7px;}
.pm-step p{margin:0;color:var(--muted);font-size:12.5px;line-height:1.6;}

/* ===== feedback ===== */
.pm-fb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.pm-fb{background:rgba(9,17,25,.55);border:1px solid var(--line);border-radius:18px;padding:24px;display:flex;flex-direction:column;}
.pm-fb-stars{color:#fbbf24;letter-spacing:2px;font-size:12.5px;margin-bottom:12px;}
.pm-fb p{margin:0 0 18px;font-size:14px;line-height:1.65;color:#c7d6e2;flex:1;}
.pm-fb-person{display:flex;align-items:center;gap:11px;}
.pm-fb-person b{display:block;font-size:13.5px;}
.pm-fb-person span{font-size:11.5px;color:var(--muted);}

/* ===== footer ===== */
.pm-footer{padding:clamp(56px,8vw,96px) 0 0;text-align:center;}
.pm-foot-logo{display:block;width:min(480px,84vw);margin:0 auto;
 -webkit-mask-image:radial-gradient(72% 72% at 50% 50%,#000 52%,transparent 98%);
 mask-image:radial-gradient(72% 72% at 50% 50%,#000 52%,transparent 98%);}
.pm-foot-title{font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(34px,6vw,64px);text-transform:uppercase;
 letter-spacing:1px;margin:6px 0 30px;
 background:linear-gradient(180deg,#fff 20%,#9db3c5 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.pm-btn{display:inline-block;background:var(--cyan);color:#03222e;font-weight:800;font-size:17px;text-transform:uppercase;
 letter-spacing:1px;padding:18px 54px;border-radius:100px;transition:.3s;box-shadow:0 0 44px rgba(56,189,248,.4);}
.pm-btn:hover{transform:scale(1.04);box-shadow:0 0 64px rgba(56,189,248,.6);}
.pm-foot-contact{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 28px;margin-top:34px;font-size:13.5px;color:var(--muted);}
.pm-foot-contact a:hover{color:#fff;}
.pm-footbar{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:44px;padding:18px 0;
 border-top:1px solid var(--line);color:#51697b;font-size:12.5px;}

@media(prefers-reduced-motion:reduce){.pm-root *{animation:none!important}}

/* ===== tablet ===== */
@media(max-width:980px){
 .pm-menu{display:none;}
 .pm-services{grid-template-columns:1fr 1fr;gap:6px 0;}
 .pm-svc{padding:18px 22px;}
 .pm-svc:first-child{padding-left:22px;}
 .pm-svc:nth-child(odd){border-left:none;padding-left:0;}
 .pm-svc:nth-child(n+3){border-top:1px solid var(--line);}
 .pm-card:nth-child(n){grid-column:span 12;}
 .pm-stage,.pm-card:nth-child(3) .pm-stage{flex-direction:column;text-align:center;}
 .pm-ovl{align-items:center;}
 .pm-year{order:-1;}
 .pm-spot{max-width:none;text-align:center;}
 .pm-stats{justify-content:center;}
 .pm-card-info{text-align:center;}
 .pm-process{grid-template-columns:1fr 1fr;}
 .pm-step:nth-child(3){border-left:none;}
 .pm-step:nth-child(n+3){border-top:1px solid var(--line);}
 .pm-fb-grid{grid-template-columns:1fr;}
}
/* ===== phone ===== */
@media(max-width:560px){
 .pm-nav{padding:10px 14px;}
 .pm-hero{margin:10px;border-radius:20px;}
 .pm-services{grid-template-columns:1fr;}
 .pm-svc:nth-child(odd){padding-left:0;}
 .pm-svc:nth-child(n+2){border-top:1px solid var(--line);border-left:none;}
 .pm-svc{padding:16px 0;}
 .pm-phone.lg,.pm-phone.md,.pm-phone.sm{width:min(210px,58vw);}
 .pm-phone.tilt-l,.pm-phone.tilt-r{transform:none;}
 .pm-stats{flex-wrap:wrap;gap:14px 0;}
 .pm-process{grid-template-columns:1fr;}
 .pm-step{border-left:none;}
 .pm-step:nth-child(n+2){border-top:1px solid var(--line);}
 .pm-client i{margin:0 12px;}
 .pm-footbar{justify-content:center;}
}
      `}</style>
    </div>
  );
}
