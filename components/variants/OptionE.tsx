"use client";

import { useRef } from "react";
import Link from "next/link";
import { HeroOrb } from "@/components/art";
import { BrandLogo, PlatformIcon, Platform } from "@/components/brand";
import Tilt from "@/components/tilt";
import { site } from "@/lib/site";

const WORK: { slug: string; title: string; desc: string; icon: Platform; accent: string; bg: string }[] = [
  { slug: "tiktok", title: "TikTok Verification", desc: "Tích xanh chính thống cho kênh 2.1M follow trong 18 ngày.", icon: "tiktok", accent: "#2dd4bf", bg: "linear-gradient(150deg,#0f2233,#0a1420)" },
  { slug: "facebook", title: "Facebook Recovery", desc: "Khôi phục Fanpage bị khóa chỉ trong 48 giờ.", icon: "facebook", accent: "#3b82f6", bg: "linear-gradient(150deg,#0e1b33,#0a1420)" },
  { slug: "instagram-threads", title: "Instagram Verified", desc: "Huy hiệu xác minh cho tài khoản Instagram & Threads.", icon: "instagram", accent: "#ec4899", bg: "linear-gradient(150deg,#2a1230,#0a1420)" },
  { slug: "bao-chi", title: "Báo chí PR Booking", desc: "Booking 6 đầu báo lớn cho chiến dịch ra mắt.", icon: "press", accent: "#f59e0b", bg: "linear-gradient(150deg,#2a2010,#0a1420)" },
];

export default function OptionE() {
  const trackRef = useRef<HTMLDivElement>(null);

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
          <a href="#ope-work">Services</a>
          <a href="#ope-work">Featured Work</a>
          <a href="#ope-contact">About</a>
          <a href="#ope-contact">Contact</a>
        </div>
      </nav>

      <header className="ope-hero">
        <div className="ope-hero-orb">
          <HeroOrb />
        </div>
        <div className="ope-hero-text">
          <h1>vduystudio</h1>
          <p>
            Elevating Your Digital Presence.
            <br />
            Social Media Verification &amp; Account Security.
          </p>
          <a href="#ope-work" className="ope-btn">
            Explore Services <span>→</span>
          </a>
        </div>
      </header>

      <section className="ope-section" id="ope-work">
        <div className="ope-sec-head">
          <h2>Featured Work</h2>
          <div className="ope-arrows">
            <button aria-label="Trước" onClick={() => scrollBy(-1)}>
              ‹
            </button>
            <button aria-label="Sau" onClick={() => scrollBy(1)}>
              ›
            </button>
          </div>
        </div>

        <div className="ope-track" ref={trackRef}>
          {WORK.map((w, i) => (
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
                    View Case Study <b>→</b>
                  </span>
                </div>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      <footer className="ope-footer" id="ope-contact">
        <div className="ope-cta">
          <h2>
            Sẵn sàng nâng tầm <span>uy tín số?</span>
          </h2>
          <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="ope-btn gold">
            Let&apos;s Talk
          </a>
        </div>
        <div className="ope-footbar">
          <span>© 2026 vduystudio</span>
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
.ope-logo b{font-weight:800;color:var(--fg);}
.ope-menu{display:flex;gap:30px;font-size:14px;color:var(--muted);}
.ope-menu a:hover{color:var(--fg);}

.ope-hero{position:relative;min-height:76vh;display:flex;align-items:center;justify-content:center;padding:40px 44px 60px;}
.ope-hero-orb{position:absolute;top:50%;left:50%;transform:translate(-50%,-56%);z-index:0;opacity:.95;}
.ope-hero-text{position:relative;z-index:1;text-align:center;max-width:760px;}
.ope-hero-text h1{font-size:clamp(56px,12vw,150px);font-weight:800;letter-spacing:-4px;line-height:.9;margin:0;text-shadow:0 8px 40px rgba(0,0,0,.6);}
.ope-hero-text p{margin:20px auto 0;color:#cdd8df;font-size:clamp(15px,2.2vw,20px);line-height:1.5;text-shadow:0 2px 12px rgba(0,0,0,.7);}
.ope-btn{display:inline-flex;align-items:center;gap:10px;margin-top:34px;border:1px solid var(--gold);color:var(--gold-l);padding:15px 30px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;transition:.28s;background:rgba(201,162,39,.06);}
.ope-btn:hover{background:var(--gold);color:#1a1405;box-shadow:0 10px 30px rgba(201,162,39,.35);}
.ope-btn span{transition:.28s;}
.ope-btn:hover span{transform:translateX(4px);}
.ope-btn.gold{background:linear-gradient(180deg,var(--gold-l),var(--gold));color:#1a1405;border:none;}
.ope-btn.gold:hover{box-shadow:0 12px 34px rgba(201,162,39,.45);}

.ope-section{padding:70px 44px 40px;}
.ope-sec-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:34px;}
.ope-sec-head h2{font-size:clamp(26px,4vw,40px);font-weight:800;letter-spacing:-1px;margin:0;}
.ope-arrows{display:flex;gap:10px;}
.ope-arrows button{width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);color:var(--fg);font-size:22px;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;line-height:1;}
.ope-arrows button:hover{background:var(--gold);color:#1a1405;border-color:var(--gold);}

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

@media(max-width:820px){
 .ope-nav{padding:18px 20px;}.ope-menu{display:none;}
 .ope-hero{padding:20px 20px 40px;min-height:64vh;}
 .ope-hero-orb{transform:translate(-50%,-52%) scale(.9);opacity:.7;}
 .ope-section{padding:50px 20px 30px;}
 .ope-card{flex-basis:80vw;}
 .ope-footer{padding:30px 20px;}
 .ope-cta{padding:50px 24px;}
}
      `}</style>
    </div>
  );
}
