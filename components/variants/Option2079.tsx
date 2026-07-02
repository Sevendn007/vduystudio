"use client";

// VDuyOS 2079 — "hệ điều hành uy tín số" từ tương lai.
// Concept: cả trang web vận hành như một OS: boot → quét định danh (radar
// tương tác) → chẩn đoán ra các "lỗi hệ thống" = chính các dịch vụ → triển
// khai module (link trang chi tiết) → cư dân TRUST-NET (feedback) → terminal
// liên hệ. Điên rồ nhưng mỗi bước đều là một bước trong phễu bán hàng thật.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PlatformIcon, PersonAvatar, Platform } from "@/components/brand";
import { VDuyBadge } from "@/components/logo";
import { useLang } from "@/lib/i18n";
import { site, siteText } from "@/lib/site";

type Diag = { icon: Platform; slug: string; code: string; vi: [string, string]; en: [string, string] };

const DIAGS: Diag[] = [
  { icon: "tiktok", slug: "tiktok", code: "ERR-401", vi: ["TikTok: thiếu huy hiệu xác minh", "Uy tín kênh dưới chuẩn TRUST-NET · khuyến nghị cấp tích xanh chính thống"], en: ["TikTok: verification badge missing", "Channel trust below TRUST-NET standard · official badge recommended"] },
  { icon: "facebook", slug: "facebook", code: "ERR-403", vi: ["Facebook: tài khoản/Fanpage bị khóa", "Phát hiện quyền truy cập bị chặn · khuyến nghị chạy module khôi phục"], en: ["Facebook: account/fanpage locked", "Blocked access detected · recovery module recommended"] },
  { icon: "instagram", slug: "instagram-threads", code: "ERR-402", vi: ["Instagram/Threads: chưa xác minh", "Danh tính chưa được Meta xác thực · khuyến nghị cấp huy hiệu"], en: ["Instagram/Threads: unverified", "Identity not yet Meta-verified · badge issuance recommended"] },
  { icon: "press", slug: "bao-chi", code: "WARN-90", vi: ["Báo chí: độ phủ truyền thông = 0", "Không tìm thấy bài PR trên các đầu báo lớn · khuyến nghị booking báo chí"], en: ["Press: media coverage = 0", "No PR articles found on major outlets · press booking recommended"] },
];

const TX = {
  vi: {
    boot: ["VDuyOS v79.4 — TRUST-NET KERNEL", "> nạp lõi định danh ......... OK", "> kết nối TRUST-NET ......... OK", "> hiệu chuẩn máy quét uy tín . OK", "> chào mừng, thương hiệu tương lai"],
    skip: "bấm để bỏ qua",
    online: "TRỰC TUYẾN",
    node: "NÚT MẠNG: VN-HAN-01",
    heroTag: "HỆ ĐIỀU HÀNH UY TÍN SỐ · PHIÊN BẢN 2079",
    heroTitle1: "Năm 2079, không ai hỏi bạn là ai.",
    heroTitle2: "TRUST-NET trả lời thay bạn.",
    heroSub: "Mọi thương hiệu tương lai đều chạy trên một lõi định danh được xác minh. VDuyStudio cài nó cho bạn ngay hôm nay — tích xanh, mở khóa tài khoản, độ phủ báo chí.",
    scanBtn: "▶ QUÉT ĐỊNH DANH THƯƠNG HIỆU",
    scanning: "ĐANG QUÉT",
    rescan: "↺ QUÉT LẠI",
    scanIdle: "Máy quét sẵn sàng. Khởi chạy để chẩn đoán uy tín số của bạn.",
    diagTitle: "KẾT QUẢ CHẨN ĐOÁN — 4 LỖ HỔNG UY TÍN",
    deploy: "TRIỂN KHAI MODULE →",
    modulesTag: "KHO MODULE HỆ THỐNG",
    modulesTitle: "Mỗi dịch vụ là một module — cài là chạy.",
    open: "MỞ MODULE",
    citizensTag: "CƯ DÂN TRUST-NET",
    citizensTitle: "Họ đã được xác minh từ trước năm 2079.",
    trustIndex: "CHỈ SỐ TÍN NHIỆM",
    termTitle: "KẾT NỐI TRỰC TIẾP VỚI TRẠM ĐIỀU HÀNH",
    termHint: "// chọn một lệnh để mở kênh liên hệ",
    stats: ["tài khoản đã xác minh", "tỉ lệ thành công", "đánh giá", "năm vận hành"],
    footer: "VDuyOS © 2026–2079 · một sản phẩm của VDuyStudio",
  },
  en: {
    boot: ["VDuyOS v79.4 — TRUST-NET KERNEL", "> loading identity core ...... OK", "> linking TRUST-NET .......... OK", "> calibrating trust scanner .. OK", "> welcome, brand of the future"],
    skip: "click to skip",
    online: "ONLINE",
    node: "NODE: VN-HAN-01",
    heroTag: "DIGITAL TRUST OPERATING SYSTEM · BUILD 2079",
    heroTitle1: "In 2079, nobody asks who you are.",
    heroTitle2: "TRUST-NET answers for you.",
    heroSub: "Every future brand runs on a verified identity core. VDuyStudio installs yours today — verification badges, account recovery, press coverage.",
    scanBtn: "▶ SCAN YOUR BRAND IDENTITY",
    scanning: "SCANNING",
    rescan: "↺ SCAN AGAIN",
    scanIdle: "Scanner ready. Launch to diagnose your digital trust.",
    diagTitle: "DIAGNOSTIC RESULT — 4 TRUST VULNERABILITIES",
    deploy: "DEPLOY MODULE →",
    modulesTag: "SYSTEM MODULE REGISTRY",
    modulesTitle: "Every service is a module — install and run.",
    open: "OPEN MODULE",
    citizensTag: "CITIZENS OF TRUST-NET",
    citizensTitle: "Verified long before 2079.",
    trustIndex: "TRUST INDEX",
    termTitle: "DIRECT LINK TO MISSION CONTROL",
    termHint: "// pick a command to open a contact channel",
    stats: ["accounts verified", "success rate", "rating", "years running"],
    footer: "VDuyOS © 2026–2079 · a VDuyStudio product",
  },
};

const MODULES: { icon: Platform; slug: string; name: string; ver: string; vi: string; en: string }[] = [
  { icon: "tiktok", slug: "tiktok", name: "tiktok.verify", ver: "v9.2", vi: "Tích xanh · mở khóa · livestream · giỏ hàng", en: "Badge · recovery · livestream · shop cart" },
  { icon: "facebook", slug: "facebook", name: "facebook.restore", ver: "v7.8", vi: "Tích xanh · cứu tài khoản cá nhân & Fanpage", en: "Badge · personal & fanpage recovery" },
  { icon: "instagram", slug: "instagram-threads", name: "meta.badge", ver: "v6.4", vi: "Tích xanh & mở khóa Instagram / Threads", en: "Badge & recovery for Instagram / Threads" },
  { icon: "press", slug: "bao-chi", name: "press.amplify", ver: "v4.1", vi: "Booking báo chí · viết bài PR chuẩn SEO", en: "Press booking · SEO-standard PR writing" },
];

export default function Option2079() {
  const { lang } = useLang();
  const t = TX[lang];
  const st = siteText(lang);

  const [booted, setBooted] = useState(true);
  const [scan, setScan] = useState<"idle" | "running" | "done">("idle");
  const [found, setFound] = useState(0);
  const [clock, setClock] = useState("--:--:--");
  const scanTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Boot một lần mỗi phiên.
  useEffect(() => {
    if (!window.sessionStorage.getItem("vduy-2079-booted")) {
      setBooted(false);
      const timer = setTimeout(() => finishBoot(), 2600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-GB"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => () => scanTimers.current.forEach(clearTimeout), []);

  const finishBoot = () => {
    window.sessionStorage.setItem("vduy-2079-booted", "1");
    setBooted(true);
  };

  const runScan = () => {
    scanTimers.current.forEach(clearTimeout);
    scanTimers.current = [];
    setScan("running");
    setFound(0);
    DIAGS.forEach((_, i) => {
      scanTimers.current.push(setTimeout(() => setFound(i + 1), 900 + i * 650));
    });
    scanTimers.current.push(setTimeout(() => setScan("done"), 900 + DIAGS.length * 650));
  };

  return (
    <div className="o79-root" id="o79-top">
      {/* BOOT OVERLAY */}
      {!booted && (
        <button className="o79-boot" onClick={finishBoot} aria-label={t.skip}>
          <div className="o79-boot-lines">
            {t.boot.map((line, i) => (
              <div key={i} style={{ animationDelay: `${i * 0.38}s` }}>{line}</div>
            ))}
          </div>
          <span className="o79-boot-skip">{t.skip}</span>
        </button>
      )}

      <div className="o79-scanlines" />
      <div className="o79-grid" />

      {/* HUD BAR */}
      <nav className="o79-hud">
        <a href="#o79-top" className="o79-hud-brand">
          <VDuyBadge size={26} intro={false} />
          <b>VDuyOS</b>
          <span className="o79-hud-ver">v79.4</span>
        </a>
        <div className="o79-hud-mid">
          <span>{t.node}</span>
          <span className="o79-hud-clock">{clock}</span>
        </div>
        <span className="o79-hud-status">
          <i />
          {t.online}
        </span>
      </nav>

      {/* HERO */}
      <header className="o79-hero">
        <div className="o79-hero-tag">{t.heroTag}</div>
        <h1>
          <span className="o79-glitch" data-text={t.heroTitle1}>{t.heroTitle1}</span>
          <span className="o79-holo">{t.heroTitle2}</span>
        </h1>
        <p>{t.heroSub}</p>
        <div className="o79-statline">
          {st.stats.map((s, i) => (
            <span key={i}>
              <b>{s.value}</b> {t.stats[i]}
            </span>
          ))}
        </div>
      </header>

      {/* SCANNER + DIAGNOSTICS */}
      <section className="o79-scanner-wrap" id="o79-scan">
        <div className="o79-panel o79-scanpanel">
          <div className={`o79-radar${scan === "running" ? " on" : ""}`}>
            <div className="o79-radar-ring r1" />
            <div className="o79-radar-ring r2" />
            <div className="o79-radar-ring r3" />
            <div className="o79-radar-sweep" />
            <div className="o79-radar-core">
              <VDuyBadge size={54} intro={false} />
            </div>
            {DIAGS.map((d, i) => (
              <span key={d.slug} className={`o79-blip b${i + 1}${found > i ? " hit" : ""}`} />
            ))}
          </div>
          {scan === "idle" && (
            <>
              <p className="o79-scan-hint">{t.scanIdle}</p>
              <button className="o79-btn" onClick={runScan}>{t.scanBtn}</button>
            </>
          )}
          {scan === "running" && (
            <p className="o79-scan-hint mono">
              {t.scanning}
              <span className="o79-dots"><i>.</i><i>.</i><i>.</i></span> [{found}/4]
            </p>
          )}
          {scan === "done" && (
            <button className="o79-btn ghost" onClick={runScan}>{t.rescan}</button>
          )}
        </div>

        <div className="o79-panel o79-diagpanel" aria-live="polite">
          <div className="o79-panel-head">{t.diagTitle}</div>
          {found === 0 && <div className="o79-diag-empty">— — —</div>}
          <div className="o79-diags">
            {DIAGS.slice(0, found).map((d) => (
              <div className="o79-diag" key={d.code}>
                <PlatformIcon kind={d.icon} size={34} />
                <div className="o79-diag-body">
                  <div className="o79-diag-top">
                    <code>{d.code}</code>
                    <b>{lang === "en" ? d.en[0] : d.vi[0]}</b>
                  </div>
                  <span>{lang === "en" ? d.en[1] : d.vi[1]}</span>
                </div>
                <Link href={`/dich-vu/${d.slug}`} className="o79-fix">{t.deploy}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="o79-ticker">
        <div className="o79-ticker-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              {t.trustIndex} <b className="up">▲ 98%</b> · @brand.hub <b>VERIFIED ✓</b> ·
              FANPAGE F&B <b className="up">RESTORED</b> · @luxhouse.vn <b>VERIFIED ✓</b> ·
              PRESS ×6 <b className="up">PUBLISHED</b> · @creator.minh <b>LIVE UNLOCKED</b> ·{" "}
            </span>
          ))}
        </div>
      </div>

      {/* MODULES */}
      <section className="o79-section" id="o79-modules">
        <div className="o79-sec-tag">{t.modulesTag}</div>
        <h2>{t.modulesTitle}</h2>
        <div className="o79-modules">
          {MODULES.map((m) => (
            <Link href={`/dich-vu/${m.slug}`} className="o79-module" key={m.slug}>
              <div className="o79-module-head">
                <PlatformIcon kind={m.icon} size={40} />
                <span className="o79-module-ver">{m.ver}</span>
              </div>
              <code className="o79-module-name">{m.name}</code>
              <p>{lang === "en" ? m.en : m.vi}</p>
              <span className="o79-module-open">{t.open} ⌁</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CITIZENS */}
      <section className="o79-section" id="o79-citizens">
        <div className="o79-sec-tag">{t.citizensTag}</div>
        <h2>{t.citizensTitle}</h2>
        <div className="o79-citizens">
          {st.testimonials.map((c) => (
            <div className="o79-citizen" key={c.name}>
              <div className="o79-citizen-id">
                <PersonAvatar name={c.name} hue={c.hue} size={46} />
                <div>
                  <b>{c.name}</b>
                  <span>{c.company}</span>
                </div>
                <code>★★★★★</code>
              </div>
              <p>“{c.quote}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* TERMINAL CONTACT */}
      <section className="o79-terminal" id="o79-contact">
        <div className="o79-term-head">
          <span className="dot r" /><span className="dot y" /><span className="dot g" />
          <span className="o79-term-title">{t.termTitle}</span>
        </div>
        <div className="o79-term-body">
          <div className="o79-term-hint">{t.termHint}</div>
          <a href={site.contact.zalo} target="_blank" rel="noreferrer" className="o79-cmd">
            <span className="o79-prompt">vduy@trustnet:~$</span> connect --zalo
          </a>
          <a href={site.contact.telegram} target="_blank" rel="noreferrer" className="o79-cmd">
            <span className="o79-prompt">vduy@trustnet:~$</span> connect --telegram
          </a>
          <a href={`mailto:${site.contact.email}`} className="o79-cmd">
            <span className="o79-prompt">vduy@trustnet:~$</span> mail {site.contact.email}
          </a>
          <div className="o79-cursorline">
            <span className="o79-prompt">vduy@trustnet:~$</span> <span className="o79-cursor" />
          </div>
        </div>
      </section>

      <footer className="o79-footer">{t.footer}</footer>

      <style>{`
.o79-root{--bg:#020409;--panel:rgba(8,16,26,.72);--line:rgba(34,211,238,.22);--cyan:#22d3ee;--vio:#a78bfa;--grn:#34d399;--fg:#d9f3ff;--muted:#5f7d92;
 font-family:var(--font-grotesk),var(--font-inter),sans-serif;background:var(--bg);color:var(--fg);min-height:100vh;position:relative;overflow-x:hidden;padding-bottom:130px;}
.o79-root *{box-sizing:border-box;}
.o79-root [id]{scroll-margin-top:80px;}
.o79-root code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;}

.o79-boot{position:fixed;inset:0;z-index:10001;background:#020409;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;animation:o79BootOut .4s ease 2.3s forwards;}
.o79-boot-lines{font-family:ui-monospace,Menlo,monospace;font-size:clamp(12px,2.4vw,16px);color:var(--cyan);text-align:left;display:flex;flex-direction:column;gap:8px;}
.o79-boot-lines div{opacity:0;animation:o79Line .05s steps(1) forwards;}
.o79-boot-skip{color:var(--muted);font-size:11px;letter-spacing:2px;text-transform:uppercase;}
@keyframes o79Line{to{opacity:1}}
@keyframes o79BootOut{to{opacity:0;visibility:hidden;pointer-events:none}}

.o79-scanlines{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.5;background:repeating-linear-gradient(0deg,rgba(255,255,255,.022) 0 1px,transparent 1px 3px);}
.o79-grid{position:fixed;inset:0;z-index:1;pointer-events:none;background:
 linear-gradient(rgba(34,211,238,.05) 1px,transparent 1px),
 linear-gradient(90deg,rgba(34,211,238,.05) 1px,transparent 1px);background-size:56px 56px;
 mask-image:radial-gradient(80% 60% at 50% 20%,#000 30%,transparent 100%);-webkit-mask-image:radial-gradient(80% 60% at 50% 20%,#000 30%,transparent 100%);}
.o79-root>*:not(.o79-scanlines):not(.o79-grid){position:relative;z-index:3;}

.o79-hud{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 26px;border-bottom:1px solid var(--line);background:rgba(2,4,9,.75);backdrop-filter:blur(10px);position:sticky;top:0;z-index:40;font-size:12px;letter-spacing:1px;}
.o79-hud-brand{display:flex;align-items:center;gap:9px;color:var(--fg);}
.o79-hud-brand b{font-size:15px;letter-spacing:.5px;}
.o79-hud-ver{color:var(--cyan);font-family:ui-monospace,monospace;font-size:11px;}
.o79-hud-mid{display:flex;gap:22px;color:var(--muted);font-family:ui-monospace,monospace;}
.o79-hud-clock{color:var(--cyan);}
.o79-hud-status{display:inline-flex;align-items:center;gap:7px;color:var(--grn);font-weight:700;}
.o79-hud-status i{width:7px;height:7px;border-radius:50%;background:var(--grn);box-shadow:0 0 10px var(--grn);animation:o79Pulse 1.6s infinite;}
@keyframes o79Pulse{50%{opacity:.35}}

.o79-hero{max-width:1100px;margin:0 auto;padding:76px 26px 40px;text-align:center;}
.o79-hero-tag{display:inline-block;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:3px;color:var(--cyan);border:1px solid var(--line);padding:7px 16px;border-radius:3px;margin-bottom:28px;background:rgba(34,211,238,.05);}
.o79-hero h1{margin:0;font-size:clamp(30px,5.4vw,62px);font-weight:700;letter-spacing:-1.5px;line-height:1.12;display:flex;flex-direction:column;gap:6px;}
.o79-glitch{position:relative;}
.o79-glitch::before,.o79-glitch::after{content:attr(data-text);position:absolute;inset:0;opacity:.75;pointer-events:none;}
.o79-glitch::before{color:var(--cyan);animation:o79G1 3.2s steps(2) infinite;clip-path:inset(15% 0 60% 0);}
.o79-glitch::after{color:#f472b6;animation:o79G2 2.7s steps(2) infinite;clip-path:inset(65% 0 10% 0);}
@keyframes o79G1{0%,92%,100%{transform:none;opacity:0}94%{transform:translate(-4px,-2px);opacity:.7}97%{transform:translate(3px,1px);opacity:.5}}
@keyframes o79G2{0%,90%,100%{transform:none;opacity:0}93%{transform:translate(4px,2px);opacity:.6}96%{transform:translate(-3px,-1px);opacity:.5}}
.o79-holo{background:linear-gradient(90deg,var(--cyan),var(--vio),var(--cyan));background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:o79Holo 5s linear infinite;}
@keyframes o79Holo{to{background-position:220% 0}}
.o79-hero p{color:var(--muted);max-width:600px;margin:24px auto 0;font-size:16px;line-height:1.7;}
.o79-statline{display:flex;justify-content:center;flex-wrap:wrap;gap:10px 30px;margin-top:30px;font-family:ui-monospace,monospace;font-size:12.5px;color:var(--muted);}
.o79-statline b{color:var(--cyan);font-size:15px;margin-right:4px;}

.o79-scanner-wrap{max-width:1100px;margin:0 auto;padding:20px 26px 40px;display:grid;grid-template-columns:380px 1fr;gap:22px;align-items:stretch;}
.o79-panel{background:var(--panel);border:1px solid var(--line);border-radius:10px;backdrop-filter:blur(8px);position:relative;}
.o79-panel::before{content:'';position:absolute;top:-1px;left:14px;right:14px;height:1px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);opacity:.6;}
.o79-scanpanel{padding:28px 22px;display:flex;flex-direction:column;align-items:center;gap:18px;}
.o79-radar{position:relative;width:230px;height:230px;flex-shrink:0;}
.o79-radar-ring{position:absolute;border-radius:50%;border:1px solid var(--line);}
.o79-radar-ring.r1{inset:0;}
.o79-radar-ring.r2{inset:34px;}
.o79-radar-ring.r3{inset:68px;border-style:dashed;}
.o79-radar-sweep{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,rgba(34,211,238,.4),transparent 70deg);opacity:0;transform-origin:center;}
.o79-radar.on .o79-radar-sweep{opacity:1;animation:o79Sweep 1.4s linear infinite;}
@keyframes o79Sweep{to{transform:rotate(360deg)}}
.o79-radar-core{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
.o79-blip{position:absolute;width:9px;height:9px;border-radius:50%;background:var(--cyan);opacity:0;box-shadow:0 0 12px var(--cyan);}
.o79-blip.hit{opacity:1;animation:o79Blip .5s ease;}
.o79-blip.b1{top:18%;left:64%;}
.o79-blip.b2{top:66%;left:76%;background:#f87171;box-shadow:0 0 12px #f87171;}
.o79-blip.b3{top:72%;left:26%;background:#f472b6;box-shadow:0 0 12px #f472b6;}
.o79-blip.b4{top:26%;left:20%;background:#fbbf24;box-shadow:0 0 12px #fbbf24;}
@keyframes o79Blip{0%{transform:scale(3);opacity:0}60%{opacity:1}100%{transform:scale(1)}}
.o79-scan-hint{color:var(--muted);font-size:13px;text-align:center;margin:0;line-height:1.6;}
.o79-scan-hint.mono{font-family:ui-monospace,monospace;color:var(--cyan);letter-spacing:1px;}
.o79-dots i{animation:o79Pulse 1s infinite;}
.o79-dots i:nth-child(2){animation-delay:.2s}
.o79-dots i:nth-child(3){animation-delay:.4s}
.o79-btn{border:1px solid var(--cyan);background:rgba(34,211,238,.1);color:var(--cyan);font-family:ui-monospace,monospace;font-size:13px;font-weight:700;letter-spacing:1.5px;padding:14px 24px;border-radius:4px;cursor:pointer;transition:.25s;text-align:center;}
.o79-btn:hover{background:var(--cyan);color:#04151b;box-shadow:0 0 30px rgba(34,211,238,.4);}
.o79-btn.ghost{border-color:rgba(255,255,255,.25);color:var(--fg);background:transparent;}
.o79-btn.ghost:hover{border-color:var(--cyan);color:var(--cyan);background:transparent;box-shadow:none;}

.o79-diagpanel{padding:22px;display:flex;flex-direction:column;}
.o79-panel-head{font-family:ui-monospace,monospace;font-size:11.5px;letter-spacing:2px;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:14px;}
.o79-diag-empty{flex:1;display:flex;align-items:center;justify-content:center;color:var(--muted);font-family:ui-monospace,monospace;letter-spacing:6px;min-height:150px;}
.o79-diags{display:flex;flex-direction:column;gap:10px;}
.o79-diag{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-left:2px solid var(--cyan);border-radius:6px;padding:12px 14px;animation:o79DiagIn .4s ease both;}
@keyframes o79DiagIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
.o79-diag-body{flex:1;min-width:0;}
.o79-diag-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.o79-diag-top code{font-size:10.5px;color:#f87171;border:1px solid rgba(248,113,113,.4);padding:2px 7px;border-radius:3px;letter-spacing:1px;}
.o79-diag-top b{font-size:14.5px;}
.o79-diag-body>span{display:block;color:var(--muted);font-size:12.5px;margin-top:4px;line-height:1.5;}
.o79-fix{flex-shrink:0;font-family:ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:1px;color:var(--grn);border:1px solid rgba(52,211,153,.4);padding:9px 12px;border-radius:4px;transition:.2s;white-space:nowrap;}
.o79-fix:hover{background:var(--grn);color:#03130c;box-shadow:0 0 20px rgba(52,211,153,.4);}

.o79-ticker{border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;white-space:nowrap;padding:13px 0;background:rgba(34,211,238,.03);}
.o79-ticker-track{display:inline-block;animation:o79Tick 30s linear infinite;font-family:ui-monospace,monospace;font-size:12.5px;letter-spacing:1px;color:var(--muted);}
.o79-ticker-track b{color:var(--fg);}
.o79-ticker-track b.up{color:var(--grn);}
@keyframes o79Tick{to{transform:translateX(-50%)}}

.o79-section{max-width:1100px;margin:0 auto;padding:64px 26px;}
.o79-sec-tag{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:3px;color:var(--cyan);margin-bottom:12px;}
.o79-section h2{font-size:clamp(24px,3.6vw,38px);font-weight:700;letter-spacing:-1px;margin:0 0 34px;}
.o79-modules{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.o79-module{display:flex;flex-direction:column;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:22px;color:var(--fg);transition:.25s;position:relative;overflow:hidden;}
.o79-module::after{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 40%,rgba(34,211,238,.09) 50%,transparent 60%);transform:translateX(-120%);transition:.5s;}
.o79-module:hover{border-color:var(--cyan);transform:translateY(-4px);box-shadow:0 16px 40px rgba(34,211,238,.12);}
.o79-module:hover::after{transform:translateX(120%);}
.o79-module-head{display:flex;justify-content:space-between;align-items:flex-start;}
.o79-module-ver{font-family:ui-monospace,monospace;font-size:10.5px;color:var(--muted);border:1px solid rgba(255,255,255,.12);padding:3px 7px;border-radius:3px;}
.o79-module-name{font-size:15px;color:var(--cyan);font-weight:700;}
.o79-module p{margin:0;color:var(--muted);font-size:13px;line-height:1.55;flex:1;}
.o79-module-open{font-family:ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--grn);}

.o79-citizens{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.o79-citizen{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:22px;}
.o79-citizen-id{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px dashed rgba(255,255,255,.12);margin-bottom:14px;}
.o79-citizen-id>div{flex:1;min-width:0;}
.o79-citizen-id b{display:block;font-size:14.5px;}
.o79-citizen-id span{font-size:12px;color:var(--muted);}
.o79-citizen-id code{color:#fbbf24;font-size:11px;letter-spacing:1px;}
.o79-citizen p{margin:0;font-size:14px;line-height:1.65;color:#b7d6e6;}

.o79-terminal{max-width:760px;margin:0 auto;padding:0 26px 30px;}
.o79-term-head{display:flex;align-items:center;gap:8px;background:#0a1622;border:1px solid var(--line);border-bottom:none;border-radius:10px 10px 0 0;padding:12px 16px;}
.o79-term-head .dot{width:11px;height:11px;border-radius:50%;}
.o79-term-head .dot.r{background:#f87171}.o79-term-head .dot.y{background:#fbbf24}.o79-term-head .dot.g{background:#34d399}
.o79-term-title{margin-left:10px;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:2px;color:var(--muted);}
.o79-term-body{background:rgba(2,8,14,.9);border:1px solid var(--line);border-radius:0 0 10px 10px;padding:20px;display:flex;flex-direction:column;gap:11px;font-family:ui-monospace,monospace;font-size:13.5px;}
.o79-term-hint{color:var(--muted);font-size:12px;}
.o79-prompt{color:var(--grn);}
.o79-cmd{color:var(--fg);padding:9px 12px;border-radius:5px;border:1px solid transparent;transition:.2s;}
.o79-cmd:hover{background:rgba(34,211,238,.08);border-color:var(--line);color:var(--cyan);}
.o79-cursorline{padding:9px 12px;}
.o79-cursor{display:inline-block;width:9px;height:16px;background:var(--cyan);vertical-align:middle;animation:o79Pulse 1s steps(1) infinite;}

.o79-footer{text-align:center;color:var(--muted);font-family:ui-monospace,monospace;font-size:11.5px;letter-spacing:2px;padding:26px;}

@media(prefers-reduced-motion:reduce){
 .o79-root *{animation:none!important}
 .o79-boot{display:none}
}
@media(max-width:940px){
 .o79-scanner-wrap{grid-template-columns:1fr;}
 .o79-modules{grid-template-columns:1fr 1fr;}
 .o79-citizens{grid-template-columns:1fr;}
 .o79-hud-mid span:first-child{display:none;}
 .o79-hero{padding:56px 20px 34px;}
 .o79-section{padding:48px 20px;}
 .o79-scanner-wrap{padding:14px 20px 30px;}
}
@media(max-width:560px){
 .o79-modules{grid-template-columns:1fr;}
 .o79-diag{flex-wrap:wrap;}
 .o79-fix{width:100%;text-align:center;}
}
      `}</style>
    </div>
  );
}
