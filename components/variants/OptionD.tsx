"use client";

import Link from "next/link";
import { site } from "@/lib/site";

const WORK = [
  { slug: "tiktok", name: "TikTok", cat: "Tích xanh · Livestream · Giỏ hàng", year: "’25" },
  { slug: "facebook", name: "Facebook", cat: "Tích xanh · Cá nhân · Fanpage", year: "’25" },
  { slug: "instagram-threads", name: "Instagram / Threads", cat: "Tích xanh · Mở khóa", year: "’24" },
  { slug: "bao-chi", name: "Báo chí", cat: "Booking · Viết bài PR", year: "’24" },
];

const CAPS = [
  { k: "01", t: "Tích xanh chính thống", d: "Xác minh danh tính thật theo đúng chính sách nền tảng." },
  { k: "02", t: "Mở khóa tài khoản", d: "Khôi phục tài khoản bị khóa, hạn chế hoặc vô hiệu hóa." },
  { k: "03", t: "Mở khóa tính năng", d: "Kích hoạt livestream, giỏ hàng và các tính năng bán hàng." },
  { k: "04", t: "Booking báo chí", d: "Đăng bài PR trên hệ thống đầu báo uy tín." },
];

export default function OptionD() {
  return (
    <div className="opd-root" id="opd-top">
      <nav className="opd-nav">
        <a href="#opd-top" className="opd-logo">
          vduystudio<sup>®</sup>
        </a>
        <div className="opd-nav-right">
          <a href="#opd-work">Work</a>
          <a href="#opd-services">Studio</a>
          <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opd-nav-contact">
            Liên hệ ↗
          </a>
        </div>
      </nav>

      {/* HERO STATEMENT */}
      <header className="opd-hero">
        <div className="opd-hero-tag">
          <span>Verified Identity Studio</span>
          <span>Est. 2021 — Việt Nam</span>
        </div>
        <h1>
          vduystudio giúp cá nhân &amp; thương hiệu trở nên{" "}
          <em>được xác minh</em> — tích xanh chính thống, mở khóa tài khoản
          &amp; <em>chinh phục báo chí.</em>
        </h1>
        <a href="#opd-work" className="opd-hero-scroll">
          ↓ Xem dự án tiêu biểu
        </a>
      </header>

      {/* MARQUEE */}
      <div className="opd-marquee">
        <div className="opd-marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              TikTok <b>✦</b> Facebook <b>✦</b> Instagram <b>✦</b> Threads{" "}
              <b>✦</b> Báo chí <b>✦</b>{" "}
            </span>
          ))}
        </div>
      </div>

      {/* SELECTED WORK */}
      <section className="opd-section" id="opd-work">
        <div className="opd-label">
          <span>(01)</span> Selected Work
        </div>
        <div className="opd-worklist">
          {WORK.map((w, i) => (
            <Link href={`/dich-vu/${w.slug}`} className="opd-workrow" key={w.slug}>
              <span className="opd-workidx">{String(i + 1).padStart(2, "0")}</span>
              <span className="opd-workname">{w.name}</span>
              <span className="opd-workcat">{w.cat}</span>
              <span className="opd-workyear">{w.year}</span>
              <span className="opd-workarrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      {/* STUDIO / CAPABILITIES */}
      <section className="opd-section" id="opd-services">
        <div className="opd-label">
          <span>(02)</span> Studio
        </div>
        <p className="opd-statement">
          Chúng tôi là studio chuyên về <em>uy tín số</em>. Mỗi dự án được xử lý
          minh bạch, đúng chính sách nền tảng, có cam kết bằng văn bản và bảo
          hành rõ ràng.
        </p>
        <div className="opd-caps">
          {CAPS.map((c) => (
            <div className="opd-cap" key={c.k}>
              <span className="opd-capk">{c.k}</span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="opd-section" id="opd-feedback">
        <div className="opd-label">
          <span>(03)</span> Feedback
        </div>
        <blockquote className="opd-quote">
          “Nhanh, minh bạch, đúng cam kết. Tích xanh lên thật, không rủi ro khóa
          kênh.”
          <cite>— Khách hàng TikTok Shop</cite>
        </blockquote>
        <div className="opd-quotes">
          <div className="opd-qcard">
            <p>“Fanpage bị khóa được xử lý chỉ trong 48 giờ.”</p>
            <span>Quốc Huy — F&amp;B Owner</span>
          </div>
          <div className="opd-qcard">
            <p>“Team booking báo chí chuyên nghiệp, bài viết chất lượng.”</p>
            <span>Thu Trang — Founder mỹ phẩm</span>
          </div>
          <div className="opd-qcard">
            <p>“Lên tích xanh Instagram đúng hẹn, hỗ trợ tận tình.”</p>
            <span>Minh Anh — Chủ shop</span>
          </div>
        </div>
      </section>

      {/* FOOTER / CTA */}
      <footer className="opd-footer" id="opd-contact">
        <div className="opd-label light">
          <span>(04)</span> Liên hệ
        </div>
        <h2>Sẵn sàng được xác minh?</h2>
        <div className="opd-contactrow">
          <a href={site.contact.zalo} target="_blank" rel="noreferrer">
            Chat Zalo ↗
          </a>
          <a href={site.contact.messenger} target="_blank" rel="noreferrer">
            Messenger ↗
          </a>
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
        </div>
        <div className="opd-wordmark">vduystudio</div>
        <div className="opd-footbottom">
          <span>© 2026 vduystudio®</span>
          <span>{site.domain}</span>
        </div>
      </footer>

      <style>{`
.opd-root{--paper:#e9e7de;--ink:#16150f;--muted:#6f6c60;--line:#c9c6b8;--accent:#16150f;font-family:var(--font-inter),sans-serif;background:var(--paper);color:var(--ink);min-height:100vh;overflow-x:hidden;}
.opd-root *{box-sizing:border-box;}
.opd-root [id]{scroll-margin-top:80px;}
.opd-nav{position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;padding:20px 40px;background:rgba(233,231,222,.8);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}
.opd-logo{font-family:var(--font-grotesk),sans-serif;font-weight:600;font-size:19px;letter-spacing:-.5px;}
.opd-logo sup{font-size:10px;}
.opd-nav-right{display:flex;align-items:center;gap:28px;font-size:13px;text-transform:uppercase;letter-spacing:1px;}
.opd-nav-right a:hover{opacity:.6;}
.opd-nav-contact{border:1px solid var(--ink);border-radius:100px;padding:8px 16px;}
.opd-nav-contact:hover{background:var(--ink);color:var(--paper);opacity:1 !important;}

.opd-hero{padding:90px 40px 60px;max-width:1300px;margin:0 auto;}
.opd-hero-tag{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:16px;margin-bottom:44px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);flex-wrap:wrap;gap:8px;}
.opd-hero h1{font-family:var(--font-grotesk),sans-serif;font-size:clamp(34px,6vw,86px);line-height:1.06;font-weight:500;letter-spacing:-2px;margin:0;max-width:20ch;}
.opd-hero h1 em{font-family:var(--font-serif),serif;font-style:italic;font-weight:400;letter-spacing:0;}
.opd-hero-scroll{display:inline-block;margin-top:50px;font-size:14px;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid var(--ink);padding-bottom:4px;}
.opd-hero-scroll:hover{opacity:.6;}

.opd-marquee{border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;white-space:nowrap;padding:22px 0;}
.opd-marquee-track{display:inline-block;animation:opdMarq 26s linear infinite;font-family:var(--font-grotesk),sans-serif;font-size:34px;font-weight:500;letter-spacing:-1px;}
.opd-marquee-track b{color:var(--muted);font-weight:400;margin:0 6px;}
@keyframes opdMarq{from{transform:translateX(0);}to{transform:translateX(-50%);}}

.opd-section{max-width:1300px;margin:0 auto;padding:90px 40px;}
.opd-label{display:flex;gap:12px;align-items:center;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:44px;}
.opd-label span{color:var(--ink);font-weight:600;}
.opd-label.light span,.opd-label.light{color:rgba(255,255,255,.6);}

.opd-worklist{display:flex;flex-direction:column;}
.opd-workrow{display:grid;grid-template-columns:60px 1.2fr 1.6fr auto 40px;align-items:center;gap:20px;padding:30px 12px;border-top:1px solid var(--line);color:var(--ink);transition:.3s;}
.opd-worklist .opd-workrow:last-child{border-bottom:1px solid var(--line);}
.opd-workrow:hover{background:var(--ink);color:var(--paper);padding-left:26px;padding-right:26px;}
.opd-workidx{font-size:13px;color:var(--muted);}
.opd-workrow:hover .opd-workidx{color:rgba(255,255,255,.6);}
.opd-workname{font-family:var(--font-grotesk),sans-serif;font-size:clamp(26px,4vw,52px);font-weight:500;letter-spacing:-1.5px;}
.opd-workcat{font-size:14px;color:var(--muted);}
.opd-workrow:hover .opd-workcat{color:rgba(255,255,255,.7);}
.opd-workyear{font-size:15px;color:var(--muted);}
.opd-workrow:hover .opd-workyear{color:rgba(255,255,255,.7);}
.opd-workarrow{font-size:22px;text-align:right;transition:.3s;}
.opd-workrow:hover .opd-workarrow{transform:translate(4px,-4px);}

.opd-statement{font-family:var(--font-grotesk),sans-serif;font-size:clamp(24px,3.4vw,44px);line-height:1.28;font-weight:400;letter-spacing:-1px;max-width:22ch;margin:0 0 60px;}
.opd-statement em{font-family:var(--font-serif),serif;font-style:italic;}
.opd-caps{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid var(--line);}
.opd-cap{padding:32px 24px 32px 0;border-right:1px solid var(--line);}
.opd-cap:last-child{border-right:none;padding-right:0;}
.opd-capk{font-size:12px;color:var(--muted);letter-spacing:1px;}
.opd-cap h3{font-family:var(--font-grotesk),sans-serif;font-size:20px;font-weight:600;margin:16px 0 10px;letter-spacing:-.5px;}
.opd-cap p{font-size:14px;color:var(--muted);line-height:1.6;margin:0;}

.opd-quote{font-family:var(--font-serif),serif;font-style:italic;font-size:clamp(26px,4vw,52px);line-height:1.28;font-weight:400;margin:0 0 60px;max-width:20ch;}
.opd-quote cite{display:block;font-family:var(--font-inter),sans-serif;font-style:normal;font-size:14px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-top:24px;}
.opd-quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;border-top:1px solid var(--line);padding-top:40px;}
.opd-qcard p{font-size:18px;line-height:1.5;margin:0 0 16px;font-weight:500;}
.opd-qcard span{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);}

.opd-footer{background:var(--ink);color:var(--paper);padding:90px 40px 120px;margin-top:40px;}
.opd-footer h2{font-family:var(--font-grotesk),sans-serif;font-size:clamp(34px,6vw,80px);font-weight:500;letter-spacing:-2px;margin:0 0 40px;}
.opd-contactrow{display:flex;gap:32px;flex-wrap:wrap;font-size:clamp(16px,2vw,22px);border-bottom:1px solid rgba(255,255,255,.15);padding-bottom:50px;margin-bottom:20px;}
.opd-contactrow a{border-bottom:1px solid transparent;transition:.2s;}
.opd-contactrow a:hover{border-color:var(--paper);}
.opd-wordmark{font-family:var(--font-grotesk),sans-serif;font-weight:600;font-size:clamp(60px,17vw,240px);letter-spacing:-6px;line-height:.9;color:var(--paper);margin:20px 0;overflow:hidden;}
.opd-footbottom{display:flex;justify-content:space-between;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.5);flex-wrap:wrap;gap:10px;}

@media(max-width:900px){
 .opd-nav{padding:16px 20px;}
 .opd-nav-right{gap:16px;}
 .opd-hero{padding:60px 20px 40px;}
 .opd-section{padding:60px 20px;}
 .opd-workrow{grid-template-columns:36px 1fr 30px;row-gap:6px;}
 .opd-workcat{grid-column:2;font-size:13px;}
 .opd-workyear{display:none;}
 .opd-workarrow{grid-row:1;grid-column:3;}
 .opd-caps{grid-template-columns:1fr 1fr;}
 .opd-cap{border-right:none;border-bottom:1px solid var(--line);padding:24px 0;}
 .opd-cap:nth-child(odd){border-right:1px solid var(--line);padding-right:24px;}
 .opd-quotes{grid-template-columns:1fr;}
 .opd-footer{padding:60px 20px 40px;}
}
@media(max-width:520px){.opd-nav-right a:not(.opd-nav-contact){display:none;}.opd-marquee-track{font-size:24px;}}
      `}</style>
    </div>
  );
}
