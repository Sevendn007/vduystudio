"use client";

// GALAXY — style tương lai theo hướng KHÔNG GIAN & THỜI GIAN.
// Ẩn dụ xuyên suốt (không bịa jargon): thương hiệu của bạn là một hành tinh;
// VDuyStudio phóng nó vào "quỹ đạo uy tín" — hero là hệ quỹ đạo với logo ở
// tâm và 4 nền tảng quay quanh; dòng thời gian Hôm qua → Hôm nay → Ngày mai;
// quy trình 4 bước là chuỗi đếm ngược phóng tàu T-3 → T-0.
// (File giữ tên Option2079.tsx để không đổi import; component là OptionGalaxy.)

import Link from "next/link";
import Tilt from "@/components/tilt";
import { PlatformIcon, PersonAvatar, Platform } from "@/components/brand";
import { VDuyBadge, VDuyWordmark } from "@/components/logo";
import { useLang, Lang } from "@/lib/i18n";
import { site, siteText } from "@/lib/site";
import { getProcess } from "@/lib/services";

const STATIONS = (lang: Lang): { slug: string; icon: Platform; name: string; desc: string }[] => [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", desc: lang === "en" ? "Badge · recovery · livestream · shop cart" : "Tích xanh · mở khóa · livestream · giỏ hàng" },
  { slug: "facebook", icon: "facebook", name: "Facebook", desc: lang === "en" ? "Badge · personal & fanpage recovery" : "Tích xanh · cứu tài khoản cá nhân & Fanpage" },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram / Threads", desc: lang === "en" ? "Badge & recovery per Meta policy" : "Tích xanh & mở khóa theo chính sách Meta" },
  { slug: "bao-chi", icon: "press", name: lang === "en" ? "Press & PR" : "Báo chí", desc: lang === "en" ? "Press booking · SEO-standard PR writing" : "Booking báo chí · viết bài PR chuẩn SEO" },
];

const MISSIONS = (lang: Lang): { slug: string; icon: Platform; title: string; result: string }[] => [
  { slug: "tiktok", icon: "tiktok", title: lang === "en" ? "@brand.hub — 2.1M followers" : "@brand.hub — 2.1M follow", result: lang === "en" ? "Verified in 18 days, shop cart unlocked" : "Tích xanh sau 18 ngày, mở khóa giỏ hàng" },
  { slug: "facebook", icon: "facebook", title: lang === "en" ? "Northern F&B fanpage" : "Fanpage F&B miền Bắc", result: lang === "en" ? "Locked fanpage recovered in 48 hours" : "Khôi phục fanpage bị khóa trong 48 giờ" },
  { slug: "bao-chi", icon: "press", title: lang === "en" ? "Cosmetics launch campaign" : "Chiến dịch ra mắt mỹ phẩm", result: lang === "en" ? "6 major press outlets booked" : "Booking 6 đầu báo lớn" },
];

const TX = {
  vi: {
    nav: ["Dịch vụ", "Hành trình", "Nhiệm vụ", "Liên hệ"],
    navCta: "Phóng ngay",
    heroTag: "VDuyStudio · Không gian uy tín số",
    heroA: "Đưa thương hiệu của bạn vào",
    heroB: "quỹ đạo uy tín.",
    heroSub: "Tích xanh chính thống, cứu tài khoản và độ phủ báo chí — bốn nền tảng xoay quanh một danh tính được xác minh.",
    heroCta: "Bắt đầu hành trình",
    heroCta2: "Xem dịch vụ",
    timeTag: "Dòng thời gian",
    timeTitle: "Hành trình thời gian của thương hiệu bạn",
    times: [
      ["HÔM QUA", "Tài khoản bị khóa, chưa có tích xanh, không ai biết bạn là chính chủ."],
      ["HÔM NAY", "VDuyStudio khảo sát, cam kết bằng văn bản và bắt đầu xử lý."],
      ["NGÀY MAI", "Danh tính được xác minh, tài khoản an toàn, báo chí nhắc tên bạn."],
    ],
    stTag: "Trạm dịch vụ",
    stTitle: "Bốn trạm trên quỹ đạo",
    stGo: "Ghé trạm →",
    launchTag: "Lịch trình phóng",
    launchTitle: "Đếm ngược 4 bước tới quỹ đạo",
    countdown: ["T-3", "T-2", "T-1", "T-0 🚀"],
    misTag: "Nhiệm vụ đã hoàn thành",
    misTitle: "Kết quả ghi nhận từ các chuyến bay trước",
    sigTag: "Tín hiệu phản hồi",
    sigTitle: "Khách hàng trên quỹ đạo nói gì",
    ctaTitle: "Cửa sổ phóng đang mở.",
    ctaSub: "Nhắn tin để nhận tư vấn & báo giá miễn phí — cam kết bằng văn bản.",
    ctaBtn: "Liên hệ VDuyStudio",
  },
  en: {
    nav: ["Services", "Journey", "Missions", "Contact"],
    navCta: "Launch now",
    heroTag: "VDuyStudio · Digital trust space",
    heroA: "Put your brand into the",
    heroB: "orbit of trust.",
    heroSub: "Official verification, account rescue and press coverage — four platforms orbiting one verified identity.",
    heroCta: "Start the journey",
    heroCta2: "View services",
    timeTag: "Timeline",
    timeTitle: "Your brand's journey through time",
    times: [
      ["YESTERDAY", "Account locked, no badge, nobody knows you're the real one."],
      ["TODAY", "VDuyStudio audits, commits in writing and starts the work."],
      ["TOMORROW", "Identity verified, account secured, the press knows your name."],
    ],
    stTag: "Service stations",
    stTitle: "Four stations on the orbit",
    stGo: "Visit station →",
    launchTag: "Launch schedule",
    launchTitle: "4-step countdown to orbit",
    countdown: ["T-3", "T-2", "T-1", "T-0 🚀"],
    misTag: "Completed missions",
    misTitle: "Results logged from previous flights",
    sigTag: "Incoming signals",
    sigTitle: "What clients in orbit say",
    ctaTitle: "The launch window is open.",
    ctaSub: "Message us for free consultation & a quote — committed in writing.",
    ctaBtn: "Contact VDuyStudio",
  },
};

export default function OptionGalaxy() {
  const { lang } = useLang();
  const t = TX[lang];
  const st = siteText(lang);
  const stations = STATIONS(lang);

  return (
    <div className="gx-root" id="gx-top">
      {/* SPACE BACKGROUND */}
      <div className="gx-space">
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
          <VDuyWordmark fontSize={19} shine={false} />
        </a>
        <div className="gx-menu">
          <a href="#gx-stations">{t.nav[0]}</a>
          <a href="#gx-time">{t.nav[1]}</a>
          <a href="#gx-missions">{t.nav[2]}</a>
          <a href="#gx-cta">{t.nav[3]}</a>
        </div>
        <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="gx-navcta">
          {t.navCta}
        </a>
      </nav>

      {/* HERO — hệ quỹ đạo */}
      <header className="gx-hero">
        <div className="gx-system" aria-hidden>
          <div className="gx-orbit o1" />
          <div className="gx-orbit o2" />
          <div className="gx-sun">
            <VDuyBadge size={110} intro={false} />
          </div>
          <div className="gx-ring r1">
            {(["tiktok", "instagram"] as Platform[]).map((k, i) => (
              <span className="gx-sat" style={{ ["--a" as string]: `${i * 180}deg`, ["--r" as string]: "150px" }} key={k}>
                <span className="gx-sat-inner ri1">
                  <PlatformIcon kind={k} size={44} />
                </span>
              </span>
            ))}
          </div>
          <div className="gx-ring r2">
            {(["facebook", "press"] as Platform[]).map((k, i) => (
              <span className="gx-sat" style={{ ["--a" as string]: `${90 + i * 180}deg`, ["--r" as string]: "215px" }} key={k}>
                <span className="gx-sat-inner ri2">
                  <PlatformIcon kind={k} size={40} />
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="gx-hero-text">
          <div className="gx-hero-tag">✦ {t.heroTag}</div>
          <h1>
            {t.heroA} <span className="gx-holo">{t.heroB}</span>
          </h1>
          <p>{t.heroSub}</p>
          <div className="gx-hero-cta">
            <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="gx-btn">
              {t.heroCta}
            </a>
            <a href="#gx-stations" className="gx-btn ghost">
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
      </header>

      {/* TIMELINE — thời gian */}
      <section className="gx-section" id="gx-time">
        <div className="gx-sec-tag">{t.timeTag}</div>
        <h2>{t.timeTitle}</h2>
        <div className="gx-timeline">
          <div className="gx-timeline-line" />
          {t.times.map((tm, i) => (
            <div className={`gx-tnode n${i}`} key={i}>
              <span className="gx-tdot" />
              <b>{tm[0]}</b>
              <p>{tm[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATIONS — dịch vụ */}
      <section className="gx-section" id="gx-stations">
        <div className="gx-sec-tag">{t.stTag}</div>
        <h2>{t.stTitle}</h2>
        <div className="gx-stations">
          {stations.map((s) => (
            <Tilt className="gx-stationwrap" max={8} glare key={s.slug}>
              <Link href={`/dich-vu/${s.slug}`} className="gx-station">
                <span className="gx-station-halo" />
                <PlatformIcon kind={s.icon} size={46} />
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <span className="gx-station-go">{t.stGo}</span>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      {/* LAUNCH COUNTDOWN — quy trình */}
      <section className="gx-section" id="gx-launch">
        <div className="gx-sec-tag">{t.launchTag}</div>
        <h2>{t.launchTitle}</h2>
        <div className="gx-launch">
          {getProcess(lang).map((s, i) => (
            <div className="gx-lstep" key={i}>
              <span className="gx-lcount">{t.countdown[i]}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSIONS — dự án */}
      <section className="gx-section" id="gx-missions">
        <div className="gx-sec-tag">{t.misTag}</div>
        <h2>{t.misTitle}</h2>
        <div className="gx-missions">
          {MISSIONS(lang).map((m) => (
            <Link href={`/dich-vu/${m.slug}`} className="gx-mission" key={m.title}>
              <PlatformIcon kind={m.icon} size={38} />
              <div>
                <b>{m.title}</b>
                <span>{m.result}</span>
              </div>
              <i className="gx-mission-check">✓</i>
            </Link>
          ))}
        </div>
      </section>

      {/* SIGNALS — feedback */}
      <section className="gx-section" id="gx-signals">
        <div className="gx-sec-tag">{t.sigTag}</div>
        <h2>{t.sigTitle}</h2>
        <div className="gx-signals">
          {st.testimonials.map((c) => (
            <div className="gx-signal" key={c.name}>
              <div className="gx-signal-stars">★★★★★</div>
              <p>“{c.quote}”</p>
              <div className="gx-signal-person">
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

      {/* CTA */}
      <footer className="gx-footer" id="gx-cta">
        <div className="gx-cta">
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaSub}</p>
          <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="gx-btn big">
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
 font-family:var(--font-grotesk),var(--font-inter),sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;position:relative;overflow-x:hidden;padding-bottom:130px;}
.gx-root *{box-sizing:border-box;}
.gx-root [id]{scroll-margin-top:84px;}

/* ===== không gian ===== */
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
.gx-nav{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 30px;border-bottom:1px solid var(--line);background:rgba(3,4,12,.6);backdrop-filter:blur(12px);position:sticky;top:0;z-index:40;}
.gx-brand{display:flex;align-items:center;gap:10px;}
.gx-menu{display:flex;gap:26px;font-size:14px;color:var(--muted);}
.gx-menu a:hover{color:var(--fg);}
.gx-navcta{border:1px solid rgba(103,232,249,.4);color:var(--cyan);background:rgba(103,232,249,.06);padding:9px 20px;border-radius:100px;font-size:13px;font-weight:700;transition:.25s;}
.gx-navcta:hover{background:var(--cyan);color:#03222a;box-shadow:0 0 26px rgba(103,232,249,.4);}

/* ===== hero hệ quỹ đạo ===== */
.gx-hero{max-width:1200px;margin:0 auto;padding:40px 30px 60px;display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center;min-height:calc(100svh - 70px);}
.gx-system{position:relative;width:min(480px,90vw);aspect-ratio:1;margin:0 auto;}
.gx-orbit{position:absolute;border-radius:50%;border:1px dashed rgba(139,147,184,.3);}
.gx-orbit.o1{inset:calc(50% - 150px);}
.gx-orbit.o2{inset:calc(50% - 215px);}
.gx-sun{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);filter:drop-shadow(0 0 44px rgba(24,119,242,.55));}
.gx-ring{position:absolute;inset:0;transform-origin:center;}
.gx-ring.r1{animation:gxSpin 26s linear infinite;}
.gx-ring.r2{animation:gxSpin 44s linear infinite reverse;}
@keyframes gxSpin{to{transform:rotate(360deg)}}
.gx-sat{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(var(--a)) translateX(var(--r)) rotate(calc(var(--a) * -1));}
.gx-sat-inner{display:block;line-height:0;filter:drop-shadow(0 6px 18px rgba(0,0,0,.6));}
.gx-sat-inner.ri1{animation:gxSpin 26s linear infinite reverse;}
.gx-sat-inner.ri2{animation:gxSpin 44s linear infinite;}
.gx-system:hover .gx-ring,.gx-system:hover .gx-sat-inner{animation-play-state:paused;}

.gx-hero-text{max-width:520px;}
.gx-hero-tag{display:inline-block;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:var(--cyan);border:1px solid rgba(103,232,249,.3);background:rgba(103,232,249,.05);padding:7px 16px;border-radius:100px;margin-bottom:24px;font-weight:600;}
.gx-hero-text h1{margin:0;font-size:clamp(32px,4.6vw,56px);font-weight:700;letter-spacing:-1.5px;line-height:1.1;}
.gx-holo{background:linear-gradient(90deg,var(--cyan),var(--vio),var(--pink),var(--cyan));background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gxHolo 6s linear infinite;}
@keyframes gxHolo{to{background-position:250% 0}}
.gx-hero-text p{color:var(--muted);font-size:16.5px;line-height:1.7;margin:22px 0 30px;}
.gx-hero-cta{display:flex;gap:14px;flex-wrap:wrap;}
.gx-btn{display:inline-block;background:linear-gradient(90deg,#22d3ee,#818cf8);color:#071018;padding:15px 30px;border-radius:100px;font-weight:700;font-size:15px;transition:.25s;box-shadow:0 12px 34px rgba(103,232,249,.25);}
.gx-btn:hover{transform:translateY(-2px);box-shadow:0 18px 44px rgba(103,232,249,.4);}
.gx-btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line);box-shadow:none;}
.gx-btn.ghost:hover{border-color:var(--cyan);color:var(--cyan);}
.gx-btn.big{padding:18px 40px;font-size:16px;}
.gx-statline{display:flex;flex-wrap:wrap;gap:8px 26px;margin-top:32px;font-size:13px;color:var(--muted);}
.gx-statline b{color:var(--cyan);font-size:15px;margin-right:4px;}

/* ===== sections ===== */
.gx-section{max-width:1140px;margin:0 auto;padding:70px 30px;}
.gx-sec-tag{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--cyan);margin-bottom:12px;font-weight:700;}
.gx-section h2{font-size:clamp(24px,3.6vw,38px);font-weight:700;letter-spacing:-1px;margin:0 0 40px;}

/* timeline */
.gx-timeline{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:26px;padding-top:10px;}
.gx-timeline-line{position:absolute;top:15px;left:6%;right:6%;height:2px;background:linear-gradient(90deg,rgba(139,147,184,.4),var(--cyan),var(--pink));border-radius:2px;}
.gx-tnode{position:relative;padding-top:34px;}
.gx-tdot{position:absolute;top:8px;left:0;width:15px;height:15px;border-radius:50%;background:var(--bg);border:2px solid var(--cyan);box-shadow:0 0 14px rgba(103,232,249,.6);}
.gx-tnode.n1 .gx-tdot{border-color:var(--vio);box-shadow:0 0 14px rgba(167,139,250,.6);}
.gx-tnode.n2 .gx-tdot{border-color:var(--pink);box-shadow:0 0 14px rgba(240,171,252,.6);}
.gx-tnode b{display:block;font-size:14px;letter-spacing:2.5px;margin-bottom:10px;}
.gx-tnode.n0 b{color:var(--muted);}
.gx-tnode.n1 b{color:var(--cyan);}
.gx-tnode.n2 b{color:var(--pink);}
.gx-tnode p{margin:0;color:var(--muted);font-size:14.5px;line-height:1.65;}

/* stations */
.gx-stations{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.gx-stationwrap{border-radius:18px;}
.gx-station{position:relative;display:flex;flex-direction:column;gap:10px;background:rgba(139,147,184,.06);border:1px solid var(--line);border-radius:18px;padding:26px 22px;color:var(--fg);min-height:220px;overflow:hidden;transition:.25s;}
.gx-station-halo{position:absolute;top:-46px;right:-46px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(103,232,249,.22),transparent 70%);}
.gx-stationwrap:hover .gx-station{border-color:rgba(103,232,249,.5);background:rgba(103,232,249,.05);}
.gx-station h3{font-size:18px;font-weight:700;margin:8px 0 0;}
.gx-station p{margin:0;color:var(--muted);font-size:13px;line-height:1.55;flex:1;}
.gx-station-go{color:var(--cyan);font-size:12.5px;font-weight:700;}

/* launch countdown */
.gx-launch{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.gx-lstep{background:rgba(139,147,184,.06);border:1px solid var(--line);border-left:2px solid var(--cyan);border-radius:14px;padding:22px;}
.gx-lstep:last-child{border-left-color:var(--pink);}
.gx-lcount{font-size:13px;font-weight:800;letter-spacing:2px;color:var(--cyan);}
.gx-lstep:last-child .gx-lcount{color:var(--pink);}
.gx-lstep h4{margin:12px 0 8px;font-size:16px;font-weight:700;}
.gx-lstep p{margin:0;color:var(--muted);font-size:13px;line-height:1.6;}

/* missions */
.gx-missions{display:flex;flex-direction:column;gap:12px;max-width:760px;}
.gx-mission{display:flex;align-items:center;gap:16px;background:rgba(139,147,184,.06);border:1px solid var(--line);border-radius:14px;padding:16px 20px;color:var(--fg);transition:.2s;}
.gx-mission:hover{border-color:rgba(103,232,249,.5);transform:translateX(4px);}
.gx-mission div{flex:1;min-width:0;}
.gx-mission b{display:block;font-size:15.5px;}
.gx-mission span{font-size:13px;color:var(--muted);}
.gx-mission-check{font-style:normal;width:30px;height:30px;border-radius:50%;background:rgba(103,232,249,.12);border:1px solid rgba(103,232,249,.4);color:var(--cyan);display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0;}

/* signals */
.gx-signals{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.gx-signal{background:rgba(139,147,184,.06);border:1px solid var(--line);border-radius:18px;padding:24px;}
.gx-signal-stars{color:#fbbf24;letter-spacing:2px;font-size:13px;margin-bottom:12px;}
.gx-signal p{margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#cdd5f5;}
.gx-signal-person{display:flex;align-items:center;gap:11px;}
.gx-signal-person b{display:block;font-size:14px;}
.gx-signal-person span{font-size:12px;color:var(--muted);}

/* cta + footer */
.gx-footer{max-width:1140px;margin:0 auto;padding:20px 30px 30px;}
.gx-cta{text-align:center;border:1px solid var(--line);border-radius:26px;padding:70px 40px;background:
 radial-gradient(560px 280px at 50% 0%,rgba(103,232,249,.12),transparent 70%),rgba(139,147,184,.04);}
.gx-cta h2{font-size:clamp(28px,4.6vw,48px);font-weight:700;letter-spacing:-1.5px;margin:0 0 14px;}
.gx-cta p{color:var(--muted);margin:0 0 30px;font-size:15.5px;}
.gx-footbar{display:flex;justify-content:space-between;margin-top:30px;color:var(--muted);font-size:13px;flex-wrap:wrap;gap:12px;}

@media(prefers-reduced-motion:reduce){.gx-root *{animation:none!important}}
@media(max-width:980px){
 .gx-hero{grid-template-columns:1fr;padding:30px 20px 50px;min-height:auto;gap:10px;}
 .gx-system{width:min(360px,86vw);}
 .gx-sat{--r:110px!important;}
 .gx-ring.r2 .gx-sat{--r:158px!important;}
 .gx-orbit.o1{inset:calc(50% - 110px);}
 .gx-orbit.o2{inset:calc(50% - 158px);}
 .gx-hero-text{max-width:none;text-align:center;margin:0 auto;}
 .gx-hero-cta,.gx-statline{justify-content:center;}
 .gx-section{padding:50px 20px;}
 .gx-stations,.gx-launch{grid-template-columns:1fr 1fr;}
 .gx-signals{grid-template-columns:1fr;}
 .gx-timeline{grid-template-columns:1fr;gap:20px;}
 .gx-timeline-line{display:none;}
 .gx-menu{display:none;}
 .gx-nav{padding:14px 20px;}
}
@media(max-width:560px){.gx-stations,.gx-launch{grid-template-columns:1fr;}}
      `}</style>
    </div>
  );
}
