"use client";

import Link from "next/link";
import { PhoneMock, ProjectCover } from "@/components/art";
import { BrandLogo, PlatformIcon } from "@/components/brand";
import { VDuyLockup } from "@/components/logo";
import { site } from "@/lib/site";
import { getProcess } from "@/lib/services";
import { useLang } from "@/lib/i18n";

const TX = {
  vi: {
    navCta: "Chat ngay",
    pill: "🔥 1.200+ tài khoản đã lên tích xanh",
    h1a: "Biến kênh của bạn", h1b: "thành ", h1grad: "tài khoản xịn",
    sub: "Tích xanh · Mở khóa tài khoản · Booking báo chí cho TikTok, Facebook, Instagram & Threads.",
    heroCta: "Nhận tư vấn miễn phí 🚀",
    stats: [["1.200+", "Đã lên tích"], ["500+", "Khách tin tưởng"], ["4.9★", "Đánh giá"], ["7 ngày", "Trung bình xử lý"]],
    pickTitle: "Chọn nền tảng của bạn", pickSub: "Chạm để xem chi tiết dịch vụ, bảng giá & quy trình",
    press: "Báo chí",
    cards: [["✅", "Tích xanh chính thống", "Xác minh danh tính thật, đúng chính sách nền tảng."], ["🔓", "Mở khóa tài khoản", "Khôi phục tài khoản bị khóa/hạn chế nhanh chóng."], ["🛒", "Mở khóa giỏ hàng", "Kích hoạt tính năng bán hàng trên TikTok Shop."], ["🎥", "Mở khóa Livestream", "Kích hoạt quyền livestream cho kênh của bạn."]],
    processTitle: "Quy trình siêu đơn giản", processSub: "4 bước là xong — minh bạch từ đầu tới cuối",
    workTitle: "Dự án tiêu biểu", workSub: "Ảnh chụp thực tế kết quả đã bàn giao",
    tags: ["TikTok · Tích xanh", "Instagram · Mở khóa", "Facebook · Fanpage", "Báo chí · PR", "TikTok · Giỏ hàng", "Threads · Tích xanh"],
    chatTitle: "Khách hàng nói gì", chatSub: "Feedback thật từ tin nhắn Zalo/Messenger",
    chats: [
      ["Ảnh: Tích xanh lên rồi ạ 🎉 cảm ơn team nhiều!", false],
      ["Dạ chúc mừng shop nha, chúc bán hàng thật tốt ạ 🥳", true],
      ["Fanpage mình mở khóa lại được rồi, quá nhanh luôn", false],
      ["Dạ team đã theo sát case này, cảm ơn anh đã tin tưởng ❤️", true],
    ] as [string, boolean][],
    ctaTitle: "Sẵn sàng lên tích xanh chưa?", ctaSub: "Nhắn ngay để được tư vấn gói phù hợp nhất với bạn", ctaBtn: "Chat Zalo ngay",
  },
  en: {
    navCta: "Chat now",
    pill: "🔥 1,200+ accounts verified",
    h1a: "Turn your channel", h1b: "into a ", h1grad: "verified account",
    sub: "Verification badges · Account recovery · Press booking for TikTok, Facebook, Instagram & Threads.",
    heroCta: "Get free consultation 🚀",
    stats: [["1,200+", "Verified"], ["500+", "Happy clients"], ["4.9★", "Rating"], ["7 days", "Avg. turnaround"]],
    pickTitle: "Pick your platform", pickSub: "Tap to see service details, pricing & process",
    press: "Press & PR",
    cards: [["✅", "Official badge", "Genuine identity verification, per platform policy."], ["🔓", "Account recovery", "Quickly restore locked/restricted accounts."], ["🛒", "Shop cart unlock", "Activate selling features on TikTok Shop."], ["🎥", "Livestream unlock", "Activate livestream permission for your channel."]],
    processTitle: "Super simple process", processSub: "Done in 4 steps — transparent start to finish",
    workTitle: "Featured projects", workSub: "Real screenshots of delivered results",
    tags: ["TikTok · Verified", "Instagram · Recovery", "Facebook · Fanpage", "Press · PR", "TikTok · Shop cart", "Threads · Verified"],
    chatTitle: "What clients say", chatSub: "Real feedback from Zalo/Messenger chats",
    chats: [
      ["Photo: the badge is live 🎉 thank you so much team!", false],
      ["Congrats! Wishing your shop great sales 🥳", true],
      ["My fanpage is unlocked again, that was so fast", false],
      ["We followed your case closely — thanks for trusting us ❤️", true],
    ] as [string, boolean][],
    ctaTitle: "Ready to get verified?", ctaSub: "Message us now for the package that fits you best", ctaBtn: "Chat on Zalo",
  },
};

export default function OptionC() {
  const { lang } = useLang();
  const t = TX[lang];
  return (
    <div className="opc-root">
      <div className="opc-bgblob opc-blob1" />
      <div className="opc-bgblob opc-blob2" />
      <div className="opc-bgblob opc-blob3" />

      <nav className="opc-nav">
        <a href="#opc-top" className="opc-logo"><BrandLogo size={30} showText textColor="#0f0f14" /></a>
        <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opc-nav-cta">{t.navCta}</a>
      </nav>

      <section className="opc-hero" id="opc-top">
        <div className="opc-lockup">
          <VDuyLockup
            center
            badgeSize={76}
            wordSize={42}
            iconSize={42}
            taglineColor="var(--muted)"
            barColor="#7c3aed"
            tagline={lang === "en" ? "Verification · Account rescue · Press booking" : "Tích xanh · Cứu tài khoản · Booking báo chí"}
          />
        </div>
        <div className="opc-pill">{t.pill}</div>
        <h1>
          {t.h1a}
          <br />
          {t.h1b}<span className="grad">{t.h1grad}</span>
        </h1>
        <p>{t.sub}</p>
        <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opc-hero-cta">{t.heroCta}</a>

        <div className="opc-phones">
          <div className="opc-phone-wrap">
            <PhoneMock label="Facebook" accent="#1877f2" scale={0.82} />
          </div>
          <div className="opc-phone-wrap mid">
            <PhoneMock label="TikTok" accent="#00c2b8" scale={0.92} />
          </div>
          <div className="opc-phone-wrap">
            <PhoneMock label="Instagram" accent="#dd2a7b" scale={0.82} />
          </div>
        </div>

        <div className="opc-stats">
          {t.stats.map((s, i) => (
            <div className="opc-stat" key={i}>
              <b>{s[0]}</b>
              <span>{s[1]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="opc-section">
        <h2>{t.pickTitle}</h2>
        <p className="sub">{t.pickSub}</p>
        <div className="opc-tabs">
          <Link href="/dich-vu/tiktok" className="opc-tab active"><PlatformIcon kind="tiktok" size={22} /> TikTok</Link>
          <Link href="/dich-vu/facebook" className="opc-tab"><PlatformIcon kind="facebook" size={22} /> Facebook</Link>
          <Link href="/dich-vu/instagram-threads" className="opc-tab"><PlatformIcon kind="instagram" size={22} /> Instagram/Threads</Link>
          <Link href="/dich-vu/bao-chi" className="opc-tab"><PlatformIcon kind="press" size={22} /> {t.press}</Link>
        </div>
        <div className="opc-cardrow">
          {t.cards.map((c, i) => (
            <Link href="/dich-vu/tiktok" className="opc-scard" key={i}>
              <div className="ic">{c[0]}</div>
              <h4>{c[1]}</h4>
              <p>{c[2]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="opc-section">
        <h2>{t.processTitle}</h2>
        <p className="sub">{t.processSub}</p>
        <div className="opc-process">
          {getProcess(lang).map((s, i) => (
            <div className="opc-pstep" key={i}>
              <span className="opc-pnum">{i + 1}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="opc-section">
        <h2>{t.workTitle}</h2>
        <p className="sub">{t.workSub}</p>
        <div className="opc-masonry">
          {(
            [
              ["tiktok", "c1", "TikTok"],
              ["instagram-threads", "c2", "IG"],
              ["facebook", "c3", "FB"],
              ["bao-chi", "c4", "PR"],
              ["tiktok", "c5", "Shop"],
              ["instagram-threads", "c6", "Threads"],
            ] as const
          ).map((m, i) => (
            <div className="opc-mitem" key={i}>
              <div className="opc-cover"><ProjectCover platform={m[0]} handle={m[1]} tag={m[2]} /></div>
              <span>{t.tags[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="opc-section">
        <h2>{t.chatTitle}</h2>
        <p className="sub">{t.chatSub}</p>
        <div className="opc-chats">
          {t.chats.map((c, i) => (
            <div className={`opc-bubble${c[1] ? " me" : ""}`} key={i}>
              {c[0]}
            </div>
          ))}
        </div>
      </section>

      <section className="opc-cta-final">
        <h2>{t.ctaTitle}</h2>
        <p>{t.ctaSub}</p>
        <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="opc-hero-cta">{t.ctaBtn}</a>
      </section>


      <style>{`
.opc-root{--fg:#0f0f14;--muted:#5b5b66;font-family:var(--font-poppins),var(--font-inter),system-ui,sans-serif;color:var(--fg);background:#fff;overflow-x:hidden;position:relative;min-height:100vh;padding-bottom:130px;}
.opc-root *{box-sizing:border-box;}
.opc-root [id]{scroll-margin-top:70px;}
.opc-scard{display:block;color:inherit;}
.opc-bgblob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55;z-index:0;}
.opc-blob1{width:420px;height:420px;top:-140px;left:-100px;background:radial-gradient(circle,#7c3aed,transparent 70%);}
.opc-blob2{width:460px;height:460px;top:60px;right:-140px;background:radial-gradient(circle,#ec4899,transparent 70%);}
.opc-blob3{width:380px;height:380px;top:900px;left:40%;background:radial-gradient(circle,#22d3ee,transparent 70%);}

.opc-nav{display:flex;justify-content:space-between;align-items:center;padding:20px 32px;position:sticky;top:0;z-index:30;backdrop-filter:blur(14px);background:rgba(255,255,255,.6);}
.opc-logo{font-weight:800;font-size:17px;background:linear-gradient(90deg,#7c3aed,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent;}
.opc-nav-cta{background:linear-gradient(90deg,#7c3aed,#ec4899);color:#fff;padding:10px 20px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;}

.opc-hero{position:relative;z-index:1;padding:60px 24px 40px;text-align:center;}
.opc-pill{display:inline-flex;gap:8px;align-items:center;background:#fff;border:1px solid #eee;box-shadow:0 4px 20px rgba(124,58,237,.12);padding:8px 18px;border-radius:100px;font-size:13px;font-weight:600;margin-bottom:22px;}
.opc-hero h1{font-size:clamp(32px,7vw,54px);font-weight:800;line-height:1.1;letter-spacing:-1px;margin:0 0 16px;}
.opc-hero h1 .grad{background:linear-gradient(90deg,#7c3aed,#ec4899,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent;}
.opc-hero p{color:var(--muted);font-size:16px;max-width:440px;margin:0 auto 26px;}
.opc-hero-cta{background:linear-gradient(90deg,#7c3aed,#ec4899);color:#fff;padding:15px 30px;border-radius:100px;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 10px 30px rgba(124,58,237,.35);cursor:pointer;}

.opc-phones{display:flex;justify-content:center;align-items:center;gap:10px;margin:44px auto 10px;max-width:520px;position:relative;z-index:1;}
.opc-phone-wrap{line-height:0;}
.opc-phone-wrap.mid{transform:translateY(-16px);z-index:2;}
.opc-phone{width:120px;height:220px;border-radius:22px;background:linear-gradient(160deg,#1a1a1a,#000);border:4px solid #fff;box-shadow:0 20px 40px rgba(0,0,0,.18);position:relative;overflow:hidden;transform:translateY(0);}
.opc-phone.mid{transform:translateY(-18px) scale(1.08);z-index:2;}
.opc-phone .glow{position:absolute;inset:0;background:linear-gradient(160deg,rgba(124,58,237,.5),rgba(236,72,153,.3));}
.opc-phone .badge{position:absolute;bottom:14px;left:14px;right:14px;background:rgba(255,255,255,.15);backdrop-filter:blur(6px);border-radius:10px;padding:8px;display:flex;align-items:center;gap:6px;font-size:10px;color:#fff;font-weight:700;}
.opc-check{width:16px;height:16px;background:#1d9bf0;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;flex-shrink:0;}

.opc-stats{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;margin:50px auto;position:relative;z-index:1;max-width:720px;}
.opc-stat{background:rgba(255,255,255,.7);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.8);box-shadow:0 8px 24px rgba(0,0,0,.06);border-radius:18px;padding:18px 24px;text-align:center;min-width:140px;}
.opc-stat b{font-size:24px;display:block;background:linear-gradient(90deg,#7c3aed,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent;}
.opc-stat span{font-size:12px;color:var(--muted);font-weight:600;}

.opc-section{position:relative;z-index:1;padding:50px 24px;max-width:1000px;margin:0 auto;}
.opc-section h2{font-size:clamp(24px,4vw,34px);font-weight:800;text-align:center;letter-spacing:-.5px;margin:0 0 10px;}
.opc-section .sub{text-align:center;color:var(--muted);font-size:14px;margin:0 0 34px;}

.opc-tabs{display:flex;justify-content:center;gap:10px;margin-bottom:26px;flex-wrap:wrap;}
.opc-tab{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:100px;font-size:13px;font-weight:700;background:#fff;border:1px solid #eee;cursor:pointer;}
.opc-tab.active{background:linear-gradient(90deg,#7c3aed,#ec4899);color:#fff;border:none;}
.opc-cardrow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.opc-scard{background:rgba(255,255,255,.75);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.9);border-radius:18px;padding:20px;box-shadow:0 8px 24px rgba(0,0,0,.05);cursor:pointer;transition:.25s;}
.opc-scard:hover{transform:translateY(-6px);}
.opc-scard .ic{font-size:26px;margin-bottom:10px;}
.opc-scard h4{font-size:15px;margin:0 0 6px;font-weight:700;}
.opc-scard p{font-size:12px;color:var(--muted);margin:0;}

.opc-lockup{display:flex;justify-content:center;margin-bottom:30px;}
.opc-process{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.opc-pstep{background:rgba(255,255,255,.8);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.95);border-radius:18px;padding:20px;box-shadow:0 8px 24px rgba(0,0,0,.05);}
.opc-pnum{width:34px;height:34px;border-radius:50%;background:linear-gradient(90deg,#7c3aed,#ec4899);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;margin-bottom:12px;}
.opc-pstep h4{font-size:14.5px;margin:0 0 6px;font-weight:700;}
.opc-pstep p{font-size:12px;color:var(--muted);margin:0;line-height:1.5;}

.opc-masonry{columns:3;column-gap:14px;}
.opc-mitem{break-inside:avoid;margin-bottom:14px;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#e9d5ff,#fbcfe8);aspect-ratio:1;position:relative;display:flex;align-items:flex-end;padding:14px;}
.opc-mitem:nth-child(2){aspect-ratio:1/1.3;background:linear-gradient(160deg,#bae6fd,#e9d5ff);}
.opc-mitem:nth-child(3){aspect-ratio:1/0.8;background:linear-gradient(160deg,#fbcfe8,#fef08a);}
.opc-mitem .opc-cover{position:absolute;inset:0;z-index:0;line-height:0;}
.opc-mitem span{position:relative;z-index:1;background:rgba(0,0,0,.55);color:#fff;font-size:11px;font-weight:700;padding:5px 10px;border-radius:100px;}

.opc-chats{display:flex;flex-direction:column;gap:12px;max-width:420px;margin:0 auto;}
.opc-bubble{background:#f0f0f3;border-radius:18px 18px 18px 4px;padding:12px 16px;font-size:13.5px;max-width:80%;align-self:flex-start;}
.opc-bubble.me{background:linear-gradient(90deg,#7c3aed,#ec4899);color:#fff;border-radius:18px 18px 4px 18px;align-self:flex-end;}

.opc-cta-final{position:relative;z-index:1;text-align:center;padding:70px 24px;}
.opc-cta-final h2{font-size:clamp(26px,5vw,40px);font-weight:800;margin:0 0 14px;}
.opc-cta-final p{color:var(--muted);margin:0 0 24px;}

.opc-fab{position:fixed;bottom:80px;right:22px;background:linear-gradient(90deg,#2563eb,#22d3ee);color:#fff;padding:14px 22px;border-radius:100px;font-weight:700;font-size:13px;box-shadow:0 10px 30px rgba(37,99,235,.4);z-index:50;display:flex;align-items:center;gap:8px;cursor:pointer;}
@media(max-width:720px){.opc-cardrow,.opc-process{grid-template-columns:1fr 1fr;}.opc-masonry{columns:2;}.opc-phones{transform:scale(.85);}}
      `}</style>
    </div>
  );
}
