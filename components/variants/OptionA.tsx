"use client";

import Link from "next/link";
import { ProjectCover } from "@/components/art";

export default function OptionA() {
  return (
    <div className="opa-root">
      <div className="opa-grain" />
      <nav className="opa-nav">
        <div className="opa-logo">
          VDUY<span>.</span>STUDIO
        </div>
        <div className="opa-menu">
          <div>Dịch vụ</div>
          <div>Dự án</div>
          <div>Feedback</div>
          <div>Liên hệ</div>
        </div>
        <div className="opa-burger">
          <i />
          <i />
        </div>
      </nav>

      <section className="opa-hero">
        <div className="opa-eyebrow">Verified Identity Studio — Est. 2021</div>
        <h1>
          Xây dựng <em>uy tín</em>
          <br />
          số cho bạn.
        </h1>
        <p className="opa-hero-sub">
          vduystudio giúp cá nhân &amp; thương hiệu đạt tích xanh chính thống, mở
          khóa tài khoản và chinh phục báo chí — bằng quy trình minh bạch, kết
          quả thật.
        </p>
        <div className="opa-hero-cta">
          <div className="opa-btn">Xem dịch vụ</div>
          <div className="opa-btn-ghost">Xem case study →</div>
        </div>
        <div className="opa-scrolldown">
          <div className="line" />
          Scroll
        </div>
      </section>

      <section className="opa-section">
        <div className="opa-section-head">
          <h2>
            Hạng mục
            <br />
            dịch vụ
          </h2>
          <p>
            Bốn nền tảng chủ lực — mỗi nền tảng một quy trình riêng, minh bạch
            từ A-Z.
          </p>
        </div>
        <div className="opa-services">
          <Link href="/dich-vu/tiktok" className="opa-service-row">
            <div className="opa-service-left">
              <span className="opa-service-idx">01</span>
              <h3>TikTok</h3>
            </div>
            <div className="opa-service-tags">
              Tích xanh · Mở khóa · Livestream
            </div>
            <div className="opa-service-arrow">↗</div>
          </Link>
          <Link href="/dich-vu/facebook" className="opa-service-row">
            <div className="opa-service-left">
              <span className="opa-service-idx">02</span>
              <h3>Facebook</h3>
            </div>
            <div className="opa-service-tags">
              Tích xanh · Cá nhân · Fanpage
            </div>
            <div className="opa-service-arrow">↗</div>
          </Link>
          <Link href="/dich-vu/instagram-threads" className="opa-service-row">
            <div className="opa-service-left">
              <span className="opa-service-idx">03</span>
              <h3>Instagram / Threads</h3>
            </div>
            <div className="opa-service-tags">Tích xanh · Mở khóa tài khoản</div>
            <div className="opa-service-arrow">↗</div>
          </Link>
          <Link href="/dich-vu/bao-chi" className="opa-service-row">
            <div className="opa-service-left">
              <span className="opa-service-idx">04</span>
              <h3>Báo chí</h3>
            </div>
            <div className="opa-service-tags">Booking · Viết bài PR</div>
            <div className="opa-service-arrow">↗</div>
          </Link>
        </div>
      </section>

      <section className="opa-section">
        <div className="opa-section-head">
          <h2>
            Featured
            <br />
            Work
          </h2>
          <p>Một vài dự án tiêu biểu đã triển khai gần đây.</p>
        </div>
        <div className="opa-work-grid">
          <div className="opa-work-card tall">
            <div className="opa-cover">
              <ProjectCover platform="tiktok" handle="brandhub" tag="TikTok · Tích xanh" />
            </div>
            <span className="tag">TikTok · Tích xanh</span>
            <h4>@brand.hub — 2.1M follow</h4>
            <p>Đạt tích xanh sau 18 ngày, mở khóa giỏ hàng.</p>
          </div>
          <div className="opa-work-card">
            <div className="opa-cover">
              <ProjectCover platform="facebook" handle="fnbpage" tag="Facebook · Fanpage" />
            </div>
            <span className="tag">Facebook · Fanpage</span>
            <h4>Fanpage F&amp;B miền Bắc</h4>
            <p>Khôi phục fanpage bị khóa trong 48h.</p>
          </div>
          <div className="opa-work-card">
            <div className="opa-cover">
              <ProjectCover platform="bao-chi" handle="prcampaign" tag="Báo chí · PR" />
            </div>
            <span className="tag">Báo chí</span>
            <h4>Booking 6 đầu báo lớn</h4>
            <p>Chiến dịch PR ra mắt sản phẩm mới.</p>
          </div>
        </div>
      </section>

      <div className="opa-marquee">
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

      <section className="opa-cta">
        <h2>Let&apos;s talk.</h2>
        <div className="opa-btn">Liên hệ tư vấn</div>
      </section>
      <div className="opa-footer">
        <div>© 2026 vduystudio</div>
        <div>vduystudio.com</div>
      </div>

      <style>{`
.opa-root{--bg:#0a0a0a;--fg:#f5f4f0;--muted:#8a8a86;--accent:#3ecf8e;font-family:var(--font-inter),'Helvetica Neue',Arial,sans-serif;background:var(--bg);color:var(--fg);overflow-x:hidden;position:relative;min-height:100vh;}
.opa-root *{box-sizing:border-box;}
.opa-grain{position:fixed;inset:0;pointer-events:none;opacity:.05;z-index:50;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.opa-nav{position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;padding:22px 40px;background:linear-gradient(to bottom, rgba(10,10,10,.9), transparent);}
.opa-logo{font-weight:700;letter-spacing:2px;font-size:14px;text-transform:uppercase;}
.opa-logo span{color:var(--accent);}
.opa-menu{display:flex;gap:28px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);}
.opa-menu div:hover{color:var(--fg);cursor:pointer;}
.opa-burger{width:34px;height:34px;border:1px solid #333;border-radius:50%;display:flex;align-items:center;justify-content:center;gap:4px;flex-direction:column;cursor:pointer;}
.opa-burger i{display:block;width:12px;height:1px;background:var(--fg);}
.opa-hero{min-height:92vh;display:flex;flex-direction:column;justify-content:center;padding:0 40px;position:relative;background:
 radial-gradient(ellipse at 70% 30%, rgba(62,207,142,.12), transparent 60%),
 linear-gradient(180deg,#0a0a0a,#050505);}
.opa-eyebrow{font-size:12px;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:18px;font-weight:600;}
.opa-hero h1{font-size:clamp(48px,9vw,128px);line-height:.92;font-weight:800;letter-spacing:-3px;margin:0;text-transform:uppercase;}
.opa-hero h1 em{font-style:italic;font-weight:300;color:var(--muted);}
.opa-hero-sub{max-width:520px;margin-top:28px;color:var(--muted);font-size:16px;line-height:1.6;}
.opa-hero-cta{margin-top:40px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;}
.opa-btn{background:var(--fg);color:#000;padding:16px 30px;border-radius:100px;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:.3s;}
.opa-btn:hover{background:var(--accent);}
.opa-btn-ghost{color:var(--fg);font-size:13px;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid var(--muted);padding-bottom:4px;cursor:pointer;}
.opa-scrolldown{position:absolute;bottom:30px;left:40px;font-size:11px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;display:flex;align-items:center;gap:10px;}
.opa-scrolldown .line{width:1px;height:40px;background:linear-gradient(var(--muted),transparent);}

.opa-section{padding:100px 40px;border-top:1px solid #1a1a1a;}
.opa-section-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:60px;}
.opa-section-head h2{font-size:clamp(28px,4vw,52px);font-weight:800;letter-spacing:-1px;margin:0;text-transform:uppercase;}
.opa-section-head p{color:var(--muted);font-size:14px;max-width:280px;text-align:right;}
.opa-num{color:var(--muted);font-size:12px;letter-spacing:2px;}

.opa-services{display:flex;flex-direction:column;}
.opa-service-row{display:flex;justify-content:space-between;align-items:center;padding:34px 0;border-top:1px solid #1c1c1c;cursor:pointer;position:relative;transition:.3s;gap:16px;}
.opa-service-row:last-child{border-bottom:1px solid #1c1c1c;}
.opa-service-row:hover{padding-left:20px;background:rgba(255,255,255,.02);}
.opa-service-left{display:flex;align-items:baseline;gap:24px;}
.opa-service-idx{color:var(--muted);font-size:14px;width:30px;}
.opa-service-row h3{font-size:clamp(24px,4vw,46px);font-weight:700;margin:0;letter-spacing:-1px;text-transform:uppercase;transition:.3s;}
.opa-service-row:hover h3{color:var(--accent);}
.opa-service-tags{color:var(--muted);font-size:12px;letter-spacing:1px;display:flex;gap:10px;align-items:center;}
.opa-service-arrow{width:44px;height:44px;border-radius:50%;border:1px solid #333;display:flex;align-items:center;justify-content:center;font-size:18px;transition:.3s;flex-shrink:0;}
.opa-service-row:hover .opa-service-arrow{background:var(--accent);color:#000;border-color:var(--accent);transform:rotate(45deg);}

.opa-work-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:20px;}
.opa-work-card{position:relative;border-radius:4px;overflow:hidden;aspect-ratio:4/5;background:linear-gradient(160deg,#1a1a1a,#0d0d0d);display:flex;flex-direction:column;justify-content:flex-end;padding:26px;}
.opa-work-card.tall{grid-row:span 2;aspect-ratio:auto;}
.opa-work-card .opa-cover{position:absolute;inset:0;z-index:0;line-height:0;}
.opa-work-card .tag{position:absolute;top:20px;left:20px;font-size:11px;letter-spacing:1px;color:#fff;text-transform:uppercase;border:1px solid rgba(255,255,255,.4);padding:4px 10px;border-radius:100px;z-index:3;}
.opa-work-card h4{font-size:22px;margin:0 0 6px;font-weight:700;}
.opa-work-card p{margin:0;color:#cfcfcc;font-size:13px;}
.opa-work-card::before{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.8),transparent 65%);z-index:1;}
.opa-work-card h4,.opa-work-card p{position:relative;z-index:2;}

.opa-marquee{overflow:hidden;white-space:nowrap;border-top:1px solid #1a1a1a;border-bottom:1px solid #1a1a1a;padding:26px 0;}
.opa-marquee-track{display:inline-block;animation:opaScroll 22s linear infinite;font-size:22px;font-weight:600;color:var(--muted);}
.opa-marquee-track span{margin:0 30px;}
.opa-marquee-track span.hl{color:var(--fg);}
@keyframes opaScroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}

.opa-cta{text-align:center;padding:140px 40px;}
.opa-cta h2{font-size:clamp(40px,8vw,100px);font-weight:800;letter-spacing:-2px;margin:0 0 30px;text-transform:uppercase;}
.opa-cta .opa-btn{display:inline-block;padding:20px 46px;font-size:14px;}
.opa-footer{display:flex;justify-content:space-between;padding:30px 40px 100px;border-top:1px solid #1a1a1a;color:var(--muted);font-size:12px;letter-spacing:1px;}
@media(max-width:720px){.opa-nav{padding:18px 20px;}.opa-menu{display:none;}.opa-hero{padding:0 20px;}.opa-section{padding:70px 20px;}.opa-scrolldown{left:20px;}.opa-work-grid{grid-template-columns:1fr;}.opa-work-card.tall{grid-row:auto;aspect-ratio:4/5;}.opa-section-head{flex-direction:column;align-items:flex-start;gap:14px;}.opa-section-head p{text-align:left;}.opa-footer{padding:30px 20px 100px;}}
      `}</style>
    </div>
  );
}
