"use client";

import Link from "next/link";
import Tilt from "@/components/tilt";
import { BrandLogo, PlatformIcon, PersonAvatar, Platform } from "@/components/brand";
import { site } from "@/lib/site";

const STAMPS: { slug: string; icon: Platform; name: string; sub: string }[] = [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", sub: "Tích xanh · Livestream · Giỏ hàng" },
  { slug: "facebook", icon: "facebook", name: "Facebook", sub: "Tích xanh · Cá nhân · Fanpage" },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram / Threads", sub: "Tích xanh · Mở khóa" },
  { slug: "bao-chi", icon: "press", name: "Báo chí", sub: "Booking · Viết bài PR" },
];

const FEED: { handle: string; icon: Platform; label: string; time: string }[] = [
  { handle: "@brand.hub", icon: "tiktok", label: "Tích xanh", time: "2 phút trước" },
  { handle: "@luxhouse.vn", icon: "instagram", label: "Verified", time: "8 phút trước" },
  { handle: "Huy's Kitchen", icon: "facebook", label: "Khôi phục", time: "21 phút trước" },
  { handle: "@bloom.beauty", icon: "instagram", label: "Verified", time: "35 phút trước" },
  { handle: "Fanpage F&B", icon: "facebook", label: "Mở khóa", time: "52 phút trước" },
  { handle: "@creator.minh", icon: "tiktok", label: "Livestream", time: "1 giờ trước" },
];

export default function OptionG() {
  return (
    <div className="opg-root" id="opg-top">
      <div className="opg-bg" />
      <nav className="opg-nav">
        <a href="#opg-top" className="opg-logo">
          <BrandLogo size={30} showText textColor="#eaf0ff" />
        </a>
        <div className="opg-menu">
          <a href="#opg-feed">Live Feed</a>
          <a href="#opg-stamps">Dịch vụ</a>
          <a href="#opg-voices">Feedback</a>
        </div>
        <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opg-navcta">
          Get Verified
        </a>
      </nav>

      {/* HERO — thẻ định danh 3D */}
      <header className="opg-hero">
        <div className="opg-hero-left">
          <div className="opg-eyebrow">
            <span className="opg-livedot" /> Đang cấp danh tính xác minh · từ 2021
          </div>
          <h1>
            Nhận tấm thẻ <span className="opg-holo">đã xác minh</span> của riêng
            thương hiệu bạn.
          </h1>
          <p>
            vduystudio biến tài khoản của bạn thành một danh tính được xác minh
            chính thống — tích xanh, mở khóa &amp; báo chí, cấp như một tấm thẻ
            định danh số.
          </p>
          <div className="opg-hero-cta">
            <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opg-btn">
              Cấp thẻ cho tôi
            </a>
            <a href="#opg-stamps" className="opg-btn ghost">
              Xem dịch vụ
            </a>
          </div>
          <div className="opg-trustline">
            <PersonAvatar name="A" hue={200} size={30} verified={false} />
            <PersonAvatar name="B" hue={320} size={30} verified={false} />
            <PersonAvatar name="C" hue={150} size={30} verified={false} />
            <span>
              <b>1.200+</b> danh tính đã được cấp · 98% thành công
            </span>
          </div>
        </div>

        <Tilt className="opg-card" max={12} scale={1.03}>
          <div className="opg-card-sheen" />
          <div className="opg-card-top">
            <span className="opg-card-issuer">
              VERIFIED IDENTITY · vduystudio<sup>®</sup>
            </span>
            <span className="opg-chip" />
          </div>
          <div className="opg-card-mid">
            <div className="opg-card-photo">
              <svg width="72" height="72" viewBox="0 0 24 24">
                <path d="M12 1.5l2.4 1.8 3-.2 1.1 2.8 2.6 1.5-.8 2.9.8 2.9-2.6 1.5-1.1 2.8-3-.2L12 22.5l-2.4-1.8-3 .2-1.1-2.8L2.9 16.6l.8-2.9-.8-2.9 2.6-1.5 1.1-2.8 3 .2z" fill="#1877f2" />
                <path d="M8.5 12.2l2.3 2.3 4.7-4.9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div className="opg-card-fields">
              <div>
                <label>Holder</label>
                <b>Thương hiệu của bạn</b>
              </div>
              <div>
                <label>Nền tảng</label>
                <b>TikTok · FB · IG · Threads</b>
              </div>
              <div className="opg-card-status">
                <label>Trạng thái</label>
                <b>✓ VERIFIED</b>
              </div>
            </div>
          </div>
          <div className="opg-card-bottom">
            <span className="opg-card-id">ID · VDUY-2026-★★★★</span>
            <span className="opg-card-valid">VALID ∞</span>
          </div>
          <div className="opg-card-strip" />
        </Tilt>
      </header>

      {/* LIVE FEED + TRUST GAUGE */}
      <section className="opg-section" id="opg-feed">
        <div className="opg-panel opg-feedpanel">
          <div className="opg-panel-head">
            <span className="opg-livedot" /> LIVE VERIFICATION FEED
          </div>
          <div className="opg-feed">
            <div className="opg-feed-track">
              {[...FEED, ...FEED].map((f, i) => (
                <div className="opg-feed-row" key={i}>
                  <PlatformIcon kind={f.icon} size={30} />
                  <div className="opg-feed-info">
                    <b>{f.handle}</b>
                    <span>{f.time}</span>
                  </div>
                  <span className="opg-feed-badge">✓ {f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="opg-panel opg-gaugepanel">
          <div className="opg-panel-head">TRUST SCORE</div>
          <div className="opg-gauge">
            <svg viewBox="0 0 120 120" width="150" height="150">
              <defs>
                <linearGradient id="opgGauge" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
              <circle
                className="opg-gauge-arc"
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#opgGauge)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - 0.98)}
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="58" textAnchor="middle" fontSize="26" fontWeight="800" fill="#fff">
                98%
              </text>
              <text x="60" y="76" textAnchor="middle" fontSize="9" fill="#8ea0c0" letterSpacing="1">
                THÀNH CÔNG
              </text>
            </svg>
          </div>
          <p>Tỉ lệ hồ sơ được xác minh thành công qua 1.200+ dự án.</p>
        </div>
      </section>

      {/* STAMPS — dịch vụ */}
      <section className="opg-section-block" id="opg-stamps">
        <div className="opg-block-head">
          <h2>Đóng dấu xác minh cho nền tảng của bạn</h2>
          <p>Mỗi nền tảng là một con dấu — chạm để xem quy trình, bảng giá &amp; FAQ.</p>
        </div>
        <div className="opg-stamps">
          {STAMPS.map((s) => (
            <Tilt className="opg-stampwrap" max={8} key={s.slug}>
              <Link href={`/dich-vu/${s.slug}`} className="opg-stamp">
                <div className="opg-stamp-ring">✦ VERIFIED ✦</div>
                <PlatformIcon kind={s.icon} size={46} />
                <h3>{s.name}</h3>
                <p>{s.sub}</p>
                <span className="opg-stamp-go">Xem chi tiết →</span>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="opg-section-block" id="opg-voices">
        <div className="opg-block-head">
          <h2>Những danh tính đã được cấp</h2>
          <p>Feedback thật từ khách hàng đã nhận “thẻ xác minh”.</p>
        </div>
        <div className="opg-voices">
          {site.testimonials.map((t) => (
            <div className="opg-voice" key={t.name}>
              <div className="opg-voice-stars">★★★★★</div>
              <p>“{t.quote}”</p>
              <div className="opg-voice-person">
                <PersonAvatar name={t.name} hue={t.hue} size={44} />
                <div>
                  <b>{t.name}</b>
                  <span>{t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <footer className="opg-footer" id="opg-contact">
        <div className="opg-cta">
          <div className="opg-livedot" />
          <h2>
            Danh tính xác minh của bạn <span className="opg-holo">đang chờ được cấp.</span>
          </h2>
          <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opg-btn big">
            Bắt đầu xác minh
          </a>
        </div>
        <div className="opg-footbar">
          <BrandLogo size={26} showText textColor="#8ea0c0" />
          <span>© 2026 vduystudio® · {site.domain}</span>
        </div>
      </footer>

      <style>{`
.opg-root{--bg:#060814;--fg:#eaf0ff;--muted:#8ea0c0;--line:rgba(255,255,255,.1);--cyan:#22d3ee;--mag:#d946ef;--blue:#1877f2;font-family:var(--font-inter),system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;position:relative;overflow-x:hidden;padding-bottom:0;}
.opg-root *{box-sizing:border-box;}
.opg-root [id]{scroll-margin-top:84px;}
.opg-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:
 radial-gradient(800px 500px at 82% 6%, rgba(34,211,238,.16), transparent 60%),
 radial-gradient(700px 500px at 10% 20%, rgba(217,70,239,.12), transparent 60%),
 radial-gradient(700px 600px at 50% 100%, rgba(24,119,242,.12), transparent 60%),
 linear-gradient(180deg,#060814,#04050d);}
.opg-root > *{position:relative;z-index:1;}

.opg-nav{display:flex;justify-content:space-between;align-items:center;padding:20px 44px;}
.opg-menu{display:flex;gap:28px;font-size:14px;color:var(--muted);}
.opg-menu a:hover{color:var(--fg);}
.opg-navcta{border:1px solid var(--line);background:rgba(255,255,255,.04);padding:10px 20px;border-radius:100px;font-size:13px;font-weight:700;transition:.2s;}
.opg-navcta:hover{background:var(--fg);color:#060814;}

.opg-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:50px;align-items:center;padding:50px 44px 80px;max-width:1240px;margin:0 auto;}
.opg-eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--cyan);margin-bottom:22px;font-weight:600;}
.opg-livedot{width:8px;height:8px;border-radius:50%;background:var(--cyan);box-shadow:0 0 0 0 rgba(34,211,238,.6);animation:opgPulse 1.8s infinite;}
@keyframes opgPulse{0%{box-shadow:0 0 0 0 rgba(34,211,238,.55)}70%{box-shadow:0 0 0 10px rgba(34,211,238,0)}100%{box-shadow:0 0 0 0 rgba(34,211,238,0)}}
.opg-hero h1{font-family:var(--font-grotesk),sans-serif;font-size:clamp(36px,5vw,64px);line-height:1.05;font-weight:700;letter-spacing:-2px;margin:0;}
.opg-holo{background:linear-gradient(90deg,#22d3ee,#818cf8,#d946ef,#22d3ee);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:opgHolo 6s linear infinite;}
@keyframes opgHolo{to{background-position:300% 0}}
.opg-hero p{color:var(--muted);font-size:17px;line-height:1.65;max-width:500px;margin:24px 0 32px;}
.opg-hero-cta{display:flex;gap:14px;flex-wrap:wrap;}
.opg-btn{display:inline-block;background:linear-gradient(90deg,#22d3ee,#3b82f6);color:#04101a;padding:15px 30px;border-radius:12px;font-weight:700;font-size:15px;transition:.25s;box-shadow:0 10px 30px rgba(34,211,238,.25);}
.opg-btn:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(34,211,238,.4);}
.opg-btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line);box-shadow:none;}
.opg-btn.ghost:hover{border-color:var(--fg);}
.opg-btn.big{padding:18px 40px;font-size:16px;}
.opg-trustline{display:flex;align-items:center;gap:10px;margin-top:34px;color:var(--muted);font-size:13.5px;}
.opg-trustline > span{margin-left:6px;}
.opg-trustline b{color:var(--fg);}

/* THẺ 3D */
.opg-card{aspect-ratio:1.58/1;border-radius:22px;padding:26px;background:
 linear-gradient(135deg,rgba(34,211,238,.18),rgba(217,70,239,.14) 45%,rgba(24,119,242,.2));
 border:1px solid rgba(255,255,255,.22);position:relative;overflow:hidden;
 box-shadow:0 40px 90px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.25);backdrop-filter:blur(6px);display:flex;flex-direction:column;justify-content:space-between;}
.opg-card-sheen{position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.28) 45%,rgba(255,255,255,0) 60%);background-size:250% 250%;animation:opgSheen 5s linear infinite;pointer-events:none;}
@keyframes opgSheen{0%{background-position:120% 0}100%{background-position:-40% 0}}
.opg-card-top{display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1;}
.opg-card-issuer{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#dbe6ff;font-weight:700;}
.opg-card-issuer sup{font-size:7px;}
.opg-chip{width:38px;height:28px;border-radius:6px;background:linear-gradient(135deg,#f3d27a,#c9a227);position:relative;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15);}
.opg-chip::before{content:'';position:absolute;inset:6px 8px;border:1px solid rgba(0,0,0,.25);border-radius:2px;}
.opg-card-mid{display:flex;gap:18px;align-items:center;position:relative;z-index:1;}
.opg-card-photo{width:88px;height:88px;border-radius:14px;background:rgba(4,10,22,.5);border:1px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;filter:drop-shadow(0 6px 16px rgba(0,0,0,.4));}
.opg-card-fields{display:flex;flex-direction:column;gap:9px;min-width:0;}
.opg-card-fields label{display:block;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#a9b8db;margin-bottom:2px;}
.opg-card-fields b{font-size:14px;font-weight:700;color:#fff;letter-spacing:-.2px;}
.opg-card-status b{color:#7ef0c0;}
.opg-card-bottom{display:flex;justify-content:space-between;align-items:flex-end;position:relative;z-index:1;font-size:11px;letter-spacing:1px;color:#c9d6f5;font-family:var(--font-grotesk),monospace;}
.opg-card-strip{position:absolute;left:0;right:0;bottom:0;height:8px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.55) 0 2px,transparent 2px 5px);opacity:.5;}

.opg-section{display:grid;grid-template-columns:1.5fr 1fr;gap:22px;max-width:1240px;margin:0 auto;padding:20px 44px 40px;}
.opg-panel{background:rgba(255,255,255,.035);border:1px solid var(--line);border-radius:20px;padding:24px;backdrop-filter:blur(8px);}
.opg-panel-head{display:flex;align-items:center;gap:9px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:16px;}
.opg-feed{height:210px;overflow:hidden;position:relative;-webkit-mask-image:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent);}
.opg-feed-track{display:flex;flex-direction:column;gap:10px;animation:opgFeed 16s linear infinite;}
@keyframes opgFeed{from{transform:translateY(0)}to{transform:translateY(-50%)}}
.opg-feed:hover .opg-feed-track{animation-play-state:paused;}
.opg-feed-row{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:12px;padding:10px 14px;}
.opg-feed-info{flex:1;min-width:0;}
.opg-feed-info b{display:block;font-size:14px;}
.opg-feed-info span{font-size:11.5px;color:var(--muted);}
.opg-feed-badge{font-size:11px;font-weight:700;color:#7ef0c0;background:rgba(126,240,192,.1);border:1px solid rgba(126,240,192,.25);padding:5px 10px;border-radius:100px;white-space:nowrap;}
.opg-gaugepanel{display:flex;flex-direction:column;align-items:center;text-align:center;}
.opg-gauge{margin:6px 0 10px;}
.opg-gauge-arc{animation:opgDraw 1.6s ease-out;}
@keyframes opgDraw{from{stroke-dashoffset:${2 * Math.PI * 50}}}
.opg-gaugepanel p{color:var(--muted);font-size:13px;line-height:1.5;margin:0;max-width:220px;}

.opg-section-block{max-width:1240px;margin:0 auto;padding:60px 44px;}
.opg-block-head{margin-bottom:36px;}
.opg-block-head h2{font-family:var(--font-grotesk),sans-serif;font-size:clamp(26px,3.6vw,42px);font-weight:700;letter-spacing:-1px;margin:0 0 10px;}
.opg-block-head p{color:var(--muted);font-size:15px;margin:0;}
.opg-stamps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.opg-stampwrap{border-radius:18px;}
.opg-stamp{display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:26px 22px;border-radius:18px;background:rgba(255,255,255,.035);border:1px solid var(--line);color:var(--fg);position:relative;overflow:hidden;min-height:220px;transition:.25s;}
.opg-stampwrap:hover .opg-stamp{border-color:rgba(34,211,238,.5);background:rgba(34,211,238,.06);}
.opg-stamp-ring{position:absolute;top:14px;right:-30px;transform:rotate(12deg);font-size:9px;letter-spacing:2px;color:rgba(126,240,192,.5);border:1px dashed rgba(126,240,192,.35);border-radius:100px;padding:4px 34px;}
.opg-stamp h3{font-size:19px;font-weight:700;margin:6px 0 0;}
.opg-stamp p{font-size:13px;color:var(--muted);margin:0;line-height:1.5;flex:1;}
.opg-stamp-go{font-size:12.5px;font-weight:700;color:var(--cyan);}

.opg-voices{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.opg-voice{background:rgba(255,255,255,.035);border:1px solid var(--line);border-radius:18px;padding:24px;}
.opg-voice-stars{color:#f5c451;font-size:14px;letter-spacing:2px;margin-bottom:12px;}
.opg-voice p{font-size:15px;line-height:1.6;margin:0 0 18px;color:#dfe6f5;}
.opg-voice-person{display:flex;align-items:center;gap:11px;}
.opg-voice-person b{display:block;font-size:14px;}
.opg-voice-person span{font-size:12px;color:var(--muted);}

.opg-footer{max-width:1240px;margin:0 auto;padding:20px 44px 120px;}
.opg-cta{text-align:center;border:1px solid var(--line);border-radius:24px;padding:70px 40px;background:
 radial-gradient(600px 300px at 50% 0%, rgba(34,211,238,.14), transparent 70%),rgba(255,255,255,.02);}
.opg-cta .opg-livedot{margin:0 auto 20px;}
.opg-cta h2{font-family:var(--font-grotesk),sans-serif;font-size:clamp(28px,4.5vw,50px);font-weight:700;letter-spacing:-1.5px;margin:0 0 30px;max-width:18ch;margin-left:auto;margin-right:auto;}
.opg-footbar{display:flex;justify-content:space-between;align-items:center;margin-top:34px;color:var(--muted);font-size:13px;flex-wrap:wrap;gap:14px;}

@media(max-width:920px){
 .opg-nav{padding:16px 20px;}.opg-menu{display:none;}
 .opg-hero{grid-template-columns:1fr;padding:30px 20px 50px;gap:36px;}
 .opg-card{max-width:420px;}
 .opg-section{grid-template-columns:1fr;padding:10px 20px 30px;}
 .opg-section-block{padding:44px 20px;}
 .opg-stamps{grid-template-columns:1fr 1fr;}
 .opg-voices{grid-template-columns:1fr;}
 .opg-footer{padding:20px 20px 120px;}
}
@media(max-width:520px){.opg-stamps{grid-template-columns:1fr;}}
      `}</style>
    </div>
  );
}
