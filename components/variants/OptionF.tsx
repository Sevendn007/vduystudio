"use client";

import { useState } from "react";
import Link from "next/link";
import Tilt from "@/components/tilt";
import { BrandLogo, PlatformIcon, PersonAvatar, Platform } from "@/components/brand";
import { site } from "@/lib/site";

const SERVICES: { slug: string; n: string; name: string; tags: string; icon: Platform; pct: number }[] = [
  { slug: "tiktok", n: "01", name: "TikTok", tags: "Tích xanh · Mở khóa · Livestream", icon: "tiktok", pct: 92 },
  { slug: "facebook", n: "02", name: "Facebook", tags: "Tích xanh · Cá nhân · Fanpage", icon: "facebook", pct: 88 },
  { slug: "instagram-threads", n: "03", name: "Instagram / Threads", tags: "Tích xanh · Mở khóa tài khoản", icon: "instagram", pct: 84 },
  { slug: "bao-chi", n: "04", name: "Báo chí", tags: "Booking · Viết bài PR", icon: "press", pct: 80 },
];

function Ring({ pct, color }: { pct: number; color: string }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="opf-ring" aria-hidden>
      <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * pct) / 100}
        transform="rotate(-90 26 26)"
      />
    </svg>
  );
}

export default function OptionF() {
  const [light, setLight] = useState(false);

  return (
    <div className={`opf-root${light ? " opf-light" : ""}`} id="opf-top">
      <div className="opf-bg" />
      <div className="opf-shell">
        <nav className="opf-nav">
          <a href="#opf-top" className="opf-logo">
            <BrandLogo size={30} showText />
          </a>
          <div className="opf-menu">
            <a href="#opf-services">Dịch vụ</a>
            <a href="#opf-work">Dự án</a>
            <a href="#opf-testi">Feedback</a>
            <a href="#opf-cta">Liên hệ</a>
          </div>
          <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opf-navcta">
            Liên hệ
          </a>
        </nav>

        {/* HERO */}
        <Tilt className="opf-hero" max={4}>
          <span className="opf-spark s1">✦</span>
          <span className="opf-spark s2">✦</span>
          <span className="opf-spark s3">✧</span>
          <h1>Xây dựng uy tín số cho thương hiệu của bạn.</h1>
          <p>
            VDuyStudio giúp cá nhân &amp; thương hiệu đạt tích xanh chính thống,
            mở khóa tài khoản và chinh phục báo chí — bằng quy trình minh bạch,
            kết quả thật.
          </p>
          <div className="opf-hero-ctas">
            <a href="#opf-services" className="opf-btn primary">
              Xem dịch vụ
            </a>
            <a href="#opf-work" className="opf-btn">
              Xem case study →
            </a>
          </div>
        </Tilt>

        {/* BENTO */}
        <div className="opf-bento">
          {/* Dịch vụ */}
          <Tilt className="opf-card opf-services" max={5} id="opf-services">
            <h2>Dịch vụ</h2>
            <div className="opf-list">
              {SERVICES.map((s) => (
                <Link href={`/dich-vu/${s.slug}`} className="opf-listrow" key={s.slug}>
                  <div className="opf-ringwrap">
                    <Ring pct={s.pct} color="#2dd4bf" />
                    <span className="opf-ico">
                      <PlatformIcon kind={s.icon} size={30} />
                    </span>
                  </div>
                  <span className="opf-n">{s.n}</span>
                  <div className="opf-listinfo">
                    <b>{s.name}</b>
                    <span>{s.tags}</span>
                  </div>
                  <span className="opf-go">→</span>
                </Link>
              ))}
            </div>
          </Tilt>

          {/* Featured Work */}
          <Tilt className="opf-card opf-work" max={6} id="opf-work">
            <h2>Featured Work</h2>
            <div className="opf-tiles">
              <Link href="/dich-vu/facebook" className="opf-tile blue">
                <span>Fanpage F&amp;B miền Bắc</span>
                <div className="opf-vbadge">✓</div>
              </Link>
              <Link href="/dich-vu/bao-chi" className="opf-tile gold">
                <span>Booking 6 đầu báo lớn</span>
                <div className="opf-vbadge">✓</div>
              </Link>
            </div>
          </Tilt>

          {/* Capabilities */}
          <Tilt className="opf-card opf-caps" max={6}>
            <h2>Capabilities</h2>
            <div className="opf-capgrid">
              <div className="opf-cap">
                <div className="opf-capic">◈</div>
                <span>Social Media Verification</span>
              </div>
              <div className="opf-cap">
                <div className="opf-capic">⟳</div>
                <span>Account Recovery</span>
              </div>
              <div className="opf-cap">
                <div className="opf-capic">✦</div>
                <span>Content Strategy</span>
              </div>
            </div>
          </Tilt>

          {/* Stat / minh chứng */}
          <Tilt className="opf-card opf-stat" max={6}>
            <div className="opf-statbig">1.200+</div>
            <span>Tài khoản đã lên tích xanh</span>
            <div className="opf-statrow">
              <div>
                <b>98%</b>
                <span>Thành công</span>
              </div>
              <div>
                <b>4.9★</b>
                <span>Đánh giá</span>
              </div>
              <div>
                <b>3+ năm</b>
                <span>Kinh nghiệm</span>
              </div>
            </div>
          </Tilt>

          {/* Testimonials */}
          <Tilt className="opf-card opf-testi" max={5} id="opf-testi">
            <h2>Khách hàng nói gì</h2>
            <div className="opf-quotes">
              {site.testimonials.map((t) => (
                <div className="opf-q" key={t.name}>
                  <span className="opf-stars">★★★★★</span>
                  <p>“{t.quote}”</p>
                  <div className="opf-qperson">
                    <PersonAvatar name={t.name} hue={t.hue} size={40} />
                    <div>
                      <b>{t.name}</b>
                      <span>{t.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tilt>
        </div>

        {/* CTA */}
        <Tilt className="opf-card opf-ctacard" max={4} id="opf-cta">
          <h2>Let&apos;s talk.</h2>
          <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opf-btn primary">
            Liên hệ tư vấn
          </a>
        </Tilt>

        {/* FOOTER */}
        <footer className="opf-footer">
          <span>© 2026 VDuyStudio</span>
          <div className="opf-themetoggle">
            <span>GIAO DIỆN</span>
            <span className="opf-dot">·</span>
            <span>{site.domain}</span>
            <button
              className={`opf-switch${light ? " on" : ""}`}
              onClick={() => setLight((v) => !v)}
              aria-label="Đổi giao diện sáng/tối"
              aria-pressed={light}
            >
              <span className="opf-knob">{light ? "☀" : "☾"}</span>
            </button>
          </div>
        </footer>
      </div>

      <style>{`
.opf-root{
 --bg1:#0b1f1c;--bg2:#0a1512;--fg:#eef4f2;--muted:#9fb2ab;
 --glass:rgba(255,255,255,.06);--glass2:rgba(255,255,255,.03);--stroke:rgba(255,255,255,.12);
 --gold:#e7c873;--blue:#3b82f6;
 font-family:var(--font-inter),system-ui,sans-serif;color:var(--fg);min-height:100vh;position:relative;overflow-x:hidden;
}
.opf-root.opf-light{
 --bg1:#dce7e2;--bg2:#eef2ef;--fg:#0f1a17;--muted:#5b6b64;
 --glass:rgba(255,255,255,.55);--glass2:rgba(255,255,255,.35);--stroke:rgba(15,26,23,.1);
}
.opf-root *{box-sizing:border-box;}
.opf-root [id]{scroll-margin-top:24px;}
.opf-bg{position:fixed;inset:0;z-index:0;background:
 radial-gradient(900px 600px at 80% 8%, rgba(45,212,191,.18), transparent 60%),
 radial-gradient(700px 500px at 10% 90%, rgba(59,130,246,.12), transparent 60%),
 linear-gradient(160deg,var(--bg1),var(--bg2));}
.opf-shell{position:relative;z-index:1;max-width:1160px;margin:0 auto;padding:24px 24px 120px;}

.opf-nav{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;margin-bottom:24px;background:var(--glass);backdrop-filter:blur(18px);border:1px solid var(--stroke);border-radius:18px;}
.opf-logo{font-weight:800;letter-spacing:.5px;font-size:15px;}
.opf-menu{display:flex;gap:26px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;}
.opf-menu a:hover{color:var(--fg);}
.opf-navcta{background:var(--glass2);border:1px solid var(--stroke);padding:9px 18px;border-radius:100px;font-size:13px;font-weight:600;}
.opf-navcta:hover{background:var(--fg);color:var(--bg2);}

.opf-hero{position:relative;text-align:center;padding:64px 40px;margin-bottom:24px;background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--stroke);border-radius:26px;overflow:hidden;}
.opf-spark{position:absolute;color:var(--gold);opacity:.7;font-size:18px;}
.opf-spark.s1{top:26px;left:8%;font-size:22px;}
.opf-spark.s2{top:40%;right:9%;font-size:26px;}
.opf-spark.s3{bottom:30px;left:16%;font-size:16px;}
.opf-hero h1{font-size:clamp(30px,5vw,50px);font-weight:800;letter-spacing:-1.5px;line-height:1.12;margin:0 auto 18px;max-width:16ch;}
.opf-hero p{color:var(--muted);font-size:15.5px;line-height:1.65;max-width:600px;margin:0 auto 28px;}
.opf-hero-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.opf-btn{background:var(--glass2);border:1px solid var(--stroke);color:var(--fg);padding:13px 26px;border-radius:12px;font-weight:600;font-size:14.5px;backdrop-filter:blur(8px);transition:.2s;}
.opf-btn:hover{border-color:var(--fg);}
.opf-btn.primary{background:var(--fg);color:var(--bg2);border-color:var(--fg);}
.opf-btn.primary:hover{opacity:.9;}

.opf-bento{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.opf-card{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--stroke);border-radius:22px;padding:26px;box-shadow:0 20px 50px rgba(0,0,0,.18);}
.opf-card h2{font-size:22px;font-weight:800;letter-spacing:-.5px;margin:0 0 18px;}
.opf-services{grid-row:span 2;}

.opf-list{display:flex;flex-direction:column;gap:10px;}
.opf-listrow{display:flex;align-items:center;gap:14px;padding:12px;border-radius:14px;background:var(--glass2);border:1px solid var(--stroke);color:var(--fg);transition:.2s;}
.opf-listrow:hover{transform:translateX(4px);border-color:var(--fg);}
.opf-ringwrap{position:relative;width:52px;height:52px;flex-shrink:0;color:var(--fg);}
.opf-ring{position:absolute;inset:0;}
.opf-ico{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;line-height:0;}
.opf-n{font-size:13px;color:var(--muted);font-weight:700;width:20px;}
.opf-listinfo{flex:1;min-width:0;}
.opf-listinfo b{display:block;font-size:15px;}
.opf-listinfo span{font-size:12px;color:var(--muted);}
.opf-go{color:var(--muted);font-size:18px;}

.opf-tiles{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.opf-tile{position:relative;border-radius:16px;padding:20px;min-height:130px;display:flex;align-items:flex-start;color:#fff;font-weight:700;font-size:16px;line-height:1.3;overflow:hidden;}
.opf-tile.blue{background:linear-gradient(150deg,#2563eb,#1e3a8a);}
.opf-tile.gold{background:linear-gradient(150deg,#e0a53a,#b4791b);}
.opf-tile span{position:relative;z-index:1;max-width:80%;}
.opf-vbadge{position:absolute;bottom:16px;left:16px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;backdrop-filter:blur(4px);}

.opf-capgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.opf-cap{background:var(--glass2);border:1px solid var(--stroke);border-radius:14px;padding:18px 10px;text-align:center;}
.opf-capic{width:42px;height:42px;margin:0 auto 12px;border-radius:12px;background:var(--glass2);border:1px solid var(--stroke);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--gold);}
.opf-cap span{font-size:12.5px;color:var(--muted);line-height:1.4;display:block;}

.opf-stat{display:flex;flex-direction:column;justify-content:center;}
.opf-statbig{font-size:clamp(40px,6vw,60px);font-weight:800;letter-spacing:-2px;line-height:1;background:linear-gradient(90deg,var(--gold),#fff);-webkit-background-clip:text;background-clip:text;color:transparent;}
.opf-stat > span{color:var(--muted);font-size:14px;margin-top:6px;}
.opf-statrow{display:flex;gap:20px;margin-top:22px;padding-top:20px;border-top:1px solid var(--stroke);}
.opf-statrow b{display:block;font-size:20px;}
.opf-statrow span{font-size:11.5px;color:var(--muted);}

.opf-quotes{display:flex;flex-direction:column;gap:16px;}
.opf-q{padding-bottom:16px;border-bottom:1px solid var(--stroke);}
.opf-q:last-child{border-bottom:none;padding-bottom:0;}
.opf-q p{margin:6px 0 12px;font-size:15px;font-weight:500;line-height:1.5;}
.opf-stars{color:var(--gold);font-size:13px;letter-spacing:2px;}
.opf-qperson{display:flex;align-items:center;gap:10px;}
.opf-qperson b{display:block;font-size:13.5px;}
.opf-qperson span{font-size:12px;color:var(--muted);}

.opf-ctacard{text-align:center;margin-top:24px;padding:56px 24px;}
.opf-ctacard h2{font-size:clamp(30px,5vw,44px);margin:0 0 22px;}

.opf-footer{display:flex;justify-content:space-between;align-items:center;margin-top:26px;padding:0 6px;color:var(--muted);font-size:13px;flex-wrap:wrap;gap:14px;}
.opf-themetoggle{display:flex;align-items:center;gap:12px;text-transform:uppercase;letter-spacing:1px;font-size:12px;}
.opf-dot{opacity:.5;}
.opf-switch{width:52px;height:28px;border-radius:100px;border:1px solid var(--stroke);background:var(--glass);cursor:pointer;position:relative;transition:.25s;padding:0;}
.opf-switch.on{background:var(--gold);}
.opf-knob{position:absolute;top:2px;left:2px;width:22px;height:22px;border-radius:50%;background:var(--fg);color:var(--bg2);display:flex;align-items:center;justify-content:center;font-size:12px;transition:.25s;}
.opf-switch.on .opf-knob{left:26px;background:#1a1405;color:var(--gold);}

@media(max-width:820px){
 .opf-shell{padding:16px 16px 40px;}
 .opf-nav{padding:12px 16px;}
 .opf-menu{display:none;}
 .opf-hero{padding:44px 22px;}
 .opf-bento{grid-template-columns:1fr;}
 .opf-services{grid-row:auto;}
 .opf-capgrid{grid-template-columns:repeat(3,1fr);}
}
      `}</style>
    </div>
  );
}
