"use client";

// Popup chào mừng — bung ra khi khách vào landing lần đầu trong phiên
// (sessionStorage), giới thiệu nhanh 5 nhóm dịch vụ + kênh liên hệ + CTA.
// Style bám theo tông dark-teal của bản Premium (glass card, viền teal,
// heading Anton, sparkle ✦) thay vì nền trắng như mockup tham khảo.

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PlatformIcon, Platform } from "@/components/brand";
import { Mark3D, Wordmark } from "@/components/premiumKit";
import { useLang, Lang } from "@/lib/i18n";
import { useContact } from "@/lib/useContact";

const SEEN_KEY = "vds_welcome_seen";
const OPEN_DELAY = 900; // ms — để hero kịp render trước khi popup bung

// 5 nhóm dịch vụ (khớp với section Dịch vụ ở trang chủ).
const SERVICES = (lang: Lang): { slug: string; icon: Platform; name: string; desc: string }[] => [
  { slug: "tiktok", icon: "tiktok", name: "TikTok", desc: lang === "en" ? "Badge · unlock · livestream" : "Tích xanh, mở khóa, live" },
  { slug: "facebook", icon: "facebook", name: "Facebook", desc: lang === "en" ? "Badge · page recovery" : "Tích xanh, kháng page" },
  { slug: "instagram-threads", icon: "instagram", name: "Instagram", desc: lang === "en" ? "Meta badge & recovery" : "Tích xanh & mở khóa" },
  { slug: "bao-chi", icon: "press", name: lang === "en" ? "Press" : "Báo chí", desc: lang === "en" ? "Booking · SEO PR" : "Booking, bài PR chuẩn SEO" },
  { slug: "website", icon: "website", name: "Website", desc: lang === "en" ? "Landing · shop · tools" : "Landing, web bán hàng, tool" },
];

const TX = {
  vi: {
    title: "HỖ TRỢ DỊCH VỤ",
    badge: "Xây dựng uy tín số cho thương hiệu của bạn",
    connect: "Kết nối nhanh",
    fanpage: "Fanpage",
    fanpageSub: "Theo dõi ngay",
    zalo: "Zalo",
    zaloSub: "Chat tư vấn",
    tiktokSub: "Xem dự án thật",
    trust: [
      { t: "UY TÍN", s: "3+ năm kinh nghiệm" },
      { t: "NHANH CHÓNG", s: "Xử lý 24–72h" },
      { t: "AN TOÀN", s: "Bảo mật tuyệt đối" },
      { t: "HỖ TRỢ 24/7", s: "Tận tâm" },
    ],
    cta: "Khám phá ngay",
    close: "Đóng",
  },
  en: {
    title: "SERVICE SUPPORT",
    badge: "Building digital trust for your brand",
    connect: "Quick connect",
    fanpage: "Fanpage",
    fanpageSub: "Follow us",
    zalo: "Zalo",
    zaloSub: "Chat with us",
    tiktokSub: "See real work",
    trust: [
      { t: "TRUSTED", s: "3+ years" },
      { t: "FAST", s: "24–72h turnaround" },
      { t: "SECURE", s: "Full confidentiality" },
      { t: "24/7 SUPPORT", s: "Always on" },
    ],
    cta: "Explore now",
    close: "Close",
  },
};

export default function WelcomePopup() {
  const { lang } = useLang();
  const contact = useContact();
  const [mounted, setMounted] = useState(false); // đã gắn vào DOM
  const [show, setShow] = useState(false); // trạng thái animation vào/ra
  const t = TX[lang];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const id = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setShow(true));
    }, OPEN_DELAY);
    return () => clearTimeout(id);
  }, []);

  const close = useCallback(() => {
    setShow(false);
    sessionStorage.setItem(SEEN_KEY, "1");
    setTimeout(() => setMounted(false), 260); // chờ animation đóng
  }, []);

  // ESC để đóng + khóa cuộn nền khi popup mở
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mounted, close]);

  if (!mounted) return null;

  // Kênh liên hệ: chỉ hiện kênh đã cấu hình trong admin (tối đa 3).
  const channels = [
    contact.isSet("facebook") && { key: "facebook", url: contact.facebook, icon: "facebook" as Platform, label: t.fanpage, sub: t.fanpageSub },
    contact.isSet("zalo") && { key: "zalo", url: contact.zalo, icon: null, label: t.zalo, sub: t.zaloSub },
    contact.isSet("tiktok") && { key: "tiktok", url: contact.tiktok, icon: "tiktok" as Platform, label: "TikTok", sub: t.tiktokSub },
  ].filter(Boolean) as { key: string; url: string; icon: Platform | null; label: string; sub: string }[];

  return (
    <div className={`wp-overlay${show ? " in" : ""}`} role="dialog" aria-modal="true" aria-label={t.title} onClick={close}>
      <div className="wp-card" onClick={(e) => e.stopPropagation()}>
        <span className="wp-glow" aria-hidden />
        <button className="wp-close" onClick={close} aria-label={t.close}>✕</button>

        {/* thương hiệu */}
        <div className="wp-brand">
          <span className="wp-mark">
            <Mark3D layers={8} className="nav" alt="VDuyStudio" />
          </span>
          <Wordmark className="wp-wm" />
        </div>

        {/* tiêu đề + badge */}
        <h2 className="wp-title">
          <i aria-hidden>✦</i> {t.title} <i aria-hidden>✦</i>
        </h2>
        <div className="wp-badge">{t.badge}</div>

        {/* 5 nhóm dịch vụ */}
        <div className="wp-services">
          {SERVICES(lang).map((s) => (
            <Link href={`/dich-vu/${s.slug}`} className="wp-svc" key={s.slug} onClick={close}>
              <span className="wp-svc-ic">
                <PlatformIcon kind={s.icon} size={30} />
              </span>
              <b>{s.name}</b>
              <span className="wp-svc-desc">{s.desc}</span>
            </Link>
          ))}
        </div>

        {/* kênh liên hệ */}
        {channels.length > 0 && (
          <div className="wp-channels">
            {channels.map((c) => (
              <a className="wp-ch" key={c.key} href={c.url} target="_blank" rel="noreferrer">
                <span className="wp-ch-ic">{c.icon ? <PlatformIcon kind={c.icon} size={26} /> : <ZaloGlyph />}</span>
                <span className="wp-ch-tx">
                  <b>{c.label}</b>
                  <span>{c.sub}</span>
                </span>
              </a>
            ))}
          </div>
        )}

        {/* cam kết */}
        <div className="wp-trust">
          {t.trust.map((x, i) => (
            <span className="wp-trust-item" key={x.t}>
              <span className="wp-trust-ic" aria-hidden>{TRUST_ICONS[i]}</span>
              <span className="wp-trust-tx">
                <b>{x.t}</b>
                <span>{x.s}</span>
              </span>
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#pm-services"
          className="wp-cta"
          onClick={(e) => {
            e.preventDefault();
            close();
            document.getElementById("pm-services")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          🚀 {t.cta} <i aria-hidden>→</i>
        </a>
      </div>

      <style>{`
.wp-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;
 padding:clamp(12px,3vw,28px);background:rgba(1,6,9,.72);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);
 opacity:0;transition:opacity .26s ease;font-family:var(--pm-font-body);overflow-y:auto;}
.wp-overlay.in{opacity:1;}
.wp-card{position:relative;width:min(880px,100%);max-height:calc(100svh - 32px);overflow-y:auto;overflow-x:hidden;
 padding:clamp(26px,3.4vw,40px) clamp(18px,3vw,42px) clamp(24px,3vw,34px);
 border:1px solid rgba(45,212,191,.28);border-radius:26px;color:#e6f0f2;text-align:center;
 background:
  radial-gradient(680px 380px at 22% 8%,rgba(13,148,136,.20),transparent 62%),
  radial-gradient(620px 360px at 84% 92%,rgba(8,145,178,.18),transparent 66%),
  linear-gradient(180deg,#06161c 0%,#02090c 100%);
 box-shadow:0 40px 90px rgba(0,0,0,.6),0 0 70px rgba(45,212,191,.12);
 transform:translateY(22px) scale(.96);opacity:0;transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .3s ease;
 scrollbar-width:none;}
.wp-card::-webkit-scrollbar{display:none;}
.wp-overlay.in .wp-card{transform:none;opacity:1;}
.wp-glow{position:absolute;top:-90px;left:50%;transform:translateX(-50%);width:340px;height:180px;border-radius:50%;
 background:radial-gradient(ellipse,rgba(45,212,191,.35),transparent 70%);filter:blur(30px);pointer-events:none;}
.wp-close{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:50%;cursor:pointer;
 border:1px solid rgba(94,209,214,.24);background:rgba(6,22,28,.8);color:#9fc4cd;font-size:15px;line-height:1;
 display:flex;align-items:center;justify-content:center;transition:.2s;z-index:3;}
.wp-close:hover{color:#fff;border-color:rgba(45,212,191,.6);background:rgba(45,212,191,.14);transform:rotate(90deg);}

.wp-brand{position:relative;display:flex;align-items:center;justify-content:center;gap:12px;}
.wp-mark{display:block;width:52px;perspective:800px;flex-shrink:0;}
.pm-wm.wp-wm{font-size:clamp(18px,2.6vw,26px);letter-spacing:.06em;}

.wp-title{position:relative;font-family:var(--pm-font-display);font-weight:400;letter-spacing:.02em;
 font-size:clamp(28px,5.4vw,54px);line-height:1.08;margin:14px 0 0;text-transform:uppercase;
 background:linear-gradient(180deg,#fff 18%,#9db3c5 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.wp-title i{font-style:normal;font-size:.42em;color:#5eead4;vertical-align:middle;
 -webkit-text-fill-color:#5eead4;text-shadow:0 0 18px rgba(94,234,212,.6);}
.wp-badge{display:inline-block;margin:16px 0 0;padding:9px 22px;border-radius:100px;font-size:12.5px;font-weight:700;
 letter-spacing:1.2px;text-transform:uppercase;color:#03222e;
 background:linear-gradient(90deg,#5eead4,#22d3ee);box-shadow:0 10px 30px rgba(45,212,191,.28);}

.wp-services{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:26px 0 0;}
.wp-svc{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 8px 14px;border-radius:16px;
 border:1px solid rgba(94,209,214,.14);background:rgba(45,212,191,.045);transition:.22s;}
.wp-svc:hover{border-color:rgba(45,212,191,.5);background:rgba(45,212,191,.1);transform:translateY(-3px);}
.wp-svc-ic{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:15px;
 background:rgba(45,212,191,.09);border:1px solid rgba(45,212,191,.24);
 filter:drop-shadow(0 8px 20px rgba(45,212,191,.22));transition:.22s;}
.wp-svc:hover .wp-svc-ic{transform:scale(1.08);}
.wp-svc b{font-family:var(--pm-font-heading);font-weight:700;font-size:13.5px;letter-spacing:.6px;color:#fff;margin-top:4px;}
.wp-svc-desc{font-size:11px;line-height:1.35;color:#8fadb5;}

.wp-channels{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:20px 0 0;}
.wp-ch{display:flex;align-items:center;gap:12px;padding:12px 22px 12px 16px;border-radius:16px;min-width:200px;
 border:1px solid rgba(94,209,214,.18);background:rgba(4,14,18,.75);transition:.22s;}
.wp-ch:hover{border-color:rgba(45,212,191,.5);background:rgba(45,212,191,.08);transform:translateY(-2px);}
.wp-ch-ic{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;
 background:rgba(45,212,191,.08);flex-shrink:0;}
.wp-ch-tx{display:flex;flex-direction:column;align-items:flex-start;line-height:1.25;}
.wp-ch-tx b{font-family:var(--pm-font-heading);font-weight:700;font-size:15px;letter-spacing:.8px;text-transform:uppercase;color:#fff;}
.wp-ch-tx span{font-size:11.5px;color:#8fadb5;}

.wp-trust{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:22px 0 0;
 padding:16px 0;border-top:1px solid rgba(94,209,214,.14);border-bottom:1px solid rgba(94,209,214,.14);}
.wp-trust-item{display:flex;align-items:center;justify-content:center;gap:9px;}
.wp-trust-ic{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:11px;
 color:#5eead4;background:rgba(45,212,191,.09);border:1px solid rgba(45,212,191,.2);flex-shrink:0;}
.wp-trust-tx{display:flex;flex-direction:column;align-items:flex-start;line-height:1.25;}
.wp-trust-tx b{font-size:11.5px;font-weight:800;letter-spacing:.8px;color:#e6f0f2;}
.wp-trust-tx span{font-size:10.5px;color:#8fadb5;}

.wp-cta{display:inline-flex;align-items:center;gap:10px;margin:24px 0 0;padding:15px 44px;border-radius:100px;
 font-weight:800;font-size:15px;letter-spacing:1px;text-transform:uppercase;color:#03222e;
 background:linear-gradient(90deg,#5eead4,#22d3ee);box-shadow:0 0 44px rgba(56,189,248,.34);transition:.25s;}
.wp-cta:hover{transform:scale(1.04);box-shadow:0 0 64px rgba(56,189,248,.55);}
.wp-cta i{font-style:normal;transition:.25s;}
.wp-cta:hover i{transform:translateX(4px);}

@media(max-width:760px){
 .wp-services{grid-template-columns:repeat(3,1fr);}
 .wp-trust{grid-template-columns:repeat(2,1fr);gap:14px 8px;}
}
/* Điện thoại: nén chiều cao để CTA vẫn nằm trong 1 màn hình */
@media(max-width:480px){
 .wp-card{padding:20px 12px 18px;border-radius:22px;}
 .wp-mark{width:40px;}
 .wp-title{font-size:30px;margin-top:10px;}
 .wp-badge{font-size:10px;letter-spacing:.4px;padding:7px 13px;margin-top:12px;}
 .wp-services{grid-template-columns:repeat(2,1fr);gap:8px;margin-top:16px;}
 .wp-svc{padding:10px 6px 9px;gap:3px;border-radius:14px;}
 .wp-svc-ic{width:40px;height:40px;border-radius:12px;}
 .wp-svc-ic svg{width:26px;height:26px;}
 .wp-svc b{font-size:12px;margin-top:2px;}
 .wp-svc-desc{font-size:9.5px;line-height:1.3;}
 /* 3 kênh liên hệ xếp 1 hàng, icon trên chữ dưới */
 .wp-channels{gap:8px;margin-top:12px;}
 .wp-ch{flex:1 1 0;min-width:0;flex-direction:column;gap:5px;padding:10px 4px;border-radius:14px;}
 .wp-ch-ic{width:32px;height:32px;border-radius:10px;}
 .wp-ch-ic svg{width:22px;height:22px;}
 .wp-ch-tx{align-items:center;text-align:center;}
 .wp-ch-tx b{font-size:12px;letter-spacing:.4px;}
 .wp-ch-tx span{font-size:9.5px;}
 .wp-trust{margin-top:14px;padding:12px 0;gap:12px 6px;}
 .wp-trust-item{justify-content:flex-start;}
 .wp-trust-ic{width:30px;height:30px;border-radius:9px;}
 .wp-trust-tx b{font-size:10px;}
 .wp-trust-tx span{font-size:9.5px;}
 .wp-cta{margin-top:16px;padding:13px 28px;font-size:13px;}
}
@media(prefers-reduced-motion:reduce){
 .wp-overlay,.wp-card{transition:none;}
}
      `}</style>
    </div>
  );
}

// Zalo không có trong PlatformIcon — vẽ glyph riêng theo tông teal của site.
function ZaloGlyph() {
  return (
    <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden>
      <path
        fill="#5eead4"
        d="M24 7C13.5 7 5 14.4 5 23.5c0 5 2.5 9.5 6.6 12.4-.3 2-1.2 4-2.6 5.6-.4.5-.1 1.2.5 1.2 3.3-.1 6.2-1.2 8.4-2.8 2 .5 4 .8 6.1.8 10.5 0 19-7.4 19-16.5S34.5 7 24 7z"
      />
      <text x="24" y="28" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="800" fill="#03222e">
        Zalo
      </text>
    </svg>
  );
}

const TRUST_ICONS = [
  // uy tín — badge check
  <svg key="a" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" /><path d="m9 12 2 2 4-4" /></svg>,
  // nhanh chóng — tia sét
  <svg key="b" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>,
  // an toàn — ổ khóa
  <svg key="c" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>,
  // hỗ trợ 24/7 — tai nghe
  <svg key="d" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="2.5" y="14" width="4.5" height="6" rx="2" /><rect x="17" y="14" width="4.5" height="6" rx="2" /></svg>,
];
