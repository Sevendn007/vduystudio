"use client";

import Link from "next/link";
import { VerifiedBadge } from "@/components/art";
import { BrandLogo, PlatformIcon, Platform } from "@/components/brand";
import { site } from "@/lib/site";

const SERVICES = [
  { slug: "tiktok", n: "01", name: "TikTok", tags: "Tích xanh · Mở khóa · Livestream" },
  { slug: "facebook", n: "02", name: "Facebook", tags: "Tích xanh · Cá nhân · Fanpage" },
  { slug: "instagram-threads", n: "03", name: "Instagram / Threads", tags: "Tích xanh · Mở khóa tài khoản" },
  { slug: "bao-chi", n: "04", name: "Báo chí", tags: "Booking · Viết bài PR" },
];

const WORK: { slug: string; icon: Platform; tag: string; title: string; desc: string; bg: string }[] = [
  { slug: "tiktok", icon: "tiktok", tag: "TikTok · Tích xanh", title: "@brand.hub — 2.1M follow", desc: "Đạt tích xanh sau 18 ngày, mở khóa giỏ hàng TikTok Shop.", bg: "linear-gradient(150deg,#111,#25333a)" },
  { slug: "facebook", icon: "facebook", tag: "Facebook · Fanpage", title: "Fanpage F&B miền Bắc", desc: "Khôi phục fanpage bị khóa trong 48 giờ.", bg: "linear-gradient(150deg,#0e1b33,#1877f2)" },
  { slug: "bao-chi", icon: "press", tag: "Báo chí · PR", title: "Booking 6 đầu báo lớn", desc: "Chiến dịch PR ra mắt sản phẩm mới.", bg: "linear-gradient(150deg,#1a1206,#7a5a1e)" },
];

export default function OptionA() {
  return (
    <div className="opa-root">
      <div className="opa-grain" />
      <nav className="opa-nav">
        <a href="#opa-top" className="opa-logo">
          <BrandLogo size={30} showText textColor="#f5f4f0" />
        </a>
        <div className="opa-menu">
          <a href="#opa-services">Dịch vụ</a>
          <a href="#opa-work">Dự án</a>
          <a href="#opa-feedback">Feedback</a>
          <a href="#opa-contact">Liên hệ</a>
        </div>
        <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opa-nav-cta">
          Liên hệ
        </a>
      </nav>

      <section className="opa-hero" id="opa-top">
        <div className="opa-eyebrow">Verified Identity Studio — Est. 2021</div>
        <h1>
          Xây dựng <span className="accent">uy tín số</span> cho thương hiệu của bạn.
        </h1>
        <p className="opa-hero-sub">
          vduystudio giúp cá nhân &amp; thương hiệu đạt tích xanh chính thống, mở
          khóa tài khoản và chinh phục báo chí — bằng quy trình minh bạch, kết
          quả thật.
        </p>
        <div className="opa-hero-cta">
          <a href="#opa-services" className="opa-btn">
            Xem dịch vụ
          </a>
          <a href="#opa-work" className="opa-btn-ghost">
            Xem case study →
          </a>
        </div>
      </section>

      <section className="opa-section" id="opa-services">
        <div className="opa-section-head">
          <h2>Hạng mục dịch vụ</h2>
          <p>
            Bốn nền tảng chủ lực — mỗi nền tảng một quy trình riêng, minh bạch từ
            A-Z.
          </p>
        </div>
        <div className="opa-services">
          {SERVICES.map((s) => (
            <Link href={`/dich-vu/${s.slug}`} className="opa-service-row" key={s.slug}>
              <div className="opa-service-left">
                <span className="opa-service-idx">{s.n}</span>
                <h3>{s.name}</h3>
              </div>
              <div className="opa-service-tags">{s.tags}</div>
              <div className="opa-service-arrow">↗</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="opa-section" id="opa-work">
        <div className="opa-section-head">
          <h2>Featured Work</h2>
          <p>Một vài dự án tiêu biểu đã triển khai gần đây.</p>
        </div>
        <div className="opa-work-grid">
          {WORK.map((w) => (
            <Link href={`/dich-vu/${w.slug}`} className="opa-wcard" key={w.title}>
              <div className="opa-wimg" style={{ background: w.bg }}>
                <PlatformIcon kind={w.icon} size={62} />
                <span className="opa-wcheck">
                  <VerifiedBadge size={26} />
                </span>
                <span className="opa-wtag">{w.tag}</span>
              </div>
              <div className="opa-wbody">
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
                <span className="opa-wlink">Xem chi tiết →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="opa-marquee" id="opa-feedback">
        <div className="opa-marquee-track">
          <span className="hl">&quot;Nhanh, minh bạch, đúng cam kết&quot;</span>
          <span>★★★★★</span>
          <span className="hl">&quot;Tích xanh thật, không rủi ro&quot;</span>
          <span>★★★★★</span>
          <span className="hl">&quot;Đội ngũ chuyên nghiệp&quot;</span>
          <span>★★★★★</span>
          <span className="hl">&quot;Nhanh, minh bạch, đúng cam kết&quot;</span>
          <span>★★★★★</span>
          <span className="hl">&quot;Tích xanh thật, không rủi ro&quot;</span>
          <span>★★★★★</span>
          <span className="hl">&quot;Đội ngũ chuyên nghiệp&quot;</span>
          <span>★★★★★</span>
        </div>
      </div>

      <section className="opa-cta" id="opa-contact">
        <h2>Let&apos;s talk.</h2>
        <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opa-btn">
          Liên hệ tư vấn
        </a>
      </section>
      <div className="opa-footer">
        <div>© 2026 vduystudio</div>
        <div>{site.domain}</div>
      </div>

      <style>{`
.opa-root{--bg:#0a0a0a;--fg:#f5f4f0;--muted:#8a8a86;--accent:#3ecf8e;font-family:var(--font-inter),'Helvetica Neue',Arial,sans-serif;background:var(--bg);color:var(--fg);overflow-x:hidden;position:relative;min-height:100vh;}
.opa-root *{box-sizing:border-box;}
.opa-root section[id],.opa-root [id]{scroll-margin-top:90px;}
.opa-grain{position:fixed;inset:0;pointer-events:none;opacity:.05;z-index:50;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.opa-nav{position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;padding:20px 40px;background:rgba(10,10,10,.7);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.06);}
.opa-logo{font-weight:700;letter-spacing:2px;font-size:14px;text-transform:uppercase;}
.opa-logo span{color:var(--accent);}
.opa-menu{display:flex;gap:28px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);}
.opa-menu a:hover{color:var(--fg);}
.opa-nav-cta{border:1px solid rgba(255,255,255,.25);border-radius:100px;padding:9px 20px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;transition:.25s;}
.opa-nav-cta:hover{background:var(--fg);color:#000;border-color:var(--fg);}

.opa-hero{min-height:86vh;display:flex;flex-direction:column;justify-content:center;padding:80px 40px;position:relative;background:
 radial-gradient(ellipse at 75% 25%, rgba(62,207,142,.14), transparent 55%),
 linear-gradient(180deg,#0a0a0a,#050505);}
.opa-eyebrow{font-size:12px;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:26px;font-weight:600;}
.opa-hero h1{font-family:var(--font-grotesk),sans-serif;font-size:clamp(40px,7.2vw,104px);line-height:1.04;font-weight:700;letter-spacing:-2px;margin:0;max-width:16ch;}
.opa-hero h1 .accent{color:var(--accent);}
.opa-hero-sub{max-width:540px;margin-top:30px;color:var(--muted);font-size:17px;line-height:1.65;}
.opa-hero-cta{margin-top:40px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;}
.opa-btn{background:var(--fg);color:#000;padding:16px 30px;border-radius:100px;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:.3s;display:inline-block;}
.opa-btn:hover{background:var(--accent);}
.opa-btn-ghost{color:var(--fg);font-size:13px;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid var(--muted);padding-bottom:4px;cursor:pointer;transition:.25s;}
.opa-btn-ghost:hover{border-color:var(--accent);color:var(--accent);}

.opa-section{padding:110px 40px;border-top:1px solid #1a1a1a;}
.opa-section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-bottom:56px;flex-wrap:wrap;}
.opa-section-head h2{font-family:var(--font-grotesk),sans-serif;font-size:clamp(30px,4.5vw,58px);font-weight:700;letter-spacing:-1.5px;margin:0;line-height:1.05;}
.opa-section-head p{color:var(--muted);font-size:15px;max-width:300px;line-height:1.6;}

.opa-services{display:flex;flex-direction:column;}
.opa-service-row{display:flex;justify-content:space-between;align-items:center;padding:30px 0;border-top:1px solid #1c1c1c;cursor:pointer;transition:.3s;gap:20px;color:var(--fg);}
.opa-service-row:last-child{border-bottom:1px solid #1c1c1c;}
.opa-service-row:hover{padding-left:18px;background:rgba(255,255,255,.02);}
.opa-service-left{display:flex;align-items:center;gap:22px;min-width:0;}
.opa-service-idx{color:var(--muted);font-size:13px;width:28px;flex-shrink:0;}
.opa-service-row h3{font-family:var(--font-grotesk),sans-serif;font-size:clamp(22px,3.6vw,42px);font-weight:600;margin:0;letter-spacing:-1px;line-height:1.1;transition:.3s;}
.opa-service-row:hover h3{color:var(--accent);}
.opa-service-tags{color:var(--muted);font-size:12px;letter-spacing:.5px;text-align:right;flex-shrink:0;}
.opa-service-arrow{width:44px;height:44px;border-radius:50%;border:1px solid #333;display:flex;align-items:center;justify-content:center;font-size:18px;transition:.3s;flex-shrink:0;}
.opa-service-row:hover .opa-service-arrow{background:var(--accent);color:#000;border-color:var(--accent);transform:rotate(45deg);}

.opa-work-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
.opa-wcard{background:#0f1214;border:1px solid #1c1f22;border-radius:16px;overflow:hidden;color:var(--fg);transition:.28s;display:flex;flex-direction:column;}
.opa-wcard:hover{transform:translateY(-6px);border-color:#2b2f33;box-shadow:0 24px 50px rgba(0,0,0,.5);}
.opa-wimg{position:relative;aspect-ratio:16/10;display:flex;align-items:center;justify-content:center;}
.opa-wcheck{position:absolute;top:14px;right:14px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4));}
.opa-wtag{position:absolute;left:14px;bottom:14px;font-size:10.5px;letter-spacing:1px;color:#fff;text-transform:uppercase;background:rgba(0,0,0,.4);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.2);padding:4px 10px;border-radius:100px;}
.opa-wbody{padding:22px;}
.opa-wbody h4{font-size:19px;margin:0 0 8px;font-weight:700;letter-spacing:-.3px;}
.opa-wbody p{margin:0 0 16px;color:var(--muted);font-size:13.5px;line-height:1.55;}
.opa-wlink{font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--accent);}

.opa-marquee{overflow:hidden;white-space:nowrap;border-top:1px solid #1a1a1a;border-bottom:1px solid #1a1a1a;padding:28px 0;}
.opa-marquee-track{display:inline-block;animation:opaScroll 24s linear infinite;font-size:22px;font-weight:600;color:var(--muted);}
.opa-marquee-track span{margin:0 30px;}
.opa-marquee-track span.hl{color:var(--fg);}
@keyframes opaScroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}

.opa-cta{text-align:center;padding:150px 40px;border-top:1px solid #1a1a1a;}
.opa-cta h2{font-family:var(--font-grotesk),sans-serif;font-size:clamp(44px,9vw,120px);font-weight:700;letter-spacing:-3px;margin:0 0 34px;}
.opa-cta .opa-btn{padding:20px 46px;font-size:14px;}
.opa-footer{display:flex;justify-content:space-between;padding:30px 40px 120px;color:var(--muted);font-size:12px;letter-spacing:1px;}
@media(max-width:820px){
 .opa-nav{padding:16px 20px;}.opa-menu{display:none;}
 .opa-hero{padding:60px 20px;min-height:auto;}
 .opa-section{padding:70px 20px;}
 .opa-section-head{align-items:flex-start;}
 .opa-service-tags{display:none;}
 .opa-work-grid{grid-template-columns:1fr;}
 .opa-cta{padding:100px 20px;}
 .opa-footer{padding:30px 20px 120px;}
}
      `}</style>
    </div>
  );
}
