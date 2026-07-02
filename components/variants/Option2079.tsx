"use client";

// GALAXY — giao diện chính thức của VDuyStudio.
// Thẩm mỹ: nền vũ trụ + hero quỹ đạo (thuần hình ảnh). Từ ngữ: chuyên nghiệp,
// không dùng ẩn dụ không gian. Dữ liệu feedback / dự án / liên hệ đọc từ
// Supabase (fallback nội dung mặc định khi DB trống).

import { useEffect, useState } from "react";
import Link from "next/link";
import Tilt from "@/components/tilt";
import { PlatformIcon, PersonAvatar, Platform } from "@/components/brand";
import { ProjectCover } from "@/components/art";
import { VDuyBadge, VDuyWordmark, VDuyLockup } from "@/components/logo";
import { useLang, Lang, LangToggle } from "@/lib/i18n";
import { siteText } from "@/lib/site";
import { site } from "@/lib/site";
import { getProcess } from "@/lib/services";
import { fetchFeedbacks, fetchProjects, DbFeedback, DbProject } from "@/lib/data";
import { useContact } from "@/lib/useContact";

const SERVICES = (lang: Lang): { slug: string; icon: Platform; name: string; desc: string }[] => [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", desc: lang === "en" ? "Verification badge · account recovery · livestream & shop cart unlocks" : "Tích xanh chính thống · mở khóa tài khoản · livestream & giỏ hàng" },
  { slug: "facebook", icon: "facebook", name: "Facebook", desc: lang === "en" ? "Verification badge · personal account & fanpage recovery" : "Tích xanh · mở khóa tài khoản cá nhân & Fanpage" },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram / Threads", desc: lang === "en" ? "Official badge & account recovery per Meta policy" : "Tích xanh & mở khóa tài khoản theo chính sách Meta" },
  { slug: "bao-chi", icon: "press", name: lang === "en" ? "Press & PR" : "Báo chí", desc: lang === "en" ? "Press booking · SEO-standard PR writing on major outlets" : "Booking báo chí · viết bài PR chuẩn SEO trên đầu báo lớn" },
];

// Dự án mặc định khi DB chưa có dữ liệu.
const DEFAULT_PROJECTS = (lang: Lang): DbProject[] => [
  { id: "d1", platform: "tiktok", tag: lang === "en" ? "TikTok · Verified" : "TikTok · Tích xanh", title: lang === "en" ? "@brand.hub — 2.1M followers" : "@brand.hub — 2.1M follow", result: lang === "en" ? "Verified in 18 days, shop cart unlocked" : "Tích xanh sau 18 ngày, mở khóa giỏ hàng", image_url: null },
  { id: "d2", platform: "facebook", tag: "Facebook · Fanpage", title: lang === "en" ? "Northern F&B fanpage" : "Fanpage F&B miền Bắc", result: lang === "en" ? "Locked fanpage recovered within 48 hours" : "Khôi phục fanpage bị khóa trong 48 giờ", image_url: null },
  { id: "d3", platform: "bao-chi", tag: lang === "en" ? "Press · PR" : "Báo chí · PR", title: lang === "en" ? "Cosmetics launch campaign" : "Chiến dịch ra mắt mỹ phẩm", result: lang === "en" ? "6 major press outlets booked" : "Booking 6 đầu báo lớn", image_url: null },
];

const TX = {
  vi: {
    nav: ["Dịch vụ", "Quy trình", "Dự án", "Feedback"],
    navCta: "Liên hệ tư vấn",
    heroTag: "Dịch vụ xác minh & bảo vệ tài khoản mạng xã hội",
    heroA: "Xây dựng",
    heroB: "uy tín số",
    heroC: "cho thương hiệu của bạn.",
    heroSub: "VDuyStudio hỗ trợ tích xanh chính thống, mở khóa tài khoản và booking báo chí cho TikTok, Facebook, Instagram/Threads — quy trình minh bạch, cam kết bằng văn bản.",
    heroCta: "Nhận tư vấn miễn phí",
    heroCta2: "Xem dịch vụ",
    svcTag: "Dịch vụ",
    svcTitle: "Bốn nền tảng chủ lực",
    svcGo: "Xem chi tiết →",
    valTag: "Cam kết",
    valTitle: "Vì sao khách hàng chọn VDuyStudio",
    values: [
      ["Chính thống", "Hồ sơ xác minh đúng chính sách nền tảng, không thủ thuật rủi ro."],
      ["Minh bạch", "Báo giá rõ ràng, cam kết thời gian và bảo hành bằng văn bản."],
      ["Đồng hành", "Cập nhật tiến độ liên tục, hỗ trợ sau bàn giao 24/7."],
    ],
    prcTag: "Quy trình làm việc",
    prcTitle: "Bốn bước minh bạch",
    step: "Bước",
    prjTag: "Dự án đã thực hiện",
    prjTitle: "Kết quả thực tế đã bàn giao",
    fbTag: "Feedback",
    fbTitle: "Khách hàng nói gì",
    ctaTitle: "Sẵn sàng nâng tầm thương hiệu?",
    ctaSub: "Nhắn tin để được tư vấn và nhận báo giá miễn phí ngay hôm nay.",
    ctaBtn: "Liên hệ VDuyStudio",
  },
  en: {
    nav: ["Services", "Process", "Projects", "Feedback"],
    navCta: "Get in touch",
    heroTag: "Social media verification & account protection services",
    heroA: "Building",
    heroB: "digital trust",
    heroC: "for your brand.",
    heroSub: "VDuyStudio provides official verification badges, account recovery and press booking for TikTok, Facebook, Instagram/Threads — transparent process, committed in writing.",
    heroCta: "Get free consultation",
    heroCta2: "View services",
    svcTag: "Services",
    svcTitle: "Four core platforms",
    svcGo: "View details →",
    valTag: "Commitment",
    valTitle: "Why clients choose VDuyStudio",
    values: [
      ["Official", "Verification dossiers follow platform policy — no risky tricks."],
      ["Transparent", "Clear quotes, written timeline and warranty commitments."],
      ["Supportive", "Continuous progress updates, 24/7 post-delivery support."],
    ],
    prcTag: "How we work",
    prcTitle: "Four transparent steps",
    step: "Step",
    prjTag: "Delivered projects",
    prjTitle: "Real results, delivered",
    fbTag: "Feedback",
    fbTitle: "What clients say",
    ctaTitle: "Ready to elevate your brand?",
    ctaSub: "Message us today for free consultation and a quote.",
    ctaBtn: "Contact VDuyStudio",
  },
};

export default function OptionGalaxy() {
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
    return () => {
      mounted = false;
    };
  }, []);

  const feedbacks: DbFeedback[] =
    dbFeedbacks ??
    st.testimonials.map((c, i) => ({
      id: `t${i}`,
      name: c.name,
      company: c.company,
      quote: c.quote,
      rating: 5,
      image_url: null,
    }));
  const hueOf = (i: number) => [330, 210, 160, 40, 280, 120][i % 6];
  const projects = dbProjects ?? DEFAULT_PROJECTS(lang);

  return (
    <div className="gx-root" id="gx-top">
      {/* NỀN VŨ TRỤ (thuần trang trí) */}
      <div className="gx-space" aria-hidden>
        <div className="gx-stars s1" />
        <div className="gx-stars s2" />
        <div className="gx-nebula" />
        <span className="gx-comet c1" />
        <span className="gx-comet c2" />
      </div>

      {/* NAV */}
      <nav className="gx-nav">
        <a href="#gx-top" className="gx-brand">
          <VDuyBadge size={30} intro={false} />
          <VDuyWordmark fontSize={15} shine={false} />
        </a>
        <div className="gx-menu">
          <a href="#gx-services">{t.nav[0]}</a>
          <a href="#gx-process">{t.nav[1]}</a>
          <a href="#gx-projects">{t.nav[2]}</a>
          <a href="#gx-feedback">{t.nav[3]}</a>
        </div>
        <div className="gx-nav-right">
          <LangToggle compact />
          <a href={contact.zalo} target="_blank" rel="noreferrer" className="gx-navcta">
            {t.navCta}
          </a>
        </div>
      </nav>

      {/* HERO — logo lockup + hệ quỹ đạo */}
      <header className="gx-hero">
        <div className="gx-hero-text">
          <div className="gx-hero-tag">✦ {t.heroTag}</div>
          <div className="gx-hero-lockup">
            <VDuyLockup
              badgeSize={92}
              wordSize={40}
              iconSize={46}
              taglineColor="var(--muted)"
              barColor="var(--cyan)"
              tagline={lang === "en" ? "Verification · Account rescue · Press booking" : "Tích xanh · Cứu tài khoản · Booking báo chí"}
            />
          </div>
          <h1>
            {t.heroA} <span className="gx-holo">{t.heroB}</span> {t.heroC}
          </h1>
          <p>{t.heroSub}</p>
          <div className="gx-hero-cta">
            <a href={contact.zalo} target="_blank" rel="noreferrer" className="gx-btn">
              {t.heroCta}
            </a>
            <a href="#gx-services" className="gx-btn ghost">
              {t.heroCta2}
            </a>
          </div>
          <div className="gx-statline">
            {st.stats.map((s, i) => (
              <span key={i}>
                <b>{s.value}</b> {s.label}
              </span>
            ))}
          </div>
        </div>

        <div className="gx-system" aria-hidden>
          <div className="gx-orbit o1" />
          <div className="gx-orbit o2" />
          <div className="gx-sun">
            <VDuyBadge size={104} intro={false} />
          </div>
          <div className="gx-ring r1">
            {(["tiktok", "instagram"] as Platform[]).map((k, i) => (
              <span className="gx-sat" style={{ ["--a" as string]: `${i * 180}deg` }} key={k}>
                <span className="gx-sat-inner ri1">
                  <PlatformIcon kind={k} size={42} />
                </span>
              </span>
            ))}
          </div>
          <div className="gx-ring r2">
            {(["facebook", "press"] as Platform[]).map((k, i) => (
              <span className="gx-sat far" style={{ ["--a" as string]: `${90 + i * 180}deg` }} key={k}>
                <span className="gx-sat-inner ri2">
                  <PlatformIcon kind={k} size={38} />
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* DỊCH VỤ */}
      <section className="gx-section" id="gx-services">
        <div className="gx-sec-tag">{t.svcTag}</div>
        <h2>{t.svcTitle}</h2>
        <div className="gx-stations">
          {SERVICES(lang).map((s) => (
            <Tilt className="gx-stationwrap" max={8} glare key={s.slug}>
              <Link href={`/dich-vu/${s.slug}`} className="gx-station">
                <span className="gx-station-halo" />
                <PlatformIcon kind={s.icon} size={46} />
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <span className="gx-station-go">{t.svcGo}</span>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      {/* CAM KẾT */}
      <section className="gx-section" id="gx-values">
        <div className="gx-sec-tag">{t.valTag}</div>
        <h2>{t.valTitle}</h2>
        <div className="gx-values">
          {t.values.map((v, i) => (
            <div className="gx-value" key={i}>
              <span className="gx-value-num">0{i + 1}</span>
              <b>{v[0]}</b>
              <p>{v[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUY TRÌNH */}
      <section className="gx-section" id="gx-process">
        <div className="gx-sec-tag">{t.prcTag}</div>
        <h2>{t.prcTitle}</h2>
        <div className="gx-launch">
          {getProcess(lang).map((s, i) => (
            <div className="gx-lstep" key={i}>
              <span className="gx-lcount">{t.step} 0{i + 1}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DỰ ÁN — bento */}
      <section className="gx-section" id="gx-projects">
        <div className="gx-sec-tag">{t.prjTag}</div>
        <h2>{t.prjTitle}</h2>
        <div className="gx-bento">
          {projects.map((p) => (
            <div className="gx-bcard" key={p.id}>
              <div className="gx-bcover">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.title} loading="lazy" />
                ) : (
                  <ProjectCover platform={p.platform ?? "tiktok"} handle={p.id} tag={p.tag ?? ""} />
                )}
                {p.tag && <span className="gx-btag">{p.tag}</span>}
              </div>
              <div className="gx-bbody">
                <h4>{p.title}</h4>
                {p.result && <p>{p.result}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="gx-section" id="gx-feedback">
        <div className="gx-sec-tag">{t.fbTag}</div>
        <h2>{t.fbTitle}</h2>
        <div className="gx-signals">
          {feedbacks.map((c, i) => (
            <div className="gx-signal" key={c.id}>
              {c.image_url && (
                <div className="gx-signal-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image_url} alt={c.name} loading="lazy" />
                </div>
              )}
              <div className="gx-signal-stars">{"★".repeat(Math.min(5, Math.max(1, c.rating ?? 5)))}</div>
              <p>“{c.quote}”</p>
              <div className="gx-signal-person">
                <PersonAvatar name={c.name} hue={hueOf(i)} size={44} />
                <div>
                  <b>{c.name}</b>
                  {c.company && <span>{c.company}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <footer className="gx-footer" id="gx-cta">
        <div className="gx-cta">
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaSub}</p>
          <a href={contact.zalo} target="_blank" rel="noreferrer" className="gx-btn big">
            {t.ctaBtn}
          </a>
        </div>
        <div className="gx-footbar">
          <span>© 2026 VDuyStudio</span>
          <span>{site.domain}</span>
        </div>
      </footer>

      <style>{`
.gx-root{--bg:#03040c;--fg:#e8ecff;--muted:#8b93b8;--line:rgba(139,147,184,.2);--cyan:#67e8f9;--vio:#a78bfa;--pink:#f0abfc;
 font-family:var(--font-grotesk),var(--font-inter),sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;position:relative;overflow-x:hidden;
 padding-bottom:calc(24px + env(safe-area-inset-bottom));}
.gx-root *{box-sizing:border-box;}
.gx-root [id]{scroll-margin-top:76px;}

/* ===== nền vũ trụ ===== */
.gx-space{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.gx-stars{position:absolute;inset:-100px;background-repeat:repeat;}
.gx-stars.s1{background-image:
 radial-gradient(1.2px 1.2px at 25px 35px,#fff,transparent),
 radial-gradient(1px 1px at 125px 88px,rgba(255,255,255,.8),transparent),
 radial-gradient(1.4px 1.4px at 210px 160px,#cfe3ff,transparent),
 radial-gradient(1px 1px at 310px 55px,rgba(255,255,255,.7),transparent),
 radial-gradient(1.1px 1.1px at 80px 220px,#fff,transparent),
 radial-gradient(.9px .9px at 260px 260px,rgba(255,255,255,.6),transparent);
 background-size:360px 320px;animation:gxDrift 90s linear infinite;}
.gx-stars.s2{background-image:
 radial-gradient(1.6px 1.6px at 60px 120px,#a5f3fc,transparent),
 radial-gradient(1.2px 1.2px at 180px 40px,#e9d5ff,transparent),
 radial-gradient(1px 1px at 300px 200px,#fff,transparent),
 radial-gradient(1.3px 1.3px at 140px 280px,rgba(255,255,255,.85),transparent);
 background-size:420px 380px;animation:gxDrift 140s linear infinite reverse;opacity:.8;}
@keyframes gxDrift{to{transform:translateY(-320px)}}
.gx-nebula{position:absolute;inset:0;background:
 radial-gradient(700px 500px at 78% 12%,rgba(103,232,249,.1),transparent 65%),
 radial-gradient(640px 520px at 12% 34%,rgba(167,139,250,.12),transparent 65%),
 radial-gradient(700px 600px at 55% 105%,rgba(240,171,252,.08),transparent 65%);}
.gx-comet{position:absolute;width:130px;height:1.5px;background:linear-gradient(90deg,#fff,transparent);border-radius:2px;opacity:0;transform:rotate(-35deg);}
.gx-comet.c1{top:14%;left:70%;animation:gxComet 9s ease-in 2s infinite;}
.gx-comet.c2{top:56%;left:16%;animation:gxComet 13s ease-in 6s infinite;}
@keyframes gxComet{0%{opacity:0;transform:rotate(-35deg) translateX(0)}4%{opacity:1}12%{opacity:0;transform:rotate(-35deg) translateX(-340px)}100%{opacity:0}}
.gx-root>*:not(.gx-space){position:relative;z-index:1;}

/* ===== nav ===== */
.gx-nav{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px clamp(16px,4vw,30px);border-bottom:1px solid var(--line);background:rgba(3,4,12,.7);backdrop-filter:blur(12px);position:sticky;top:0;z-index:40;}
.gx-brand{display:flex;align-items:center;gap:9px;min-width:0;}
.gx-menu{display:flex;gap:24px;font-size:14px;color:var(--muted);}
.gx-menu a{padding:8px 0;}
.gx-menu a:hover{color:var(--fg);}
.gx-nav-right{display:flex;align-items:center;gap:12px;flex-shrink:0;}
.gx-navcta{border:1px solid rgba(103,232,249,.4);color:var(--cyan);background:rgba(103,232,249,.06);padding:10px 18px;border-radius:100px;font-size:13px;font-weight:700;transition:.25s;white-space:nowrap;}
.gx-navcta:hover{background:var(--cyan);color:#03222a;box-shadow:0 0 26px rgba(103,232,249,.4);}

/* ===== hero ===== */
.gx-hero{max-width:1200px;margin:0 auto;padding:44px clamp(16px,4vw,30px) 60px;display:grid;grid-template-columns:1.05fr .95fr;gap:30px;align-items:center;}
.gx-hero-text{max-width:560px;}
.gx-hero-tag{display:inline-block;font-size:11.5px;letter-spacing:2px;text-transform:uppercase;color:var(--cyan);border:1px solid rgba(103,232,249,.3);background:rgba(103,232,249,.05);padding:7px 14px;border-radius:100px;margin-bottom:26px;font-weight:600;}
.gx-hero-lockup{margin-bottom:30px;}
.gx-hero-text h1{margin:0;font-size:clamp(28px,4.2vw,50px);font-weight:700;letter-spacing:-1.2px;line-height:1.14;}
.gx-holo{background:linear-gradient(90deg,var(--cyan),var(--vio),var(--pink),var(--cyan));background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gxHolo 6s linear infinite;}
@keyframes gxHolo{to{background-position:250% 0}}
.gx-hero-text p{color:var(--muted);font-size:16px;line-height:1.7;margin:20px 0 28px;}
.gx-hero-cta{display:flex;gap:12px;flex-wrap:wrap;}
.gx-btn{display:inline-block;background:linear-gradient(90deg,#22d3ee,#818cf8);color:#071018;padding:15px 28px;border-radius:100px;font-weight:700;font-size:15px;transition:.25s;box-shadow:0 12px 34px rgba(103,232,249,.25);text-align:center;}
.gx-btn:hover{transform:translateY(-2px);box-shadow:0 18px 44px rgba(103,232,249,.4);}
.gx-btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line);box-shadow:none;}
.gx-btn.ghost:hover{border-color:var(--cyan);color:var(--cyan);}
.gx-btn.big{padding:17px 38px;font-size:16px;}
.gx-statline{display:flex;flex-wrap:wrap;gap:8px 24px;margin-top:30px;font-size:13px;color:var(--muted);}
.gx-statline b{color:var(--cyan);font-size:15px;margin-right:4px;}

/* hệ quỹ đạo (trang trí) */
.gx-system{position:relative;width:min(440px,86vw);aspect-ratio:1;margin:0 auto;--r1:140px;--r2:200px;}
.gx-orbit{position:absolute;border-radius:50%;border:1px dashed rgba(139,147,184,.3);}
.gx-orbit.o1{inset:calc(50% - var(--r1));}
.gx-orbit.o2{inset:calc(50% - var(--r2));}
.gx-sun{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);filter:drop-shadow(0 0 44px rgba(24,119,242,.55));}
.gx-ring{position:absolute;inset:0;transform-origin:center;}
.gx-ring.r1{animation:gxSpin 26s linear infinite;}
.gx-ring.r2{animation:gxSpin 44s linear infinite reverse;}
@keyframes gxSpin{to{transform:rotate(360deg)}}
.gx-sat{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(var(--a)) translateX(var(--r1)) rotate(calc(var(--a) * -1));}
.gx-sat.far{transform:translate(-50%,-50%) rotate(var(--a)) translateX(var(--r2)) rotate(calc(var(--a) * -1));}
.gx-sat-inner{display:block;line-height:0;filter:drop-shadow(0 6px 18px rgba(0,0,0,.6));}
.gx-sat-inner.ri1{animation:gxSpin 26s linear infinite reverse;}
.gx-sat-inner.ri2{animation:gxSpin 44s linear infinite;}
.gx-system:hover .gx-ring,.gx-system:hover .gx-sat-inner{animation-play-state:paused;}

/* ===== section chung ===== */
.gx-section{max-width:1140px;margin:0 auto;padding:64px clamp(16px,4vw,30px);}
.gx-sec-tag{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--cyan);margin-bottom:12px;font-weight:700;}
.gx-section h2{font-size:clamp(24px,3.6vw,38px);font-weight:700;letter-spacing:-1px;margin:0 0 36px;}

/* dịch vụ */
.gx-stations{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.gx-stationwrap{border-radius:18px;}
.gx-station{position:relative;display:flex;flex-direction:column;gap:10px;background:rgba(139,147,184,.06);border:1px solid var(--line);border-radius:18px;padding:26px 22px;color:var(--fg);min-height:216px;overflow:hidden;transition:.25s;}
.gx-station-halo{position:absolute;top:-46px;right:-46px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(103,232,249,.22),transparent 70%);}
.gx-stationwrap:hover .gx-station{border-color:rgba(103,232,249,.5);background:rgba(103,232,249,.05);}
.gx-station h3{font-size:18px;font-weight:700;margin:8px 0 0;}
.gx-station p{margin:0;color:var(--muted);font-size:13px;line-height:1.55;flex:1;}
.gx-station-go{color:var(--cyan);font-size:12.5px;font-weight:700;}

/* cam kết */
.gx-values{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.gx-value{background:rgba(139,147,184,.06);border:1px solid var(--line);border-radius:18px;padding:26px 22px;}
.gx-value-num{font-size:12px;font-weight:800;letter-spacing:2px;color:var(--cyan);}
.gx-value b{display:block;font-size:18px;margin:12px 0 8px;}
.gx-value p{margin:0;color:var(--muted);font-size:13.5px;line-height:1.6;}

/* quy trình */
.gx-launch{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.gx-lstep{background:rgba(139,147,184,.06);border:1px solid var(--line);border-left:2px solid var(--cyan);border-radius:14px;padding:22px;}
.gx-lcount{font-size:12px;font-weight:800;letter-spacing:2px;color:var(--cyan);text-transform:uppercase;}
.gx-lstep h4{margin:12px 0 8px;font-size:16px;font-weight:700;}
.gx-lstep p{margin:0;color:var(--muted);font-size:13px;line-height:1.6;}

/* dự án — bento */
.gx-bento{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.gx-bcard{background:rgba(139,147,184,.06);border:1px solid var(--line);border-radius:18px;overflow:hidden;transition:.25s;}
.gx-bcard:hover{transform:translateY(-4px);border-color:rgba(103,232,249,.5);box-shadow:0 20px 44px rgba(0,0,0,.5);}
.gx-bcover{position:relative;aspect-ratio:16/10;background:#0a0f1e;line-height:0;}
.gx-bcover img{width:100%;height:100%;object-fit:cover;display:block;}
.gx-btag{position:absolute;left:12px;bottom:12px;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fff;background:rgba(3,4,12,.6);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.2);padding:4px 10px;border-radius:100px;}
.gx-bbody{padding:18px 20px 20px;}
.gx-bbody h4{margin:0 0 6px;font-size:16.5px;font-weight:700;}
.gx-bbody p{margin:0;color:var(--muted);font-size:13.5px;line-height:1.5;}

/* feedback */
.gx-signals{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.gx-signal{background:rgba(139,147,184,.06);border:1px solid var(--line);border-radius:18px;padding:22px;display:flex;flex-direction:column;}
.gx-signal-photo{margin:-22px -22px 16px;aspect-ratio:16/9;overflow:hidden;border-bottom:1px solid var(--line);line-height:0;}
.gx-signal-photo img{width:100%;height:100%;object-fit:cover;display:block;}
.gx-signal-stars{color:#fbbf24;letter-spacing:2px;font-size:13px;margin-bottom:12px;}
.gx-signal p{margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#cdd5f5;flex:1;}
.gx-signal-person{display:flex;align-items:center;gap:11px;}
.gx-signal-person b{display:block;font-size:14px;}
.gx-signal-person span{font-size:12px;color:var(--muted);}

/* cta + footer */
.gx-footer{max-width:1140px;margin:0 auto;padding:20px clamp(16px,4vw,30px) 20px;}
.gx-cta{text-align:center;border:1px solid var(--line);border-radius:26px;padding:60px 30px;background:
 radial-gradient(560px 280px at 50% 0%,rgba(103,232,249,.12),transparent 70%),rgba(139,147,184,.04);}
.gx-cta h2{font-size:clamp(26px,4.4vw,46px);font-weight:700;letter-spacing:-1.2px;margin:0 0 14px;}
.gx-cta p{color:var(--muted);margin:0 0 28px;font-size:15.5px;}
.gx-footbar{display:flex;justify-content:space-between;margin-top:26px;color:var(--muted);font-size:13px;flex-wrap:wrap;gap:12px;}

@media(prefers-reduced-motion:reduce){.gx-root *{animation:none!important}}

/* ===== tablet ===== */
@media(max-width:980px){
 .gx-hero{grid-template-columns:1fr;padding-top:30px;gap:16px;}
 .gx-hero-text{max-width:none;}
 .gx-system{width:min(340px,80vw);--r1:104px;--r2:150px;}
 .gx-stations,.gx-launch{grid-template-columns:1fr 1fr;}
 .gx-values,.gx-bento,.gx-signals{grid-template-columns:1fr 1fr;}
 .gx-menu{display:none;}
}
/* ===== điện thoại (iPhone 13/14/15: 390–430px) ===== */
@media(max-width:560px){
 .gx-nav{padding:12px 16px;}
 .gx-hero{padding:26px 16px 40px;}
 .gx-hero-tag{font-size:10.5px;letter-spacing:1.5px;}
 .gx-hero-lockup{margin-bottom:24px;}
 .gx-hero-text h1{font-size:27px;letter-spacing:-.8px;}
 .gx-hero-text p{font-size:15px;}
 .gx-hero-cta{flex-direction:column;}
 .gx-btn{width:100%;padding:16px 24px;}
 .gx-system{width:min(300px,84vw);--r1:92px;--r2:132px;margin-top:6px;}
 .gx-section{padding:44px 16px;}
 .gx-stations,.gx-launch,.gx-values,.gx-bento,.gx-signals{grid-template-columns:1fr;}
 .gx-station{min-height:0;}
 .gx-cta{padding:44px 20px;}
 .gx-footbar{justify-content:center;text-align:center;}
}
      `}</style>
    </div>
  );
}
