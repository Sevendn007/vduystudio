"use client";

// PREMIUM — thiết kế theo mockup "dark-teal editorial": ít chữ, nhiều hình
// ảnh chất lượng cao. Toàn bộ dữ liệu động (dự án, feedback, liên hệ) dùng
// chung lớp Supabase với bản Galaxy — DB trống thì fallback bộ showcase
// mặc định bên dưới (4 ảnh d1–d4 trong khung iPhone).

import { useEffect, useState } from "react";
import Link from "next/link";
import { PersonAvatar } from "@/components/brand";
import { VDuyBadge } from "@/components/logo";
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
  { slug: "tiktok", icon: "verify", en: ["Social Media", "Verification"], vi: ["Tích xanh", "Mạng xã hội"] },
  { slug: "facebook", icon: "brand", en: ["Digital", "Branding"], vi: ["Xây dựng", "Thương hiệu"] },
  { slug: "instagram-threads", icon: "growth", en: ["Strategy &", "Growth"], vi: ["Chiến lược", "Tăng trưởng"] },
  { slug: "bao-chi", icon: "mega", en: ["PR &", "Booking"], vi: ["Báo chí &", "Booking"] },
];

// Tên hiển thị của platform slug (dùng cho overlay khi dữ liệu lấy từ DB).
const PLATFORM_NAME: Record<string, string> = {
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
  "instagram-threads": "Instagram",
  "bao-chi": "Báo chí",
};

// Chữ theo ngôn ngữ (switch VI/EN trên nav).
const TX = {
  vi: {
    menu: ["Dịch vụ", "Quy trình", "Dự án", "Feedback"],
    heroSub: "Xây dựng thương hiệu số & tích xanh chính thống.",
    trusted: "Đồng hành cùng",
    services: "Dịch vụ",
    portfolio: "Dự án",
    clients: "Khách hàng",
    process: "Quy trình",
    feedback: "Feedback",
    cta: "Sẵn sàng bứt phá?",
    btn: "Liên hệ ngay",
  },
  en: {
    menu: ["Services", "Process", "Projects", "Feedback"],
    heroSub: "Bold Digital Branding & Social Verification.",
    trusted: "Trusted by",
    services: "Services",
    portfolio: "Portfolio",
    clients: "Clients",
    process: "Process",
    feedback: "Feedback",
    cta: "Ready to scale?",
    btn: "Let's Talk",
  },
};

/* ================= components ================= */

// Khung iPhone: viền titan, Dynamic Island, phản chiếu mặt kính.
// Ảnh DB lỗi/thiếu thì tự rơi về ảnh fallback cục bộ (d1–d4) để khung
// không bao giờ trống.
function IPhone({ src, fallback, alt, size = "md", tilt }: { src: string | null; fallback?: string | null; alt: string; size?: "lg" | "md" | "sm"; tilt?: "l" | "r" }) {
  const chain = [src, fallback].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const cur = chain[idx];
  return (
    <div className={`pm-phone ${size} ${tilt === "l" ? "tilt-l" : tilt === "r" ? "tilt-r" : ""}`}>
      <div className="pm-phone-screen">
        {cur ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cur} alt={alt} loading="lazy" onError={() => setIdx((i) => i + 1)} />
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
  const t = TX[lang];

  return (
    <div className="pm-root" id="pm-top">
      {/* NAV */}
      <nav className="pm-nav">
        <a href="#pm-top" className="pm-brand">
          <span className="pm-brand-vd">
            VD
            <span className="pm-brand-badge"><VDuyBadge size={15} intro={false} /></span>
          </span>
          <span className="pm-brandname">VDUYSTUDIO</span>
        </a>
        <div className="pm-menu">
          <a href="#pm-services">{t.menu[0]}</a>
          <a href="#pm-process">{t.menu[1]}</a>
          <a href="#pm-projects">{t.menu[2]}</a>
          <a href="#pm-feedback">{t.menu[3]}</a>
        </div>
        <div className="pm-nav-right">
          <LangToggle compact />
        </div>
      </nav>

      {/* HERO — nguyên artwork logo.png làm nền full-bleed (nền logo = nền hero,
          không có vết cắt); sao/hành tinh của chính logo được thêm hiệu ứng
          chớp sáng, glow thở nhịp, vệt sáng quét, sao chổi, lắc 3D nhẹ */}
      <header className="pm-hero">
        <div className="pm-hero-art" aria-hidden />
        <div className="pm-hero-veil" aria-hidden />
        <span className="pm-sheen" aria-hidden />
        <span className="pm-comet" aria-hidden />
        <span className="pm-glow g1" aria-hidden />
        <span className="pm-glow g2" aria-hidden />
        <span className="pm-glint" aria-hidden>✦</span>
        {[
          { c: "s1", ch: "✦" },
          { c: "s2", ch: "✧" },
          { c: "s3", ch: "✦" },
          { c: "s4", ch: "✧" },
          { c: "s5", ch: "✦" },
          { c: "s6", ch: "✧" },
          { c: "s7", ch: "✦" },
        ].map((s) => (
          <span key={s.c} className={`pm-star ${s.c}`} aria-hidden>{s.ch}</span>
        ))}
        <p className="pm-hero-sub">{t.heroSub}</p>
      </header>

      {/* THƯƠNG HIỆU ĐÃ HỢP TÁC */}
      <div className="pm-marquee-wrap" aria-label="Thương hiệu đã hợp tác">
        <span className="pm-marquee-label">{t.trusted}</span>
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
          <h2 className="pm-label">{t.services}</h2>
          <div className="pm-services">
            {SERVICES.map((s) => (
              <Link href={`/dich-vu/${s.slug}`} className="pm-svc" key={s.slug}>
                <span className="pm-svc-name">
                  {(lang === "en" ? s.en : s.vi)[0]}
                  <br />
                  {(lang === "en" ? s.en : s.vi)[1]}
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
            <h2 className="pm-label">{t.portfolio}</h2>
            <span className="pm-arrows" aria-hidden>← →</span>
          </div>
          <div className="pm-bento">
            {projects.map((p, i) => {
              const sp = p as ShowProject;
              // Ảnh dự phòng theo vị trí (d1–d4) khi ảnh DB lỗi/thiếu.
              const fb = DEFAULT_PROJECTS[i]?.image_url ?? null;
              const platformName = PLATFORM_NAME[p.platform ?? ""] ?? "TikTok";
              return (
                <article className="pm-card" key={p.id}>
                  <div className="pm-card-bgword" aria-hidden>
                    {(sp.big ?? platformName).toUpperCase()}
                  </div>

                  {i === 0 && (
                    <div className="pm-stage hero-stage">
                      <div className="pm-ovl">
                        <b>{sp.big ?? "Verification"}</b>
                        <span>{sp.small ?? platformName}</span>
                      </div>
                      <IPhone src={p.image_url} fallback={fb} alt={p.title} size="lg" tilt="r" />
                      <div className="pm-year" aria-hidden>2024</div>
                    </div>
                  )}

                  {(i === 1 || i === 2) && (
                    <div className="pm-stage side-stage">
                      <div className="pm-ovl num">
                        <b>{sp.big ?? platformName}</b>
                        <span>{sp.small ?? p.tag ?? "Verified"}</span>
                      </div>
                      <IPhone src={p.image_url} fallback={fb} alt={p.title} size="md" tilt={i === 1 ? "l" : "r"} />
                    </div>
                  )}

                  {i === 3 && (
                    <div className="pm-stage wide-stage">
                      <IPhone src={p.image_url} fallback={fb} alt={p.title} size="lg" />
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
          <h2 className="pm-label center">{t.clients}</h2>
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
          <h2 className="pm-label">{t.process}</h2>
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
          <h2 className="pm-label">{t.feedback}</h2>
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
          <div className="pm-wordmark small">
            <span className="pm-w1">VDUY</span>
            <span className="pm-w2">STUDIO</span>
          </div>
          <h2 className="pm-foot-title">{t.cta}</h2>
          <a href={contact.zalo} target="_blank" rel="noreferrer" className="pm-btn">
            {t.btn}
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
 --bg:#030510;--fg:#e6edf3;--muted:#92a3c0;--cyan:#38bdf8;--cyan-soft:rgba(56,189,248,.14);
 --line:rgba(135,155,225,.17);--card:#070b16;
 font-family:'Inter',sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;overflow-x:hidden;
 padding-bottom:calc(20px + env(safe-area-inset-bottom));}
.pm-root *{box-sizing:border-box;}
.pm-root [id]{scroll-margin-top:80px;}
.pm-root a{text-decoration:none;color:inherit;}
.pm-container{max-width:1200px;margin:0 auto;padding:0 clamp(16px,4vw,28px);}

/* ===== nav ===== */
.pm-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:14px;
 padding:12px clamp(16px,4vw,36px);background:rgba(3,5,16,.8);backdrop-filter:blur(16px);border-bottom:1px solid rgba(135,155,225,.12);}
.pm-brand{display:flex;align-items:center;gap:11px;min-width:0;}
/* Mark nav: chữ VD gradient + badge tích xanh vector (nền trong suốt) */
.pm-brand-vd{position:relative;font-family:'Anton',sans-serif;font-size:25px;line-height:1;flex-shrink:0;
 background:linear-gradient(135deg,#7dd3fc 0%,#8b5cf6 68%,#e879f9 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;
 padding-right:11px;filter:drop-shadow(0 0 14px rgba(129,140,248,.5));
 display:inline-block;transform-style:preserve-3d;animation:pmSpinY 5s linear infinite;}
@keyframes pmSpinY{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}
.pm-brand-badge{position:absolute;top:-7px;right:-4px;}
.pm-brandname{font-family:'Anton',sans-serif;font-size:15px;letter-spacing:2px;color:var(--cyan);text-shadow:0 0 20px rgba(56,189,248,.65);}
.pm-menu{display:flex;gap:30px;font-size:13.5px;font-weight:600;color:var(--muted);}
.pm-menu a{padding:8px 0;transition:.2s;}
.pm-menu a:hover{color:#fff;}
.pm-nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}

/* ===== hero ===== */
.pm-hero{position:relative;width:100%;height:100vh;min-height:600px;background:var(--bg);overflow:hidden;
 display:flex;flex-direction:column;align-items:center;justify-content:center;}
.pm-hero-art{position:absolute;inset:0;background:url('/images/logo.png') center/cover no-repeat;
 animation:pmSway 16s ease-in-out infinite;will-change:transform;}
@keyframes pmSway{0%,100%{transform:perspective(1400px) rotateY(-1.5deg) scale(1.05)}
 50%{transform:perspective(1400px) rotateY(1.5deg) scale(1.08)}}
.pm-hero-veil{position:absolute;inset:0;pointer-events:none;background:
 linear-gradient(0deg, var(--bg) 0%, var(--bg) 18%, transparent 40%),
 radial-gradient(145% 125% at 50% 42%,transparent 55%,rgba(3,5,16,.88) 98%);}
.pm-sheen{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;
 background:linear-gradient(115deg,transparent 43%,rgba(150,190,255,.13) 50%,transparent 57%) no-repeat;
 background-size:300% 100%;animation:pmSheen 9s ease-in-out infinite;}
@keyframes pmSheen{0%,52%{background-position:135% 0}88%,100%{background-position:-115% 0}}
.pm-comet{position:absolute;top:15%;left:76%;width:120px;height:1.5px;border-radius:2px;pointer-events:none;
 background:linear-gradient(90deg,#fff,transparent);opacity:0;transform:rotate(-32deg);
 animation:pmComet 12s ease-in 3s infinite;}
@keyframes pmComet{0%{opacity:0;transform:rotate(-32deg) translateX(0)}4%{opacity:.9}
 13%{opacity:0;transform:rotate(-32deg) translateX(-340px)}100%{opacity:0}}
.pm-glow{position:absolute;border-radius:50%;pointer-events:none;mix-blend-mode:screen;filter:blur(8px);
 opacity:.15;animation:pmBreath 6.5s ease-in-out infinite;}
.pm-glow.g1{width:12%;aspect-ratio:1;right:10.5%;top:52%;
 background:radial-gradient(circle,rgba(140,175,255,.55),transparent 68%);}
.pm-glow.g2{width:6.5%;aspect-ratio:1;left:27%;top:44%;
 background:radial-gradient(circle,rgba(200,225,255,.5),transparent 68%);animation-delay:2.6s;}
@keyframes pmBreath{0%,100%{opacity:.12}50%{opacity:.65}}
.pm-glint{position:absolute;left:62.5%;top:16%;font-size:clamp(16px,2.4vw,30px);line-height:1;color:#eaf6ff;
 pointer-events:none;opacity:0;text-shadow:0 0 18px rgba(160,215,255,.95),0 0 5px #fff;
 animation:pmGlint 7.5s ease-in-out 1.4s infinite;}
@keyframes pmGlint{0%,84%,100%{opacity:0;transform:scale(.35) rotate(0deg)}91%{opacity:1;transform:scale(1.2) rotate(42deg)}}
.pm-star{position:absolute;color:#dcecff;opacity:0;pointer-events:none;line-height:1;
 text-shadow:0 0 13px rgba(150,205,255,.9),0 0 4px #fff;animation:pmStar 5.5s ease-in-out infinite;}
.pm-star.s1{top:9%;left:26%;font-size:14px;animation-delay:.4s;}
.pm-star.s2{top:34%;left:11.5%;font-size:11px;animation-delay:1.6s;animation-duration:6.5s;}
.pm-star.s3{top:69%;left:6.5%;font-size:13px;animation-delay:2.9s;}
.pm-star.s4{top:86%;left:45%;font-size:10px;animation-delay:4.4s;animation-duration:7s;}
.pm-star.s5{top:14%;right:11%;font-size:15px;animation-delay:1s;}
.pm-star.s6{top:47%;right:5.5%;font-size:11px;animation-delay:3.6s;animation-duration:6s;}
.pm-star.s7{top:84%;right:28%;font-size:12px;animation-delay:2.2s;}
@keyframes pmStar{0%,100%{opacity:0;transform:scale(.5) rotate(0deg)}50%{opacity:.85;transform:scale(1.05) rotate(22deg)}}
/* chữ đề dẫn nổi trên ảnh hero */
.pm-hero-sub{position:absolute;left:50%;bottom:8%;transform:translateX(-50%);margin:0;width:100%;text-align:center;
 font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(22px,4vw,46px);letter-spacing:1px;text-transform:uppercase;
 background:linear-gradient(180deg,#ffffff 0%,#8ba6be 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
 filter:drop-shadow(0 10px 24px rgba(0,0,0,.9));z-index:2;}

/* wordmark vector (footer) */
.pm-wordmark{font-family:var(--font-archivo),var(--font-grotesk),sans-serif;font-weight:900;font-stretch:125%;
 font-size:clamp(36px,6.6vw,72px);line-height:1.05;letter-spacing:.01em;text-transform:uppercase;
 filter:drop-shadow(0 10px 30px rgba(0,0,0,.5));}
.pm-w1{background:linear-gradient(180deg,#9edcff 0%,#5b8cff 48%,#8b5cf6 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;}
.pm-w2{background:linear-gradient(180deg,#ffffff 12%,#ccd9e4 42%,#8fa3b8 58%,#e9f1f8 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;}

/* ===== marquee thương hiệu ===== */
.pm-marquee-wrap{display:flex;align-items:center;margin:26px 0 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
 background:rgba(7,10,24,.5);overflow:hidden;}
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
.pm-card{position:relative;overflow:hidden;border-radius:24px;border:1px solid rgba(129,140,248,.24);
 background:
  radial-gradient(560px 300px at 18% 88%,rgba(99,102,241,.16),transparent 65%),
  radial-gradient(520px 280px at 85% 12%,rgba(147,51,234,.14),transparent 70%),
  linear-gradient(180deg,#0a0f1f 0%,#04070f 100%);
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
 background:rgba(8,11,24,.55);}
.pm-step{padding:26px 24px;border-left:1px solid var(--line);}
.pm-step:first-child{border-left:none;}
.pm-step-num{font-family:'Anton',sans-serif;font-size:14px;letter-spacing:3px;color:var(--cyan);}
.pm-step h4{font-family:'Oswald',sans-serif;font-weight:600;font-size:16px;text-transform:uppercase;letter-spacing:.5px;margin:12px 0 7px;}
.pm-step p{margin:0;color:var(--muted);font-size:12.5px;line-height:1.6;}

/* ===== feedback ===== */
.pm-fb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.pm-fb{background:rgba(8,11,24,.55);border:1px solid var(--line);border-radius:18px;padding:24px;display:flex;flex-direction:column;}
.pm-fb-stars{color:#fbbf24;letter-spacing:2px;font-size:12.5px;margin-bottom:12px;}
.pm-fb p{margin:0 0 18px;font-size:14px;line-height:1.65;color:#c7d6e2;flex:1;}
.pm-fb-person{display:flex;align-items:center;gap:11px;}
.pm-fb-person b{display:block;font-size:13.5px;}
.pm-fb-person span{font-size:11.5px;color:var(--muted);}

/* ===== footer ===== */
.pm-footer{padding:clamp(56px,8vw,96px) 0 0;text-align:center;}
.pm-wordmark.small{font-size:clamp(26px,4vw,42px);margin-bottom:10px;}
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
 .pm-hero{aspect-ratio:1.6;}
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
 .pm-hero{margin:10px;border-radius:20px;aspect-ratio:1.15;max-height:none;}
 .pm-hero-sub{font-size:12.5px;}
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
