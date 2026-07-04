"use client";

// PREMIUM — thiết kế theo mockup "dark-teal editorial": ít chữ, nhiều hình
// ảnh chất lượng cao. Toàn bộ dữ liệu động (dự án, feedback, liên hệ) dùng
// chung lớp Supabase với bản Galaxy — DB trống thì fallback bộ showcase
// mặc định bên dưới (4 ảnh d1–d4 trong khung iPhone).

import { useEffect, useState } from "react";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import { PersonAvatar, PlatformIcon, Platform } from "@/components/brand";
import { extractMark, extractPlanet } from "@/lib/logoSprites";
import { useLang, Lang, LangToggle } from "@/lib/i18n";
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

// Dịch vụ: nội dung chuẩn 4 nền tảng như bản Galaxy.
const SERVICES = (lang: Lang): { slug: string; icon: Platform; name: string; desc: string }[] => [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", desc: lang === "en" ? "Verification badge · account recovery · livestream & shop cart unlocks" : "Tích xanh chính thống · mở khóa tài khoản · livestream & giỏ hàng" },
  { slug: "facebook", icon: "facebook", name: "Facebook", desc: lang === "en" ? "Verification badge · personal account & fanpage recovery" : "Tích xanh · mở khóa tài khoản cá nhân & Fanpage" },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram / Threads", desc: lang === "en" ? "Official badge & account recovery per Meta policy" : "Tích xanh & mở khóa tài khoản theo chính sách Meta" },
  { slug: "bao-chi", icon: "press", name: lang === "en" ? "Press & PR" : "Báo chí", desc: lang === "en" ? "Press booking · SEO-standard PR writing on major outlets" : "Booking báo chí · viết bài PR chuẩn SEO trên đầu báo lớn" },
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
    heroTag: "Dịch vụ xác minh & bảo vệ tài khoản mạng xã hội",
    heroA: "Xây dựng",
    heroB: "uy tín số",
    heroC: "cho thương hiệu của bạn",
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
    heroTag: "Social media verification & account protection services",
    heroA: "Building",
    heroB: "digital trust",
    heroC: "for your brand",
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

// Ảnh sprite tách từ logo.png (mark trong suốt / hành tinh) — xử lý bằng
// canvas phía client, cache theo module nên chỉ chạy một lần.
function SpriteImg({ kind, alt = "", className }: { kind: "mark" | "p1" | "p2"; alt?: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    const p = kind === "mark" ? extractMark() : extractPlanet(kind);
    p.then((u) => mounted && setUrl(u)).catch(() => {});
    return () => { mounted = false; };
  }, [kind]);
  if (!url) return <span className={className} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} className={className} draggable={false} />;
}

// Mark 3D có ĐỘ DÀY thật: xếp nhiều lớp ảnh dọc trục Z rồi quay cả khối
// quanh trục dọc. Bước lớp 0.6px (< 1px) nên khi quay nghiêng các lớp hoà
// thành cạnh liền khối, không lộ sọc.
function Mark3D({ layers = 24, className, alt = "" }: { layers?: number; className?: string; alt?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    extractMark().then((u) => mounted && setUrl(u)).catch(() => {});
    return () => { mounted = false; };
  }, []);
  return (
    <div className={`pm-mark-stack ${className ?? ""}`}>
      {url &&
        Array.from({ length: layers }, (_, i) => {
          const isFront = i === layers - 1;
          const isBack = i === 0;
          return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={url}
            alt={isFront ? alt : ""}
            aria-hidden={!isFront}
            draggable={false}
            className={isFront ? "front" : isBack ? "back" : "side"}
            style={{ transform: `translateZ(${(i - (layers - 1) / 2) * 0.3}px)` }}
          />
        )})}
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
          <span className="pm-brand-spin">
            <Mark3D layers={8} className="nav" alt="VDuyStudio" />
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

      {/* HERO — mark VJ + tích xanh tách nền từ logo.png (pixel gốc, trong
          suốt) xoay quanh trục dọc trên nền vũ trụ động; wordmark 3D, tagline,
          headline và hàng số liệu uy tín */}
      <header className="pm-hero">
        <div className="pm-space" aria-hidden>
          <div className="pm-nebula" />
          <div className="pm-stars sa" />
          <div className="pm-stars sb" />
          <SpriteImg kind="p2" className="pm-planet pl2" />
          <SpriteImg kind="p1" className="pm-planet pl1" />
          <span className="pm-comet" />
          {[
            { c: "s1", ch: "✦" },
            { c: "s2", ch: "✧" },
            { c: "s3", ch: "✦" },
            { c: "s4", ch: "✧" },
            { c: "s5", ch: "✦" },
          ].map((s) => (
            <span key={s.c} className={`pm-star ${s.c}`}>{s.ch}</span>
          ))}
        </div>
        <div className="pm-hero-inner">
          <div className="pm-hero-logo-row">
            <div className="pm-word3d left">
              <span className="pm-word3d-back" aria-hidden>VDUY</span>
              <span className="pm-word3d-front">
                <i>VDUY</i>
              </span>
            </div>
            
            <div className="pm-mark3d">
              <Mark3D alt="VDuyStudio" />
              <span className="pm-mark-glow" aria-hidden />
            </div>

            <div className="pm-word3d right">
              <span className="pm-word3d-back" aria-hidden>STUDIO</span>
              <span className="pm-word3d-front">
                <em>STUDIO</em>
              </span>
            </div>
          </div>

          <div className="pm-hero-tag">✦ {t.heroTag}</div>
          <h1 className="pm-hero-h1">
            {t.heroA} <span className="pm-holo">{t.heroB}</span> {t.heroC}
          </h1>
          <div className="pm-statline">
            {st.stats.map((s, i) => (
              <span key={i}>
                <b>{s.value}</b> {s.label}
              </span>
            ))}
          </div>
        </div>
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
            {SERVICES(lang).map((s) => (
              <Link href={`/dich-vu/${s.slug}`} className="pm-svc" key={s.slug}>
                <span className="pm-svc-halo" aria-hidden />
                <PlatformIcon kind={s.icon} size={44} />
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <span className="pm-svc-go">{lang === "en" ? "View details →" : "Xem chi tiết →"}</span>
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
            {projects.slice(0, 4).map((p, i) => {
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

          {/* Từ dự án thứ 5 trở đi: trượt ngang 3 thẻ/khung (tự chạy + mũi tên + chấm) */}
          {projects.length > 4 && (
            <div className="pm-more">
              <Carousel per={3} ariaLabel={t.portfolio}>
                {projects.slice(4).map((p) => (
                  <div className="pm-mini" key={p.id}>
                    <IPhone src={p.image_url} alt={p.title} size="sm" />
                    <div className="pm-mini-info">
                      <h3>{p.title}</h3>
                      {p.result && <p>{p.result}</p>}
                      {p.tag && <span className="pm-mini-tag">{p.tag}</span>}
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
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
 --bg:#02090c;--fg:#e6f0f2;--muted:#8fadb5;--cyan:#2dd4bf;--cyan-soft:rgba(45,212,191,.14);
 --line:rgba(94,209,214,.16);--card:#05141a;
 font-family:'Inter',sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;overflow-x:hidden;
 padding-bottom:calc(20px + env(safe-area-inset-bottom));}
.pm-root *{box-sizing:border-box;}
.pm-root [id]{scroll-margin-top:80px;}
.pm-root a{text-decoration:none;color:inherit;}
.pm-container{max-width:1200px;margin:0 auto;padding:0 clamp(16px,4vw,28px);}

/* ===== nav ===== */
.pm-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:14px;
 padding:12px clamp(16px,4vw,36px);background:rgba(2,9,12,.8);backdrop-filter:blur(16px);border-bottom:1px solid rgba(94,209,214,.12);}
.pm-brand{display:flex;align-items:center;gap:11px;min-width:0;}
/* icon mark tách nền, xoay quanh trục dọc */
.pm-brand-spin{display:block;width:46px;height:38px;perspective:420px;flex-shrink:0;}
.pm-brand-spin img,.pm-brand-spin span{display:block;width:100%;height:100%;object-fit:contain;
 filter:drop-shadow(0 0 12px rgba(45,212,191,.55));}
.pm-brandname{font-family:'Anton',sans-serif;font-size:15px;letter-spacing:2px;color:var(--cyan);
 text-shadow:0 0 20px rgba(45,212,191,.65);}
.pm-menu{display:flex;gap:30px;font-size:13.5px;font-weight:600;color:var(--muted);}
.pm-menu a{padding:8px 0;transition:.2s;}
.pm-menu a:hover{color:#fff;}
.pm-nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}

/* ===== hero: nền vũ trụ động + mark 3D xoay trục dọc ===== */
.pm-hero{position:relative;width:100%;min-height:calc(100svh - 62px);background:#03050c;overflow:hidden;
 display:flex;align-items:center;justify-content:center;text-align:center;
 padding:clamp(30px,5vh,64px) 20px clamp(40px,6vh,72px);}
.pm-space{position:absolute;inset:0;pointer-events:none;}
.pm-nebula{position:absolute;inset:0;background:
 radial-gradient(760px 560px at 26% 42%,rgba(13,148,136,.20),transparent 65%),
 radial-gradient(560px 460px at 16% 68%,rgba(6,182,212,.12),transparent 65%),
 radial-gradient(720px 520px at 80% 26%,rgba(8,145,178,.18),transparent 65%),
 radial-gradient(640px 520px at 66% 92%,rgba(45,212,191,.10),transparent 65%);}
.pm-stars{position:absolute;inset:-320px 0 0;background-repeat:repeat;}
.pm-stars.sa{background-image:
 radial-gradient(1.2px 1.2px at 25px 35px,#fff,transparent),
 radial-gradient(1px 1px at 125px 88px,rgba(255,255,255,.8),transparent),
 radial-gradient(1.4px 1.4px at 210px 160px,#cfe3ff,transparent),
 radial-gradient(1px 1px at 310px 55px,rgba(255,255,255,.7),transparent),
 radial-gradient(1.1px 1.1px at 80px 220px,#fff,transparent),
 radial-gradient(.9px .9px at 260px 260px,rgba(255,255,255,.6),transparent);
 background-size:360px 320px;animation:pmDrift 110s linear infinite;}
.pm-stars.sb{background-image:
 radial-gradient(1.6px 1.6px at 60px 120px,#a5f3fc,transparent),
 radial-gradient(1.2px 1.2px at 180px 40px,#e9d5ff,transparent),
 radial-gradient(1px 1px at 300px 200px,#fff,transparent),
 radial-gradient(1.3px 1.3px at 140px 280px,rgba(255,255,255,.85),transparent);
 background-size:420px 380px;animation:pmDrift 160s linear infinite reverse,pmStarsGlow 7s ease-in-out infinite;opacity:.85;}
@keyframes pmDrift{to{transform:translateY(-320px)}}
@keyframes pmStarsGlow{0%,100%{opacity:.55}50%{opacity:.95}}
.pm-planet{position:absolute;}
.pm-planet.pl2{right:6%;top:44%;width:clamp(84px,10vw,160px);height:auto;
 animation:pmFloat 16s ease-in-out infinite;filter:drop-shadow(0 0 34px rgba(94,234,212,.25));}
.pm-planet.pl1{left:19%;top:28%;width:clamp(26px,3vw,46px);height:auto;
 animation:pmFloat 12s ease-in-out infinite reverse;filter:drop-shadow(0 0 18px rgba(153,246,228,.3));}
@keyframes pmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
.pm-comet{position:absolute;top:7%;left:84%;width:130px;height:1.5px;border-radius:2px;
 background:linear-gradient(90deg,#fff,transparent);opacity:0;transform:rotate(-32deg);
 animation:pmComet 12s ease-in 3s infinite;}
@keyframes pmComet{0%{opacity:0;transform:rotate(-32deg) translateX(0)}4%{opacity:.9}
 13%{opacity:0;transform:rotate(-32deg) translateX(-340px)}100%{opacity:0}}
.pm-star{position:absolute;color:#dcecff;opacity:0;line-height:1;
 text-shadow:0 0 13px rgba(150,205,255,.9),0 0 4px #fff;animation:pmStar 5.5s ease-in-out infinite;}
.pm-star.s1{top:16%;left:22%;font-size:14px;animation-delay:.4s;}
.pm-star.s2{top:32%;left:9%;font-size:11px;animation-delay:1.6s;animation-duration:6.5s;}
.pm-star.s3{top:70%;left:14%;font-size:13px;animation-delay:2.9s;}
.pm-star.s4{top:22%;right:13%;font-size:15px;animation-delay:1s;}
.pm-star.s5{top:66%;right:9%;font-size:11px;animation-delay:3.6s;animation-duration:6s;}
@keyframes pmStar{0%,100%{opacity:0;transform:scale(.5) rotate(0deg)}50%{opacity:.85;transform:scale(1.05) rotate(22deg)}}

/* cụm nội dung hero */
.pm-hero-inner{position:relative;display:flex;flex-direction:column;align-items:center;max-width:1400px;width:100%;}
.pm-hero-logo-row{display:flex;align-items:flex-end;justify-content:center;width:100%;margin-bottom:12px;gap:2vw;}
.pm-mark3d{position:relative;width:clamp(312px,40.8vw,528px);perspective:1300px;z-index:2;flex-shrink:0;}
/* mark 3D nhiều lớp — có độ dày, nhìn nghiêng thấy cạnh khi xoay */
.pm-mark-stack{position:relative;width:100%;aspect-ratio:1.32;transform-style:preserve-3d;
 animation:pmSpinY 20s linear infinite;}
.pm-mark-stack img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;image-rendering:auto;}
.pm-mark-stack img.side{filter:brightness(.45) saturate(1.15);opacity:0.92;}
.pm-mark-stack img.front,.pm-mark-stack img.back{filter:drop-shadow(0 22px 50px rgba(20,184,166,.35)) drop-shadow(0 0 40px rgba(45,212,191,.2));}
.pm-mark-stack.nav{animation-duration:14s;}
@keyframes pmSpinY{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}
.pm-mark-glow{position:absolute;left:50%;bottom:-6%;transform:translateX(-50%);width:72%;height:36px;border-radius:50%;
 background:radial-gradient(ellipse,rgba(20,184,166,.45),transparent 70%);filter:blur(9px);}
.pm-word3d{position:relative;display:inline-block;z-index:1;
 font-family:'Anton',sans-serif;font-weight:400;font-size:min(15.6vw,240px);line-height:0.85;letter-spacing:.02em;}
.pm-word3d-back{position:absolute;inset:0;color:#062a2e;white-space:nowrap;
 text-shadow:1px 1px 0 #0a3a40,2px 2px 0 #083137,3px 3px 0 #06282d,4px 4px 0 #052024,5px 5px 0 #04181c,6px 6px 0 #031114,
 10px 12px 24px rgba(0,0,0,.7);}
.pm-word3d-front{position:relative;white-space:nowrap;}
.pm-word3d-front i{font-style:normal;background:linear-gradient(180deg,#a7f3d0 0%,#2dd4bf 45%,#0e7490 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;}
.pm-word3d-front em{font-style:normal;background:linear-gradient(180deg,#ffffff 10%,#cfdae4 40%,#8fa3b8 55%,#eef4f9 78%,#aab9c9 100%);
 background-size:100% 220%;-webkit-background-clip:text;background-clip:text;color:transparent;
 animation:pmChrome 6s ease-in-out infinite;}
@keyframes pmChrome{0%,100%{background-position:0 0}50%{background-position:0 45%}}
.pm-hero-tag{margin-top:clamp(16px,2.6vh,26px);display:inline-block;font-size:11.5px;letter-spacing:2px;
 text-transform:uppercase;color:#5eead4;border:1px solid rgba(94,234,212,.32);background:rgba(94,234,212,.06);
 padding:7px 16px;border-radius:100px;font-weight:700;}
.pm-hero-h1{margin:14px 0 0;font-size:clamp(26px,4vw,46px);font-weight:800;letter-spacing:-.8px;color:#eef3fb;
 font-family:var(--font-grotesk),'Inter',sans-serif;}
.pm-holo{background:linear-gradient(90deg,#5eead4,#67e8f9,#a7f3d0,#5eead4);background-size:250% 100%;
 -webkit-background-clip:text;background-clip:text;color:transparent;animation:pmHolo 6s linear infinite;}
@keyframes pmHolo{to{background-position:250% 0}}
.pm-statline{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 30px;margin-top:clamp(18px,3vh,28px);
 font-size:13.5px;color:var(--muted);}
.pm-statline b{color:#5eead4;font-size:16px;margin-right:5px;}

/* wordmark vector (footer) */
.pm-wordmark{font-family:var(--font-archivo),var(--font-grotesk),sans-serif;font-weight:900;font-stretch:125%;
 font-size:clamp(36px,6.6vw,72px);line-height:1.05;letter-spacing:.01em;text-transform:uppercase;
 filter:drop-shadow(0 10px 30px rgba(0,0,0,.5));}
.pm-w1{background:linear-gradient(180deg,#a7f3d0 0%,#2dd4bf 48%,#0e7490 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;}
.pm-w2{background:linear-gradient(180deg,#ffffff 12%,#ccd9e4 42%,#8fa3b8 58%,#e9f1f8 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;}

/* ===== marquee thương hiệu ===== */
.pm-marquee-wrap{display:flex;align-items:center;margin:26px 0 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
 background:rgba(4,14,18,.5);overflow:hidden;}
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
.pm-services{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.pm-svc{position:relative;display:flex;flex-direction:column;gap:10px;padding:26px 22px;min-height:216px;
 background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;transition:.25s;}
.pm-svc-halo{position:absolute;top:-46px;right:-46px;width:120px;height:120px;border-radius:50%;
 background:radial-gradient(circle,rgba(45,212,191,.22),transparent 70%);}
.pm-svc h3{font-family:'Oswald',sans-serif;font-weight:700;font-size:18px;margin:8px 0 0;color:#fff;}
.pm-svc p{margin:0;color:var(--muted);font-size:13px;line-height:1.55;flex:1;}
.pm-svc-go{color:var(--cyan);font-size:12.5px;font-weight:700;}
.pm-svc:hover{border-color:rgba(45,212,191,.5);background:rgba(45,212,191,.05);transform:translateY(-4px);}

/* ===== bento portfolio ===== */
.pm-bento{display:grid;grid-template-columns:repeat(12,1fr);gap:22px;}
.pm-card{position:relative;overflow:hidden;border-radius:24px;border:1px solid rgba(45,212,191,.22);
 background:
  radial-gradient(560px 300px at 18% 88%,rgba(13,148,136,.16),transparent 65%),
  radial-gradient(520px 280px at 85% 12%,rgba(8,145,178,.15),transparent 70%),
  linear-gradient(180deg,#06161c 0%,#03090d 100%);
 display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.45);}
.pm-card:nth-child(1),.pm-card:nth-child(4){grid-column:span 12;}
.pm-card:nth-child(2),.pm-card:nth-child(3){grid-column:span 6;}

/* slider dự án 5+ */
.pm-more{margin-top:22px;}
.pm-mini{display:flex;flex-direction:column;align-items:center;gap:16px;padding:26px 18px 22px;
 background:var(--card);border:1px solid var(--line);border-radius:20px;transition:.25s;}
.pm-mini:hover{border-color:rgba(45,212,191,.5);transform:translateY(-4px);}
.pm-mini-info{text-align:center;}
.pm-mini-info h3{font-family:'Oswald',sans-serif;font-weight:700;font-size:18px;margin:0 0 5px;}
.pm-mini-info p{margin:0;color:var(--muted);font-size:12.5px;}
.pm-mini-tag{display:inline-block;margin-top:10px;font-size:10.5px;font-weight:800;letter-spacing:1px;
 text-transform:uppercase;color:#03222e;background:linear-gradient(90deg,#5eead4,#22d3ee);
 padding:4px 12px;border-radius:100px;}
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
 .pm-hero{min-height:0;padding:56px 20px 64px;}
 .pm-services{grid-template-columns:1fr 1fr;gap:16px;}
 .pm-svc{min-height:0;}
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
 @media(max-width:560px){
  .pm-nav{padding:10px 14px;}
  .pm-hero{padding:40px 16px 52px;}
  .pm-hero-logo-row{flex-direction:column;align-items:center;}
  .pm-mark3d{width:min(288px,76vw);}
  .pm-word3d{font-size:18vw;line-height:1;}
  .pm-hero-h1{font-size:24px;}
 .pm-planet.pl1{left:8%;top:16%;}
 .pm-planet.pl2{right:-4%;top:60%;}
 .pm-services{grid-template-columns:1fr;}
 .pm-svc{padding:22px 18px;}
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
