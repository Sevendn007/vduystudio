"use client";

import Link from "next/link";
import { ProjectCover } from "@/components/art";
import { BrandLogo, PlatformIcon, Platform } from "@/components/brand";
import { PersonAvatar } from "@/components/brand";
import { site } from "@/lib/site";

const PLATFORMS: { slug: string; icon: Platform; name: string; desc: string }[] = [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", desc: "Tích xanh, mở khóa tài khoản, livestream & giỏ hàng." },
  { slug: "facebook", icon: "facebook", name: "Facebook", desc: "Tích xanh, mở khóa cá nhân & Fanpage." },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram / Threads", desc: "Tích xanh chính thống, mở khóa tài khoản." },
  { slug: "bao-chi", icon: "press", name: "Báo chí", desc: "Booking báo chí, viết bài PR trên đầu báo lớn." },
];

export default function OptionB() {
  return (
    <div className="opb-root">
      <nav className="opb-nav">
        <div className="opb-logo">
          <BrandLogo size={30} showText textColor="#0f1115" />
        </div>
        <div className="opb-menu">
          <a href="#opb-services">Dịch vụ</a>
          <a href="#opb-work">Dự án</a>
          <a href="#opb-testi">Feedback</a>
          <a href="#opb-services">Bảng giá</a>
        </div>
        <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opb-nav-cta">
          Liên hệ ngay
        </a>
      </nav>

      <section className="opb-hero">
        <div className="opb-pill">✓ Đối tác xác minh uy tín cho 500+ khách hàng</div>
        <h1>
          Tích xanh chính thống.
          <br />
          <span className="grad">Uy tín thật, kết quả thật.</span>
        </h1>
        <p>
          VDuyStudio hỗ trợ tích xanh, mở khóa tài khoản &amp; booking báo chí
          cho TikTok, Facebook, Instagram/Threads — minh bạch quy trình, có bảo
          hành.
        </p>
        <div className="opb-hero-ctas">
          <a href="#opb-services" className="opb-btn-primary">Xem bảng giá dịch vụ</a>
          <a href="#opb-work" className="opb-btn-secondary">Xem dự án đã làm</a>
        </div>
        <div className="opb-stats">
          <div className="opb-stat">
            <b>1.200+</b>
            <span>Tài khoản đã lên tích</span>
          </div>
          <div className="opb-stat">
            <b>98%</b>
            <span>Tỉ lệ thành công</span>
          </div>
          <div className="opb-stat">
            <b>4.9/5</b>
            <span>Đánh giá khách hàng</span>
          </div>
          <div className="opb-stat">
            <b>3+ năm</b>
            <span>Kinh nghiệm</span>
          </div>
        </div>
      </section>

      <section className="opb-section" id="opb-services">
        <div className="opb-section-tag">Hạng mục dịch vụ</div>
        <h2>Chọn nền tảng bạn cần hỗ trợ</h2>
        <div className="opb-bento">
          {PLATFORMS.map((p) => (
            <Link href={`/dich-vu/${p.slug}`} className="opb-card" key={p.slug}>
              <PlatformIcon kind={p.icon} size={48} />
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="cta">Xem chi tiết →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="opb-section" id="opb-work">
        <div className="opb-section-tag">Featured Work</div>
        <h2>Dự án tiêu biểu đã triển khai</h2>
        <div className="opb-work">
          <div className="opb-work-card">
            <div className="opb-cover">
              <ProjectCover platform="tiktok" handle="brandhub2" tag="TikTok" />
            </div>
            <div className="res">TikTok · 18 ngày</div>
            <h4>@brand.hub — 2.1M follow</h4>
          </div>
          <div className="opb-work-card">
            <div className="opb-cover">
              <ProjectCover platform="facebook" handle="fnbpage2" tag="Facebook" />
            </div>
            <div className="res">Facebook · 48 giờ</div>
            <h4>Khôi phục Fanpage F&amp;B</h4>
          </div>
          <div className="opb-work-card">
            <div className="opb-cover">
              <ProjectCover platform="bao-chi" handle="prlaunch" tag="Báo chí" />
            </div>
            <div className="res">Báo chí · 6 đầu báo</div>
            <h4>PR ra mắt sản phẩm</h4>
          </div>
        </div>
      </section>

      <section className="opb-section">
        <div className="opb-section-tag">Capabilities</div>
        <h2>Vì sao chọn VDuyStudio</h2>
        <div className="opb-caps">
          <div className="opb-cap">
            <div className="em">⚡</div>
            <h4>Nhanh chóng</h4>
            <p>Cam kết thời gian rõ ràng theo từng gói.</p>
          </div>
          <div className="opb-cap">
            <div className="em">🛡️</div>
            <h4>Bảo hành</h4>
            <p>Hỗ trợ xử lý nếu phát sinh sự cố.</p>
          </div>
          <div className="opb-cap">
            <div className="em">📋</div>
            <h4>Quy trình minh bạch</h4>
            <p>Báo giá rõ, cập nhật tiến độ từng bước.</p>
          </div>
          <div className="opb-cap">
            <div className="em">💬</div>
            <h4>Hỗ trợ 24/7</h4>
            <p>Tư vấn qua Zalo/Messenger mọi lúc.</p>
          </div>
        </div>
      </section>

      <section className="opb-section" id="opb-testi">
        <div className="opb-section-tag">Feedback</div>
        <h2>Khách hàng nói gì</h2>
        <div className="opb-testi">
          {site.testimonials.map((t) => (
            <div className="opb-tcard" key={t.name}>
              <div className="stars">★★★★★</div>
              <p>&quot;{t.quote}&quot;</p>
              <div className="opb-tperson">
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

      <div className="opb-cta-final">
        <h2>Sẵn sàng để được xác minh?</h2>
        <p>Nhắn tin để nhận tư vấn và báo giá miễn phí ngay hôm nay.</p>
        <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opb-btn-primary">
          Liên hệ tư vấn
        </a>
      </div>

      <style>{`
.opb-root{--bg:#fafafa;--card:#fff;--fg:#0f1115;--muted:#6b7280;--accent:#1d9bf0;--accent2:#7c3aed;--border:#e7e8ec;font-family:var(--font-inter),system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;padding-bottom:120px;}
.opb-root *{box-sizing:border-box;}
.opb-root [id]{scroll-margin-top:80px;}
.opb-menu a{cursor:pointer;}
.opb-nav{display:flex;justify-content:space-between;align-items:center;padding:20px 48px;position:sticky;top:0;background:rgba(250,250,250,.85);backdrop-filter:blur(10px);z-index:20;border-bottom:1px solid var(--border);}
.opb-logo{font-weight:800;font-size:16px;display:flex;align-items:center;gap:6px;}
.opb-badge-check{width:18px;height:18px;background:var(--accent);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:11px;}
.opb-menu{display:flex;gap:32px;font-size:14px;color:var(--muted);font-weight:500;}
.opb-menu div{cursor:pointer;}
.opb-nav-cta{background:var(--fg);color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;}

.opb-hero{padding:90px 48px 60px;text-align:center;max-width:900px;margin:0 auto;}
.opb-pill{display:inline-flex;align-items:center;gap:8px;background:#eef6ff;color:var(--accent);border:1px solid #d7ebff;padding:6px 16px;border-radius:100px;font-size:13px;font-weight:600;margin-bottom:24px;}
.opb-hero h1{font-size:clamp(34px,5.5vw,60px);font-weight:800;line-height:1.08;letter-spacing:-1.5px;margin:0 0 20px;}
.opb-hero h1 .grad{background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent;}
.opb-hero p{color:var(--muted);font-size:17px;line-height:1.6;max-width:560px;margin:0 auto 34px;}
.opb-hero-ctas{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.opb-btn-primary{background:var(--fg);color:#fff;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px;cursor:pointer;display:inline-block;}
.opb-btn-secondary{background:#fff;border:1px solid var(--border);padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px;cursor:pointer;}
.opb-stats{display:flex;justify-content:center;gap:56px;margin-top:60px;padding-top:40px;border-top:1px solid var(--border);flex-wrap:wrap;}
.opb-stat b{font-size:30px;display:block;letter-spacing:-1px;}
.opb-stat span{color:var(--muted);font-size:13px;}

.opb-section{padding:70px 48px;max-width:1180px;margin:0 auto;}
.opb-section-tag{color:var(--accent);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;}
.opb-section h2{font-size:clamp(26px,3.5vw,38px);font-weight:800;letter-spacing:-1px;margin:0 0 40px;}

.opb-bento{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.opb-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:26px;display:flex;flex-direction:column;cursor:pointer;transition:.25s;min-height:230px;color:var(--fg);}
.opb-card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(0,0,0,.1);border-color:#d9dce3;}
.opb-card h3{font-size:19px;font-weight:700;margin:18px 0 8px;}
.opb-card p{color:var(--muted);font-size:13.5px;margin:0;line-height:1.55;}
.opb-card .cta{margin-top:auto;padding-top:16px;font-size:13px;font-weight:700;color:var(--accent);display:flex;align-items:center;gap:6px;}

.opb-work{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.opb-work-card{background:#111;border-radius:16px;overflow:hidden;aspect-ratio:4/3;position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:20px;color:#fff;}
.opb-work-card .opb-cover{position:absolute;inset:0;z-index:0;line-height:0;}
.opb-work-card::before{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.8),transparent 60%);z-index:1;}
.opb-work-card .res,.opb-work-card h4{position:relative;z-index:2;}
.opb-work-card .res{font-size:12px;color:#bcdcff;font-weight:700;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px;}
.opb-work-card h4{margin:0;font-size:17px;font-weight:700;}

.opb-caps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.opb-cap{text-align:center;padding:26px 16px;background:#fff;border:1px solid var(--border);border-radius:14px;}
.opb-cap .em{font-size:26px;margin-bottom:10px;}
.opb-cap h4{font-size:15px;font-weight:700;margin:0 0 6px;}
.opb-cap p{color:var(--muted);font-size:13px;margin:0;}

.opb-testi{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.opb-tcard{background:#fff;border:1px solid var(--border);border-radius:14px;padding:22px;}
.opb-tcard .stars{color:#f5b301;font-size:14px;margin-bottom:10px;}
.opb-tcard p{font-size:14px;color:#333;line-height:1.6;margin:0 0 16px;}
.opb-tperson{display:flex;align-items:center;gap:10px;}
.opb-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));flex-shrink:0;}
.opb-tperson b{font-size:13px;display:block;}
.opb-tperson span{font-size:12px;color:var(--muted);}

.opb-cta-final{background:linear-gradient(135deg,#0f1115,#1d1f26);border-radius:24px;padding:70px 48px;text-align:center;color:#fff;margin:0 48px 40px;}
.opb-cta-final h2{font-size:clamp(28px,4vw,42px);font-weight:800;margin:0 0 16px;letter-spacing:-1px;}
.opb-cta-final p{color:#b8bac2;margin:0 0 30px;}
.opb-cta-final .opb-btn-primary{background:#fff;color:#000;}
@media(max-width:860px){.opb-nav{padding:18px 20px;}.opb-menu{display:none;}.opb-hero{padding:70px 20px 40px;}.opb-section{padding:50px 20px;}.opb-bento{grid-template-columns:repeat(2,1fr);}.opb-card.wide{grid-column:span 2;}.opb-work,.opb-caps,.opb-testi{grid-template-columns:1fr 1fr;}.opb-stats{gap:28px;}.opb-cta-final{margin:0 20px 40px;padding:50px 24px;}}
@media(max-width:520px){.opb-caps,.opb-testi{grid-template-columns:1fr;}}
      `}</style>
    </div>
  );
}
