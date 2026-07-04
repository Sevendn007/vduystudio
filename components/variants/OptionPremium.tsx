"use client";

// PREMIUM — thiết kế theo mockup "dark-teal editorial": ít chữ, nhiều hình
// ảnh chất lượng cao. Toàn bộ dữ liệu động (dự án, feedback, liên hệ) dùng
// chung lớp Supabase với bản Galaxy — DB trống thì fallback bộ showcase
// mặc định bên dưới (4 ảnh d1–d4 trong khung iPhone).

import { useEffect, useState } from "react";
import Link from "next/link";
import Tilt from "@/components/tilt";
import { PersonAvatar, PlatformIcon, Platform } from "@/components/brand";
import { VDuyBadge } from "@/components/logo";
import { SpriteImg, Mark3D, Wordmark, IPhone, DEFAULT_PROJECTS } from "@/components/premiumKit";
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

// Dịch vụ: nội dung chuẩn 4 nền tảng như bản Galaxy.
const SERVICES = (lang: Lang): { slug: string; icon: Platform; name: string; desc: string }[] => [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", desc: lang === "en" ? "Verification badge · account recovery · livestream & shop cart unlocks" : "Tích xanh chính thống · mở khóa tài khoản · livestream & giỏ hàng" },
  { slug: "facebook", icon: "facebook", name: "Facebook", desc: lang === "en" ? "Verification badge · personal account & fanpage recovery" : "Tích xanh · mở khóa tài khoản cá nhân & Fanpage" },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram / Threads", desc: lang === "en" ? "Official badge & account recovery per Meta policy" : "Tích xanh & mở khóa tài khoản theo chính sách Meta" },
  { slug: "bao-chi", icon: "press", name: lang === "en" ? "Press & PR" : "Báo chí", desc: lang === "en" ? "Press booking · SEO-standard PR writing on major outlets" : "Booking báo chí · viết bài PR chuẩn SEO trên đầu báo lớn" },
];

// Tên hiển thị + icon của platform slug (mọi thẻ dự án render từ dữ liệu
// admin: title / tag / platform / result / image_url — không hard-code).
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
    viewAll: "Xem tất cả dự án →",
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
    viewAll: "View all projects →",
  },
};

// Icon 3D theo LOẠI DỊCH VỤ của dự án (suy từ tag/platform admin nhập):
// tích xanh → badge check 3D; mở khóa → ổ khóa; booking/PR/báo chí → loa.
// Tất cả lắc nhẹ quanh trục dọc + glow teal.
function ServiceIcon3D({ tag, platform, size = 64 }: { tag?: string | null; platform?: string | null; size?: number }) {
  const key = `${tag ?? ""} ${platform ?? ""}`.toLowerCase();
  const kind = /khóa|khoá|unlock|rescue|mở|recover/.test(key)
    ? "unlock"
    : /book|pr\b|báo|press|media|bao-chi/.test(key)
      ? "press"
      : "verify";
  return (
    <span className="pm-sic" style={{ width: size, height: size }} aria-hidden>
      {kind === "verify" && <VDuyBadge size={size} intro={false} />}
      {kind === "unlock" && (
        <svg viewBox="0 0 64 64" width={size} height={size}>
          <defs>
            <linearGradient id="sicLock" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5eead4" />
              <stop offset=".55" stopColor="#14b8a6" />
              <stop offset="1" stopColor="#0e7490" />
            </linearGradient>
            <linearGradient id="sicShkl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e6fffb" />
              <stop offset="1" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
          <path d="M20 30v-8a12 12 0 0 1 23-4.6" fill="none" stroke="url(#sicShkl)" strokeWidth="7" strokeLinecap="round" />
          <rect x="14" y="28" width="36" height="28" rx="9" fill="url(#sicLock)" />
          <rect x="14" y="28" width="36" height="11" rx="9" fill="rgba(255,255,255,.2)" />
          <circle cx="32" cy="41" r="4.6" fill="#03222e" />
          <rect x="29.8" y="43" width="4.4" height="8" rx="2.2" fill="#03222e" />
        </svg>
      )}
      {kind === "press" && (
        <svg viewBox="0 0 64 64" width={size} height={size}>
          <defs>
            <linearGradient id="sicMega" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5eead4" />
              <stop offset=".55" stopColor="#14b8a6" />
              <stop offset="1" stopColor="#0e7490" />
            </linearGradient>
          </defs>
          <path d="M9 26v13l25 11V15L9 26Z" fill="url(#sicMega)" />
          <path d="M9 26v13l25 5V21l-25 5Z" fill="rgba(255,255,255,.14)" />
          <rect x="12" y="40" width="9" height="12" rx="3.5" fill="#0e7490" />
          <path className="pm-sic-wave" d="M41 24c4.5 3 4.5 13 0 16" fill="none" stroke="url(#sicMega)" strokeWidth="4" strokeLinecap="round" />
          <path className="pm-sic-wave w2" d="M48.5 19c7.5 5 7.5 21 0 26" fill="none" stroke="url(#sicMega)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}
    </span>
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
    st.testimonials.map((c, i) => ({ id: `t${i}`, name: c.name, company: c.company, quote: c.quote, rating: 5, image_url: null, sort_order: null, date: null }));
  const hueOf = (i: number) => [330, 210, 160, 40, 280, 120][i % 6];
  const projects: DbProject[] = dbProjects && dbProjects.length > 0 ? dbProjects : DEFAULT_PROJECTS;
  const t = TX[lang];

  return (
    <div className="pm-root" id="pm-top">
      {/* NAV */}
      <nav className="pm-nav">
        <a href="#pm-top" className="pm-brand">
          <span className="pm-brand-spin">
            <Mark3D layers={8} className="nav" alt="VDuyStudio" />
          </span>
          <Wordmark className="nav" />
        </a>
        <div className="pm-menu">
          <a href="#pm-services">{t.menu[0]}</a>
          <a href="#pm-process">{t.menu[1]}</a>
          <Link href="/du-an">{t.menu[2]}</Link>
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
              <Wordmark part="vduy" className="hero" />
            </div>

            <div className="pm-mark3d">
              <Mark3D alt="VDuyStudio" />
              <span className="pm-mark-glow" aria-hidden />
            </div>

            <div className="pm-word3d right">
              <Wordmark part="studio" className="hero" />
            </div>
          </div>

          <div className="pm-hero-tag">✦ {t.heroTag} ✦</div>
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
              <Tilt className="pm-svcwrap" max={10} glare key={s.slug}>
                <Link href={`/dich-vu/${s.slug}`} className="pm-svc">
                  <span className="pm-svc-halo" aria-hidden />
                  <span className="pm-svc-ic">
                    <PlatformIcon kind={s.icon} size={46} />
                  </span>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                  <span className="pm-svc-go">{lang === "en" ? "View details →" : "Xem chi tiết →"}</span>
                </Link>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO — bento + iPhone mockup */}
      <section className="pm-section" id="pm-projects">
        <div className="pm-container">
          <div className="pm-label-row">
            <Link href="/du-an" className="pm-label-link">
              <h2 className="pm-label">{t.portfolio}</h2>
            </Link>
            <Link href="/du-an" className="pm-viewall">{t.viewAll}</Link>
          </div>
          {/* Chỉ 4 dự án mới nhất; mọi chữ/icon lấy từ dữ liệu admin:
              title · tag · platform (icon + tên) · result · image_url */}
          <div className="pm-bento">
            {projects.slice(0, 4).map((p, i) => {
              // Ảnh dự phòng theo vị trí (d1–d4) khi ảnh DB lỗi/thiếu.
              const fb = DEFAULT_PROJECTS[i]?.image_url ?? null;
              const platformName = PLATFORM_NAME[p.platform ?? ""] ?? p.platform ?? "TikTok";
              const icon = ICON_OF[p.platform ?? ""] ?? "tiktok";
              return (
                <article className="pm-card" key={p.id}>
                  <div className="pm-card-bgword" aria-hidden>
                    {platformName.toUpperCase()}
                  </div>

                  {i === 0 && (
                    <div className="pm-stage hero-stage">
                      <div className="pm-ovl">
                        <b>{p.tag ?? "Verified"}</b>
                        <span>{platformName}</span>
                      </div>
                      <IPhone src={p.image_url} fallback={fb} alt={p.title} size="lg" tilt="r" />
                      <span className="pm-card-icon big" aria-hidden>
                        <ServiceIcon3D tag={p.tag} platform={p.platform} size={96} />
                      </span>
                      {p.date && <div className="pm-year" aria-hidden>{p.date}</div>}
                    </div>
                  )}

                  {(i === 1 || i === 2) && (
                    <div className="pm-stage side-stage">
                      <div className="pm-ovl num">
                        <span className="pm-ovl-ic" aria-hidden>
                          <ServiceIcon3D tag={p.tag} platform={p.platform} size={44} />
                        </span>
                        <b>{p.tag ?? platformName}</b>
                        <span>{platformName}</span>
                      </div>
                      <IPhone src={p.image_url} fallback={fb} alt={p.title} size="md" tilt={i === 1 ? "l" : "r"} />
                      {p.date && <div className="pm-year side-year" aria-hidden>{p.date}</div>}
                    </div>
                  )}

                  {i === 3 && (
                    <div className="pm-stage wide-stage">
                      <IPhone src={p.image_url} fallback={fb} alt={p.title} size="lg" />
                      <div className="pm-spot">
                        <span className="pm-card-icon" aria-hidden>
                          <ServiceIcon3D tag={p.tag} platform={p.platform} size={54} />
                        </span>
                        <h3>{p.title}</h3>
                        {p.result && <p className="pm-spot-sub">{p.result}</p>}
                        {p.tag && <span className="pm-mini-tag">{p.tag}</span>}
                      </div>
                      {p.date && <div className="pm-year wide-year" aria-hidden>{p.date}</div>}
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
            {feedbacks.map((c, i) => (
              <div className="pm-fb" key={c.id}>
                <div className="pm-fb-header">
                  <div className="pm-fb-stars">{"★".repeat(Math.min(5, Math.max(1, c.rating ?? 5)))}</div>
                  {c.date && <span className="pm-fb-date">{c.date}</span>}
                </div>
                <p>“{c.quote}”</p>
                <div className="pm-fb-person">
                  <PersonAvatar name={c.name} avatarUrl={c.image_url} hue={hueOf(i)} size={40} />
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
          <div className="pm-foot-wm">
            <Wordmark className="foot" />
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
/* --- (base/nav/hero CSS moved to globals.css for instant rendering) --- */

/* ===== hero: nền vũ trụ động ===== */
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
.pm-hero-logo-row{display:flex;align-items:center;justify-content:center;width:100%;margin-bottom:12px;gap:0;max-width:98vw;}
.pm-mark3d{position:relative;width:clamp(220px,36vw,480px);perspective:1300px;z-index:10;flex-shrink:0;}
/* mark 3D nhiều lớp: style nằm trong premiumKit */
.pm-mark-glow{position:absolute;left:50%;bottom:-6%;transform:translateX(-50%);width:72%;height:36px;border-radius:50%;
 background:radial-gradient(ellipse,rgba(20,184,166,.45),transparent 70%);filter:blur(9px);}
.pm-word3d{position:relative;display:inline-block;z-index:1;
 font-family:var(--pm-font-display);font-weight:400;font-size:clamp(40px,9vw,140px);line-height:1.2;transform:scaleY(1.7);
 text-transform:uppercase;}
.pm-word3d.left {flex:1;text-align:right;letter-spacing:0.12em;margin-right:-4.5vw;}
.pm-word3d.right {flex:1;text-align:left;letter-spacing:-0.02em;margin-left:-2vw;}
.pm-hero-tag{margin-top:clamp(-20px,1vh,10px);display:inline-block;font-size:11.5px;letter-spacing:2px;
 text-transform:uppercase;color:#5eead4;border:1px solid rgba(94,234,212,.32);background:rgba(94,234,212,.06);
 padding:7px 16px;border-radius:100px;font-weight:700;z-index:2;position:relative;}
.pm-hero-h1{margin:10px 0 0;font-size:clamp(26px,4vw,46px);font-weight:800;letter-spacing:-.8px;color:#eef3fb;
 font-family:var(--font-grotesk),'Inter',sans-serif;}
.pm-holo{background:linear-gradient(90deg,#5eead4,#67e8f9,#a7f3d0,#5eead4);background-size:250% 100%;
 -webkit-background-clip:text;background-clip:text;color:transparent;animation:pmHolo 6s linear infinite;}
@keyframes pmHolo{to{background-position:250% 0}}
.pm-statline{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 30px;margin-top:clamp(18px,3vh,28px);
 font-size:13.5px;color:var(--muted);}
.pm-statline b{color:#5eead4;font-size:16px;margin-right:5px;}

/* wordmark footer + link "xem tất cả" */
.pm-foot-wm{margin-bottom:10px;}
.pm-label-link{display:block;}
.pm-label-link:hover .pm-label{color:var(--cyan);}
.pm-viewall{margin-bottom:26px;font-size:13.5px;font-weight:700;color:var(--cyan);letter-spacing:.5px;transition:.2s;}
.pm-viewall:hover{text-shadow:0 0 18px rgba(45,212,191,.7);}

/* ===== marquee thương hiệu ===== */
.pm-marquee-wrap{display:flex;align-items:center;margin:26px 0 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
 background:rgba(4,14,18,.5);overflow:hidden;}
.pm-marquee-label{flex-shrink:0;padding:16px 26px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
 color:var(--cyan);border-right:1px solid var(--line);}
.pm-marquee{flex:1;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);
 mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);}
.pm-marquee-track{display:flex;width:max-content;animation:pmMarquee 32s linear infinite;}
.pm-marquee-item{font-family:var(--pm-font-heading);font-weight:600;font-size:17px;text-transform:uppercase;letter-spacing:1.5px;
 color:#a9bfce;white-space:nowrap;padding:15px 0 15px 34px;}
.pm-marquee-item i{font-style:normal;color:rgba(56,189,248,.55);font-size:12px;margin-left:34px;}
@keyframes pmMarquee{to{transform:translateX(-50%)}}

/* ===== section chung ===== */
.pm-section{padding:clamp(48px,7vw,84px) 0 0;}
.pm-label{font-family:var(--pm-font-heading);font-weight:700;font-size:17px;letter-spacing:3px;text-transform:uppercase;
 color:#93aabb;margin:0 0 26px;}
.pm-label.center{text-align:center;}
.pm-label-row{display:flex;justify-content:space-between;align-items:center;}

/* ===== services (card 3D nghiêng theo chuột + glare) ===== */
.pm-services{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.pm-svcwrap{border-radius:18px;}
.pm-svc-ic{display:inline-flex;width:64px;height:64px;align-items:center;justify-content:center;border-radius:16px;
 background:rgba(45,212,191,.08);border:1px solid rgba(45,212,191,.25);
 animation:pmFloat 5.5s ease-in-out infinite;
 filter:drop-shadow(0 10px 26px rgba(45,212,191,.3));
 perspective:400px;}
.pm-svc-ic svg{transform:rotateX(12deg) rotateY(-12deg);transition:.4s ease;filter:drop-shadow(0 4px 10px rgba(0,0,0,.5));}
.pm-svc{position:relative;display:flex;flex-direction:column;gap:10px;padding:26px 22px;min-height:216px;
 background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;transition:.25s;}
.pm-svc:hover .pm-svc-ic svg{transform:rotateX(0deg) rotateY(0deg) scale(1.15);filter:drop-shadow(0 8px 18px rgba(45,212,191,.5));}
.pm-svc-halo{position:absolute;top:-46px;right:-46px;width:120px;height:120px;border-radius:50%;
 background:radial-gradient(circle,rgba(45,212,191,.22),transparent 70%);}
.pm-svc h3{font-family:var(--pm-font-heading);font-weight:700;font-size:18px;margin:8px 0 0;color:#fff;}
.pm-svc p{margin:0;color:var(--muted);font-size:13px;line-height:1.55;flex:1;}
.pm-svc-go{color:var(--cyan);font-size:12.5px;font-weight:700;}
.pm-svc:hover{border-color:rgba(45,212,191,.5);background:rgba(45,212,191,.05);transform:translateY(-4px);}

/* ===== bento portfolio ===== */
.pm-bento{display:grid;grid-template-columns:repeat(12,1fr);gap:22px;grid-auto-rows:1fr;}
.pm-card{position:relative;overflow:hidden;border-radius:24px;border:1px solid rgba(45,212,191,.22);
 background:
  radial-gradient(560px 300px at 18% 88%,rgba(13,148,136,.16),transparent 65%),
  radial-gradient(520px 280px at 85% 12%,rgba(8,145,178,.15),transparent 70%),
  linear-gradient(180deg,#06161c 0%,#03090d 100%);
 display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.45);
 container-type:inline-size;height:100%;justify-content:center;}
.pm-card:nth-child(1),.pm-card:nth-child(4){grid-column:span 12;}
.pm-card:nth-child(2),.pm-card:nth-child(3){grid-column:span 6;}

/* slider dự án 5+ */
.pm-mini-tag{display:inline-block;margin-top:10px;font-size:10.5px;font-weight:800;letter-spacing:1px;
 text-transform:uppercase;color:#03222e;background:linear-gradient(90deg,#5eead4,#22d3ee);
 padding:4px 12px;border-radius:100px;}
.pm-card-bgword{position:absolute;top:46%;left:50%;transform:translate(-50%,-50%);font-family:var(--pm-font-display);
 font-size:clamp(40px,20cqw,180px);letter-spacing:6px;color:rgba(180,220,245,.04);white-space:nowrap;pointer-events:none;max-width:100%;overflow:hidden;text-overflow:clip;text-align:center;}

.pm-stage{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;
 gap:clamp(26px,5vw,70px);padding:clamp(36px,5vw,60px) clamp(20px,4vw,56px) clamp(24px,3vw,36px);flex:1;}
.pm-ovl{display:flex;flex-direction:column;line-height:1.02;}
.pm-ovl b{font-family:var(--pm-font-display);font-weight:400;font-size:clamp(34px,4.6vw,60px);color:#fff;letter-spacing:1px;
 text-shadow:0 6px 34px rgba(0,0,0,.6);}
.pm-ovl span{font-family:var(--pm-font-heading);font-weight:600;font-size:clamp(16px,2vw,25px);color:var(--cyan);
 letter-spacing:2px;margin-top:8px;text-shadow:0 0 26px rgba(56,189,248,.5);}
.pm-ovl.num b{font-size:clamp(50px,6.4vw,92px);
 background:linear-gradient(180deg,#bae6fd 0%,#38bdf8 48%,#0369a1 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;
 filter:drop-shadow(0 8px 30px rgba(2,60,90,.6));}
/* icon dịch vụ 3D trên thẻ dự án — trôi bồng bềnh + glow */
.pm-card-icon{display:inline-flex;animation:pmFloat 6s ease-in-out infinite;}
.pm-ovl-ic{display:inline-flex;margin-bottom:12px;}
.pm-spot .pm-card-icon{margin-bottom:16px;}
.pm-sic{display:inline-flex;align-items:center;justify-content:center;perspective:520px;}
.pm-sic>svg{animation:pmIcSway 4.6s ease-in-out infinite alternate;
 filter:drop-shadow(0 12px 26px rgba(45,212,191,.45)) drop-shadow(0 3px 8px rgba(0,0,0,.5));}
@keyframes pmIcSway{from{transform:rotateY(-24deg) translateY(0)}to{transform:rotateY(24deg) translateY(-6px)}}
.pm-sic-wave{animation:pmWave 2.4s ease-in-out infinite;}
.pm-sic-wave.w2{animation-delay:.4s;}
@keyframes pmWave{0%,100%{opacity:.25}50%{opacity:1}}

/* card 3: đảo chiều để nhịp bento so le */
.pm-card:nth-child(3) .pm-stage{flex-direction:row-reverse;}

/* card 4: spotlight — phone trái, thông tin phải */
.pm-spot{max-width:460px;}
.pm-spot h3{font-family:var(--pm-font-heading);font-weight:700;font-size:clamp(28px,3.4vw,44px);margin:0;letter-spacing:.5px;}
.pm-spot-sub{color:var(--muted);font-size:14px;margin:18px 0 0;}

.pm-card-info{position:relative;z-index:2;padding:0 clamp(20px,3vw,30px) clamp(20px,3vw,26px);}
.pm-card-info h3{font-family:var(--pm-font-heading);font-weight:700;font-size:clamp(19px,2.2vw,25px);margin:0 0 6px;letter-spacing:.5px;}
.pm-card-info p{margin:0;color:var(--muted);font-size:13px;}

.pm-year{font-family:var(--pm-font-display);font-size:clamp(58px,8.5vw,128px);letter-spacing:2px;line-height:1;
 background:linear-gradient(180deg,#7dd3fc 0%,#0ea5e9 52%,#075985 100%);
 -webkit-background-clip:text;background-clip:text;color:transparent;
 filter:drop-shadow(0 10px 34px rgba(2,60,90,.65));position:absolute;z-index:0;opacity:0.3;pointer-events:none;}
.hero-stage .pm-year{bottom:10%;left:5%;}
.side-stage .pm-year{bottom:25%;right:5%;font-size:clamp(48px,5vw,90px);}
.wide-stage .pm-year{bottom:15%;right:15%;}

/* ===== iPhone mockup: style nằm trong premiumKit ===== */

/* ===== clients ===== */
.pm-clients{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;gap:12px 0;max-width:1020px;
 margin:0 auto;text-align:center;}
.pm-client{display:inline-flex;align-items:baseline;font-family:var(--pm-font-heading);font-weight:600;
 font-size:clamp(19px,2.9vw,33px);text-transform:uppercase;letter-spacing:1px;color:#d7e4ee;white-space:nowrap;transition:.2s;}
.pm-client>span:hover{color:var(--cyan);text-shadow:0 0 30px rgba(56,189,248,.5);}
.pm-client i{font-style:normal;color:rgba(56,189,248,.5);font-size:13px;margin:0 20px;}

/* ===== process ===== */
.pm-process{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line);border-radius:20px;overflow:hidden;
 background:rgba(8,11,24,.55);}
.pm-step{padding:26px 24px;border-left:1px solid var(--line);}
.pm-step:first-child{border-left:none;}
.pm-step-num{font-family:var(--pm-font-display);font-size:14px;letter-spacing:3px;color:var(--cyan);}
.pm-step h4{font-family:var(--pm-font-heading);font-weight:600;font-size:16px;text-transform:uppercase;letter-spacing:.5px;margin:12px 0 7px;}
.pm-step p{margin:0;color:var(--muted);font-size:12.5px;line-height:1.6;}

/* ===== feedback ===== */
.pm-fb-grid{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:16px;scrollbar-width:none;}
.pm-fb-grid::-webkit-scrollbar{display:none;}
.pm-fb{flex:0 0 calc(33.333% - 14px);min-width:300px;background:rgba(8,11,24,.55);border:1px solid var(--line);border-radius:18px;padding:24px;display:flex;flex-direction:column;scroll-snap-align:start;}
.pm-fb-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;}
.pm-fb-stars{color:#fbbf24;letter-spacing:2px;font-size:12.5px;}
.pm-fb-date{font-size:11.5px;color:var(--muted);}
.pm-fb p{margin:0 0 18px;font-size:14px;line-height:1.65;color:#c7d6e2;flex:1;}
.pm-fb-person{display:flex;align-items:center;gap:11px;}
.pm-fb-person b{display:block;font-size:13.5px;}
.pm-fb-person span{font-size:11.5px;color:var(--muted);}

/* ===== footer ===== */
.pm-footer{padding:clamp(56px,8vw,96px) 0 0;text-align:center;}
.pm-wordmark.small{font-size:clamp(26px,4vw,42px);margin-bottom:10px;}
.pm-foot-title{font-family:var(--pm-font-display);font-weight:400;font-size:clamp(34px,6vw,64px);text-transform:uppercase;
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
 .pm-spot{max-width:none;text-align:center;}
 .pm-card-info{text-align:center;}
 .pm-process{grid-template-columns:1fr 1fr;}
 .pm-step:nth-child(3){border-left:none;}
 .pm-step:nth-child(n+3){border-top:1px solid var(--line);}
 .pm-fb-grid{grid-template-columns:1fr;}
}
 /* ===== điện thoại (iPhone 13/14/15: 390–430px) ===== */
 @media(max-width:560px){
  .pm-nav{padding:10px 14px;}
  .pm-hero{padding:36px 16px 48px;}
  .pm-hero-logo-row{flex-direction:column;align-items:center;gap:16px;}
  .pm-mark3d{width:min(240px,64vw);}
  .pm-word3d{font-size:20vw;line-height:1;}
  .pm-word3d.left {text-align:center;margin:0;}
  .pm-word3d.right {text-align:center;margin:0;}
  .pm-hero-tag{font-size:10px;letter-spacing:1.2px;padding:6px 12px;margin-top:8px;}
  .pm-hero-h1{font-size:24px;letter-spacing:-.5px;padding:0 4px;}
  .pm-statline{gap:8px 18px;font-size:12.5px;}
  .pm-statline b{font-size:14.5px;}
  .pm-planet.pl1{left:8%;top:16%;}
  .pm-planet.pl2{right:-4%;top:60%;}
  .pm-marquee-label{padding:13px 14px;font-size:10px;}
  .pm-marquee-item{font-size:14px;padding:12px 0 12px 22px;}
  .pm-marquee-item i{margin-left:22px;}
  .pm-services{grid-template-columns:1fr;}
  .pm-svc{padding:22px 18px;}
  .pm-stage{gap:22px;padding:28px 16px 20px;}
  .pm-ovl b{font-size:30px;}
  .pm-ovl span{font-size:15px;}
  .pm-card-icon.big{transform:scale(.62);transform-origin:center;}
  .pm-spot h3{font-size:24px;}
  .pm-card-bgword{font-size:78px;}
  .pm-viewall{font-size:12px;}
  .pm-client{font-size:17px;}
  .pm-client i{margin:0 12px;}
  .pm-process{grid-template-columns:1fr;}
  .pm-step{border-left:none;}
  .pm-step:nth-child(n+2){border-top:1px solid var(--line);}
  .pm-foot-title{font-size:30px;}
  .pm-btn{padding:16px 40px;font-size:15px;}
  .pm-footbar{justify-content:center;}
 }
      `}</style>
    </div>
  );
}
