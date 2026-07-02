"use client";

import { useRef } from "react";
import Link from "next/link";
import { HeroOrb } from "@/components/art";
import { BrandLogo, PlatformIcon, PersonAvatar, Platform } from "@/components/brand";
import Tilt from "@/components/tilt";
import { site, siteText } from "@/lib/site";
import { useLang, Lang } from "@/lib/i18n";

const WORK = (lang: Lang): { slug: string; title: string; desc: string; icon: Platform; accent: string; bg: string }[] => [
  { slug: "tiktok", title: "TikTok Verification", desc: lang === "en" ? "Official badge for a 2.1M-follower channel in 18 days." : "Tích xanh chính thống cho kênh 2.1M follow trong 18 ngày.", icon: "tiktok", accent: "#2dd4bf", bg: "linear-gradient(150deg,#0f2233,#0a1420)" },
  { slug: "facebook", title: "Facebook Recovery", desc: lang === "en" ? "Locked fanpage recovered within just 48 hours." : "Khôi phục Fanpage bị khóa chỉ trong 48 giờ.", icon: "facebook", accent: "#3b82f6", bg: "linear-gradient(150deg,#0e1b33,#0a1420)" },
  { slug: "instagram-threads", title: "Instagram Verified", desc: lang === "en" ? "Verified badge for Instagram & Threads accounts." : "Huy hiệu xác minh cho tài khoản Instagram & Threads.", icon: "instagram", accent: "#ec4899", bg: "linear-gradient(150deg,#2a1230,#0a1420)" },
  { slug: "bao-chi", title: lang === "en" ? "Press PR Booking" : "Báo chí PR Booking", desc: lang === "en" ? "6 major outlets booked for a launch campaign." : "Booking 6 đầu báo lớn cho chiến dịch ra mắt.", icon: "press", accent: "#f59e0b", bg: "linear-gradient(150deg,#2a2010,#0a1420)" },
];

const SERVICES = (lang: Lang): { slug: string; icon: Platform; name: string; desc: string }[] => [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", desc: lang === "en" ? "Badge, account recovery, livestream & shop cart unlocks." : "Tích xanh, mở khóa tài khoản, livestream & giỏ hàng." },
  { slug: "facebook", icon: "facebook", name: "Facebook", desc: lang === "en" ? "Badge and recovery for personal accounts & fanpages." : "Tích xanh, mở khóa cá nhân & Fanpage." },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram / Threads", desc: lang === "en" ? "Official badge & account recovery per Meta policy." : "Tích xanh chính thống & mở khóa tài khoản." },
  { slug: "bao-chi", icon: "press", name: lang === "en" ? "Press & PR" : "Báo chí", desc: lang === "en" ? "Press booking & PR writing on major news outlets." : "Booking báo chí & viết bài PR trên đầu báo lớn." },
];

const TX = {
  vi: {
    nav: ["Dịch vụ", "Dự án", "Quy trình", "Liên hệ"],
    heroSub1: "Nâng tầm hiện diện số của bạn.",
    heroSub2: "Tích xanh chính thống & bảo vệ tài khoản.",
    explore: "Khám phá dịch vụ",
    servicesTag: "Dịch vụ",
    servicesTitle: "Bốn nền tảng chủ lực",
    detail: "Xem chi tiết →",
    workTitle: "Featured Work",
    caseBtn: "Xem case study",
    processTag: "Quy trình",
    processTitle: "Minh bạch trong 4 bước",
    steps: [
      ["Tư vấn & khảo sát", "Đánh giá hiện trạng, xác định phương án và khả năng thành công."],
      ["Báo giá & cam kết", "Minh bạch chi phí, cam kết thời gian và bảo hành bằng văn bản."],
      ["Triển khai", "Đúng chính sách nền tảng, cập nhật tiến độ liên tục."],
      ["Bàn giao & bảo hành", "Bàn giao kết quả và hỗ trợ theo đúng cam kết."],
    ],
    testiTag: "Feedback",
    testiTitle: "Khách hàng nói gì",
    ctaTitle1: "Sẵn sàng nâng tầm",
    ctaTitle2: "uy tín số?",
    ctaBtn: "Liên hệ ngay",
    prev: "Trước",
    next: "Sau",
  },
  en: {
    nav: ["Services", "Work", "Process", "Contact"],
    heroSub1: "Elevating Your Digital Presence.",
    heroSub2: "Social Media Verification & Account Security.",
    explore: "Explore Services",
    servicesTag: "Services",
    servicesTitle: "Four core platforms",
    detail: "View details →",
    workTitle: "Featured Work",
    caseBtn: "View Case Study",
    processTag: "Process",
    processTitle: "Transparent in 4 steps",
    steps: [
      ["Consultation & audit", "Assess the current state, define the approach and success odds."],
      ["Quote & commitment", "Transparent cost, written timeline and warranty commitment."],
      ["Execution", "Strictly within platform policies, with continuous updates."],
      ["Handover & warranty", "Results delivered and supported as committed."],
    ],
    testiTag: "Feedback",
    testiTitle: "What clients say",
    ctaTitle1: "Ready to elevate your",
    ctaTitle2: "digital trust?",
    ctaBtn: "Let's Talk",
    prev: "Previous",
    next: "Next",
  },
};

export default function OptionE() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const t = TX[lang];
  const st = siteText(lang);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".ope-card");
    const amount = card ? card.offsetWidth + 24 : 360;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="ope-root" id="ope-top">
      <div className="ope-bg" />
      <nav className="ope-nav">
        <a href="#ope-top" className="ope-logo">
          <BrandLogo size={30} showText textColor="#eef3f6" />
        </a>
        <div className="ope-menu">
          <a href="#ope-services">{t.nav[0]}</a>
          <a href="#ope-work">{t.nav[1]}</a>
          <a href="#ope-process">{t.nav[2]}</a>
          <a href="#ope-contact">{t.nav[3]}</a>
        </div>
      </nav>

      <header className="ope-hero">
        <div className="ope-hero-orb">
          <HeroOrb />
        </div>
        <div className="ope-hero-text">
          <h1>VDuyStudio</h1>
          <p>
            {t.heroSub1}
            <br />
            {t.heroSub2}
          </p>
          <a href="#ope-services" className="ope-btn">
            {t.explore} <span>→</span>
          </a>
        </div>
      </header>

      {/* STATS */}
      <div className="ope-stats">
        {st.stats.map((s, i) => (
          <div className="ope-stat" key={i}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <section className="ope-section" id="ope-services">
        <div className="ope-sec-head">
          <div>
            <div className="ope-sec-tag">{t.servicesTag}</div>
            <h2>{t.servicesTitle}</h2>
          </div>
        </div>
        <div className="ope-services">
          {SERVICES(lang).map((s) => (
            <Link href={`/dich-vu/${s.slug}`} className="ope-service" key={s.slug}>
              <PlatformIcon kind={s.icon} size={44} />
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <span className="ope-service-link">{t.detail}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="ope-section" id="ope-work">
        <div className="ope-sec-head">
          <h2>{t.workTitle}</h2>
          <div className="ope-arrows">
            <button aria-label={t.prev} onClick={() => scrollBy(-1)}>
              ‹
            </button>
            <button aria-label={t.next} onClick={() => scrollBy(1)}>
              ›
            </button>
          </div>
        </div>

        <div className="ope-track" ref={trackRef}>
          {WORK(lang).map((w, i) => (
            <Tilt className="ope-card" glare key={i}>
              <Link href={`/dich-vu/${w.slug}`} className="ope-card-inner">
                <div className="ope-card-art" style={{ background: w.bg }}>
                  <span className="ope-card-glow" style={{ background: `radial-gradient(circle, ${w.accent}55, transparent 65%)` }} />
                  <span className="ope-card-plat">
                    <PlatformIcon kind={w.icon} size={72} />
                  </span>
                  <span className="ope-card-verified">
                    <svg width="26" height="26" viewBox="0 0 24 24">
                      <path d="M12 1.5l2.4 1.8 3-.2 1.1 2.8 2.6 1.5-.8 2.9.8 2.9-2.6 1.5-1.1 2.8-3-.2L12 22.5l-2.4-1.8-3 .2-1.1-2.8L2.9 16.6l.8-2.9-.8-2.9 2.6-1.5 1.1-2.8 3 .2z" fill="#1877f2" />
                      <path d="M8.5 12.2l2.3 2.3 4.7-4.9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                </div>
                <div className="ope-card-body">
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                  <span className="ope-case">
                    {t.caseBtn} <b>→</b>
                  </span>
                </div>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="ope-section" id="ope-process">
        <div className="ope-sec-head">
          <div>
            <div className="ope-sec-tag">{t.processTag}</div>
            <h2>{t.processTitle}</h2>
          </div>
        </div>
        <div className="ope-steps">
          {t.steps.map((s, i) => (
            <div className="ope-step" key={i}>
              <div className="ope-step-num">{String(i + 1).padStart(2, "0")}</div>
              <h4>{s[0]}</h4>
              <p>{s[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="ope-section" id="ope-testi">
        <div className="ope-sec-head">
          <div>
            <div className="ope-sec-tag">{t.testiTag}</div>
            <h2>{t.testiTitle}</h2>
          </div>
        </div>
        <div className="ope-testi">
          {st.testimonials.map((c) => (
            <div className="ope-tcard" key={c.name}>
              <div className="ope-tstars">★★★★★</div>
              <p>“{c.quote}”</p>
              <div className="ope-tperson">
                <PersonAvatar name={c.name} hue={c.hue} size={44} />
                <div>
                  <b>{c.name}</b>
                  <span>{c.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="ope-footer" id="ope-contact">
        <div className="ope-cta">
          <h2>
            {t.ctaTitle1} <span>{t.ctaTitle2}</span>
          </h2>
          <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="ope-btn gold">
            {t.ctaBtn}
          </a>
        </div>
        <div className="ope-footbar">
          <span>© 2026 VDuyStudio</span>
          <div className="ope-social">
            <a href={site.contact.messenger} target="_blank" rel="noreferrer" aria-label="Messenger">
              f
            </a>
            <a href={site.contact.zalo} target="_blank" rel="noreferrer" aria-label="Zalo">
              Z
            </a>
            <a href={`mailto:${site.contact.email}`} aria-label="Email">
              @
            </a>
          </div>
          <span>{site.domain}</span>
        </div>
      </footer>

      <style>{`
.ope-root{--navy:#0a1420;--navy2:#0d1b2a;--gold:#c9a227;--gold-l:#e7c873;--teal:#2dd4bf;--fg:#eef3f6;--muted:#8fa3b0;font-family:var(--font-inter),system-ui,sans-serif;background:var(--navy);color:var(--fg);min-height:100vh;position:relative;overflow-x:hidden;}
.ope-root *{box-sizing:border-box;}
.ope-root [id]{scroll-margin-top:80px;}
.ope-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:
 radial-gradient(1000px 600px at 78% 12%, rgba(45,212,191,.16), transparent 60%),
 radial-gradient(800px 500px at 15% 30%, rgba(201,162,39,.08), transparent 60%),
 linear-gradient(180deg,#0a1420,#0a1018);}
.ope-root > *:not(.ope-bg){position:relative;z-index:1;}

.ope-nav{display:flex;justify-content:space-between;align-items:center;padding:22px 44px;}
.ope-logo{font-size:19px;font-weight:800;letter-spacing:-.3px;}
.ope-menu{display:flex;gap:30px;font-size:14px;color:var(--muted);}
.ope-menu a:hover{color:var(--fg);}

.ope-hero{position:relative;min-height:68vh;display:flex;align-items:center;justify-content:center;padding:40px 44px 40px;}
.ope-hero-orb{position:absolute;top:50%;left:50%;transform:translate(-50%,-56%);z-index:0;opacity:.95;}
.ope-hero-text{position:relative;z-index:1;text-align:center;max-width:760px;}
.ope-hero-text h1{font-size:clamp(52px,11vw,140px);font-weight:800;letter-spacing:-4px;line-height:.9;margin:0;text-shadow:0 8px 40px rgba(0,0,0,.6);}
.ope-hero-text p{margin:20px auto 0;color:#cdd8df;font-size:clamp(15px,2.2vw,20px);line-height:1.5;text-shadow:0 2px 12px rgba(0,0,0,.7);}
.ope-btn{display:inline-flex;align-items:center;gap:10px;margin-top:34px;border:1px solid var(--gold);color:var(--gold-l);padding:15px 30px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;transition:.28s;background:rgba(201,162,39,.06);}
.ope-btn:hover{background:var(--gold);color:#1a1405;box-shadow:0 10px 30px rgba(201,162,39,.35);}
.ope-btn span{transition:.28s;}
.ope-btn:hover span{transform:translateX(4px);}
.ope-btn.gold{background:linear-gradient(180deg,var(--gold-l),var(--gold));color:#1a1405;border:none;}
.ope-btn.gold:hover{box-shadow:0 12px 34px rgba(201,162,39,.45);}

.ope-stats{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;padding:0 44px 10px;}
.ope-stat{flex:1;min-width:170px;max-width:250px;text-align:center;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:20px 14px;}
.ope-stat b{display:block;font-size:26px;letter-spacing:-1px;color:var(--gold-l);}
.ope-stat span{font-size:12.5px;color:var(--muted);}

.ope-section{padding:70px 44px 40px;}
.ope-sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:34px;gap:16px;}
.ope-sec-tag{color:var(--gold-l);font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
.ope-sec-head h2{font-size:clamp(26px,4vw,40px);font-weight:800;letter-spacing:-1px;margin:0;}
.ope-arrows{display:flex;gap:10px;}
.ope-arrows button{width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);color:var(--fg);font-size:22px;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;line-height:1;}
.ope-arrows button:hover{background:var(--gold);color:#1a1405;border-color:var(--gold);}

.ope-services{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.ope-service{display:flex;flex-direction:column;gap:10px;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px;color:var(--fg);transition:.25s;min-height:210px;}
.ope-service:hover{transform:translateY(-4px);border-color:rgba(201,162,39,.5);box-shadow:0 18px 40px rgba(0,0,0,.4);}
.ope-service h3{margin:8px 0 0;font-size:18px;font-weight:700;}
.ope-service p{margin:0;color:var(--muted);font-size:13px;line-height:1.55;flex:1;}
.ope-service-link{color:var(--gold-l);font-size:12.5px;font-weight:700;}

.ope-track{display:flex;gap:24px;overflow-x:auto;padding:14px 4px 30px;scroll-snap-type:x mandatory;scrollbar-width:none;}
.ope-track::-webkit-scrollbar{display:none;}
.ope-card{flex:0 0 340px;scroll-snap-align:start;border-radius:18px;}
.ope-card-inner{display:block;border-radius:18px;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 50px rgba(0,0,0,.45);color:var(--fg);height:100%;}
.ope-card-art{position:relative;aspect-ratio:16/10;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.ope-card-glow{position:absolute;width:180px;height:180px;border-radius:50%;filter:blur(8px);}
.ope-card-plat{position:relative;z-index:1;line-height:0;filter:drop-shadow(0 10px 24px rgba(0,0,0,.5));transition:transform .3s;}
.ope-card-inner:hover .ope-card-plat{transform:translateY(-4px) scale(1.05);}
.ope-card-verified{position:absolute;z-index:2;top:16px;right:16px;line-height:0;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5));}
.ope-card-body{padding:22px;}
.ope-card-body h3{font-size:20px;font-weight:700;margin:0 0 8px;letter-spacing:-.3px;}
.ope-card-body p{font-size:13.5px;color:var(--muted);line-height:1.55;margin:0 0 18px;min-height:42px;}
.ope-case{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#1a1405;background:linear-gradient(180deg,var(--gold-l),var(--gold));padding:9px 16px;border-radius:8px;transition:.2s;}
.ope-card-inner:hover .ope-case{box-shadow:0 8px 20px rgba(201,162,39,.4);}

.ope-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.ope-step{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px;}
.ope-step-num{font-size:13px;font-weight:800;color:var(--gold-l);letter-spacing:2px;margin-bottom:14px;}
.ope-step h4{margin:0 0 8px;font-size:16px;font-weight:700;}
.ope-step p{margin:0;color:var(--muted);font-size:13px;line-height:1.6;}

.ope-testi{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.ope-tcard{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px;}
.ope-tstars{color:var(--gold-l);letter-spacing:2px;font-size:13px;margin-bottom:12px;}
.ope-tcard p{margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#cfdde6;}
.ope-tperson{display:flex;align-items:center;gap:11px;}
.ope-tperson b{display:block;font-size:14px;}
.ope-tperson span{font-size:12px;color:var(--muted);}

.ope-footer{padding:40px 44px 120px;margin-top:30px;}
.ope-cta{border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:70px 40px;text-align:center;background:
 radial-gradient(600px 300px at 50% 0%, rgba(45,212,191,.14), transparent 70%),
 linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.01));}
.ope-cta h2{font-size:clamp(28px,5vw,52px);font-weight:800;letter-spacing:-1.5px;margin:0 0 30px;}
.ope-cta h2 span{color:var(--gold-l);}
.ope-footbar{display:flex;justify-content:space-between;align-items:center;margin-top:36px;color:var(--muted);font-size:13px;flex-wrap:wrap;gap:16px;}
.ope-social{display:flex;gap:10px;}
.ope-social a{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;font-weight:700;transition:.2s;}
.ope-social a:hover{background:var(--gold);color:#1a1405;border-color:var(--gold);}

@media(max-width:900px){
 .ope-services{grid-template-columns:1fr 1fr;}
 .ope-steps{grid-template-columns:1fr 1fr;}
 .ope-testi{grid-template-columns:1fr;}
}
@media(max-width:820px){
 .ope-nav{padding:18px 20px;}.ope-menu{display:none;}
 .ope-hero{padding:20px 20px 30px;min-height:56vh;}
 .ope-hero-orb{transform:translate(-50%,-52%) scale(.9);opacity:.7;}
 .ope-section{padding:50px 20px 30px;}
 .ope-stats{padding:0 20px 10px;}
 .ope-card{flex-basis:80vw;}
 .ope-footer{padding:30px 20px 120px;}
 .ope-cta{padding:50px 24px;}
}
@media(max-width:560px){
 .ope-services{grid-template-columns:1fr;}
 .ope-steps{grid-template-columns:1fr;}
}
      `}</style>
    </div>
  );
}
