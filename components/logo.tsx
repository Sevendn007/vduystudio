// Logo VDuyStudio — dựng lại NGUYÊN BẢN từ file logo động của khách:
// badge tích xanh 12 cánh (xoay vào + check vẽ + vòng xoay + glow), chữ
// "VDuyStudio" 3D vàng gold (font Comfortaa), tagline, và 4 icon nền tảng.

const BADGE_PATH =
  "M50 3 60 11 73 9 78 21 91 26 89 40 98 50 89 60 91 74 78 79 73 91 60 89 50 97 40 89 27 91 22 79 9 74 11 60 2 50 11 40 9 26 22 21 27 9 40 11Z";

function keyframes() {
  return `
  @keyframes vds-badgeIn{0%{transform:rotate(-140deg) scale(.2);opacity:0}55%{transform:rotate(12deg) scale(1.12);opacity:1}75%{transform:rotate(-4deg) scale(.97)}100%{transform:rotate(0) scale(1);opacity:1}}
  @keyframes vds-checkDraw{to{stroke-dashoffset:0}}
  @keyframes vds-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
  @keyframes vds-glow{0%,100%{filter:drop-shadow(0 0 14px rgba(24,119,242,.55)) drop-shadow(0 6px 22px rgba(24,119,242,.35))}50%{filter:drop-shadow(0 0 30px rgba(24,119,242,.9)) drop-shadow(0 10px 34px rgba(24,119,242,.55))}}
  @keyframes vds-wordIn{0%{opacity:0;transform:translateX(28px);letter-spacing:.22em}100%{opacity:1;transform:translateX(0);letter-spacing:.005em}}
  @keyframes vds-shine{0%{background-position:-220% 0}55%,100%{background-position:220% 0}}
  @keyframes vds-ringSpin{to{transform:rotate(360deg)}}
  @keyframes vds-tagIn{0%,60%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes vds-iconIn{0%{opacity:0;transform:translateY(14px) scale(.6)}70%{transform:translateY(-3px) scale(1.08)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes vds-iconFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @media(prefers-reduced-motion:reduce){[class^="vdsl-"]{animation:none!important}.vdsl-check-p{stroke-dashoffset:0!important}}
  `;
}

// Badge tích xanh động.
export function VDuyBadge({ size = 64, intro = true }: { size?: number; intro?: boolean }) {
  // Gradient dùng chung cho mọi badge (userSpaceOnUse, toạ độ theo viewBox 0-100
  // nên đồng nhất) — id cố định, tránh lệch hydration.
  const id = "vdsBadge";
  return (
    <span
      className="vdsl-float"
      style={{ display: "inline-block", width: size, height: size, animation: "vds-float 5.2s ease-in-out infinite" }}
    >
      <span
        className="vdsl-badge"
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
          animation: `${intro ? "vds-badgeIn 1.15s cubic-bezier(.2,.9,.25,1.05) both, " : ""}vds-glow 3.4s ease-in-out ${intro ? "1.2s" : "0s"} infinite`,
        }}
      >
        <span
          className="vdsl-ring"
          style={{ position: "absolute", inset: -size * 0.1, borderRadius: "50%", border: "1px dashed rgba(24,119,242,.35)", animation: "vds-ringSpin 14s linear infinite" }}
        />
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block", position: "relative" }}>
          <defs>
            <linearGradient id={`${id}b`} x1="18" y1="8" x2="82" y2="94" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4a9bff" />
              <stop offset="0.5" stopColor="#1877f2" />
              <stop offset="1" stopColor="#0b4fc0" />
            </linearGradient>
            <linearGradient id={`${id}e`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7fbcff" />
              <stop offset="1" stopColor="#0a3d99" />
            </linearGradient>
          </defs>
          <path fill={`url(#${id}e)`} transform="translate(0,3)" d={BADGE_PATH} />
          <path fill={`url(#${id}b)`} d={BADGE_PATH} />
          <path
            className="vdsl-check-p"
            fill="none"
            stroke="#fff"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M32 51 L45 64 L69 37"
            strokeDasharray="60"
            strokeDashoffset={intro ? 60 : 0}
            style={intro ? { animation: "vds-checkDraw .55s cubic-bezier(.6,.2,.2,1) .95s forwards" } : undefined}
          />
        </svg>
      </span>
      <style>{keyframes()}</style>
    </span>
  );
}

// Chữ "VDuyStudio" 3D vàng gold (V xanh), font Comfortaa.
export function VDuyWordmark({ fontSize = 30, shine = true }: { fontSize?: number; shine?: boolean }) {
  const extrude = Math.max(2, Math.round(fontSize / 18));
  const backShadow = Array.from({ length: 8 }, (_, i) => `${i + 1}px ${i + 1}px 0 #${["7a5e26", "6f5522", "644c1e", "59431b", "4e3a17", "433113", "382810", "2d1f0c"][i]}`).join(",");
  const vShadow = Array.from({ length: 8 }, (_, i) => `${i + 1}px ${i + 1}px 0 #${["123a6e", "0f3360", "0c2b52", "0a2444", "081d36", "061628", "040f1a", "02080d"][i]}`).join(",");
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        fontFamily: "var(--font-comfortaa), cursive",
        fontWeight: 700,
        fontSize,
        lineHeight: 1.08,
        letterSpacing: ".004em",
      }}
    >
      <span aria-hidden style={{ position: "absolute", top: 0, left: 0, whiteSpace: "nowrap", color: "#5a4418", textShadow: `${backShadow},${extrude + 1}px ${extrude + 3}px 16px rgba(0,0,0,.55)` }}>
        <span style={{ color: "#0c2c58", textShadow: vShadow }}>V</span>
        DuyStudio
      </span>
      <span
        className={shine ? "vdsl-shine" : undefined}
        style={{
          position: "relative",
          background: "linear-gradient(160deg,#8a6d2f 0%,#f6e6b0 20%,#fffbe9 37%,#eaca78 52%,#c99a3e 68%,#f7ead0 100%)",
          backgroundSize: "220% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: shine ? "vds-shine 5.5s ease-in-out 1.3s infinite" : undefined,
        }}
      >
        <span style={{ background: "linear-gradient(180deg,#eaf4ff 0%,#4a9bff 55%,#0b4fc0 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>V</span>
        DuyStudio
      </span>
      <style>{keyframes()}</style>
    </span>
  );
}

// Logo gọn cho nav: badge + wordmark.
export function VDuyMark({ size = 34, fontSize, intro = false }: { size?: number; fontSize?: number; intro?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
      <VDuyBadge size={size} intro={intro} />
      <VDuyWordmark fontSize={fontSize ?? size * 0.62} shine />
    </span>
  );
}

const ICON_TILES = [
  { bg: "#010101", border: "1px solid rgba(255,255,255,.1)", shadow: "0 10px 26px rgba(37,244,238,.28),0 4px 14px rgba(254,44,85,.3)", svg: "tiktok" },
  { bg: "#1877F2", border: "none", shadow: "0 10px 26px rgba(24,119,242,.5)", svg: "facebook" },
  { bg: "radial-gradient(120% 120% at 25% 108%, #ffd75e 0%, #fa7e1e 24%, #d62976 50%, #962fbf 74%, #4f5bd5 100%)", border: "none", shadow: "0 10px 26px rgba(214,41,118,.5)", svg: "instagram" },
  { bg: "#010101", border: "1px solid rgba(255,255,255,.1)", shadow: "0 10px 26px rgba(255,255,255,.16)", svg: "threads" },
];

function TileGlyph({ kind }: { kind: string }) {
  if (kind === "tiktok")
    return (
      <svg viewBox="0 0 24 24" style={{ width: 30, height: 30 }}>
        <g transform="translate(-1.1,1)"><path fill="#25F4EE" d="M16.6 5.82c-1.14-.74-1.9-1.98-2.05-3.4V2h-3.3v13.1c0 1.4-1.14 2.54-2.54 2.54a2.54 2.54 0 0 1-2.54-2.54 2.54 2.54 0 0 1 3.31-2.42V9.3a5.86 5.86 0 0 0-.77-.05A5.85 5.85 0 0 0 2.9 15.1a5.85 5.85 0 0 0 5.85 5.85 5.85 5.85 0 0 0 5.85-5.85V8.42a7.1 7.1 0 0 0 4.15 1.33V6.45a3.4 3.4 0 0 1-2-.63z" /></g>
        <g transform="translate(1.1,-1)"><path fill="#FE2C55" d="M16.6 5.82c-1.14-.74-1.9-1.98-2.05-3.4V2h-3.3v13.1c0 1.4-1.14 2.54-2.54 2.54a2.54 2.54 0 0 1-2.54-2.54 2.54 2.54 0 0 1 3.31-2.42V9.3a5.86 5.86 0 0 0-.77-.05A5.85 5.85 0 0 0 2.9 15.1a5.85 5.85 0 0 0 5.85 5.85 5.85 5.85 0 0 0 5.85-5.85V8.42a7.1 7.1 0 0 0 4.15 1.33V6.45a3.4 3.4 0 0 1-2-.63z" /></g>
        <path fill="#fff" d="M16.6 5.82c-1.14-.74-1.9-1.98-2.05-3.4V2h-3.3v13.1c0 1.4-1.14 2.54-2.54 2.54a2.54 2.54 0 0 1-2.54-2.54 2.54 2.54 0 0 1 3.31-2.42V9.3a5.86 5.86 0 0 0-.77-.05A5.85 5.85 0 0 0 2.9 15.1a5.85 5.85 0 0 0 5.85 5.85 5.85 5.85 0 0 0 5.85-5.85V8.42a7.1 7.1 0 0 0 4.15 1.33V6.45a3.4 3.4 0 0 1-2-.63z" />
      </svg>
    );
  if (kind === "facebook")
    return (
      <svg viewBox="0 0 24 24" style={{ width: 33, height: 33 }}>
        <path fill="#fff" d="M13.5 21v-6.96h2.34l.35-2.72H13.5V9.58c0-.79.22-1.32 1.35-1.32h1.44V5.83c-.25-.03-1.1-.11-2.09-.11-2.07 0-3.49 1.26-3.49 3.58v2H8.37v2.72h2.34V21h2.79z" />
      </svg>
    );
  if (kind === "instagram")
    return (
      <svg viewBox="0 0 24 24" style={{ width: 30, height: 30 }}>
        <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="16.6" cy="7.4" r="1.3" fill="#fff" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" style={{ width: 31, height: 31 }}>
      <path fill="#fff" d="M17.4 11.13c-.1-.05-.2-.09-.3-.13-.18-3.26-1.96-5.13-4.95-5.15h-.04c-1.79 0-3.28.76-4.19 2.16l1.65 1.13c.68-1.03 1.75-1.25 2.54-1.25h.03c.98.01 1.72.29 2.2.85.35.4.58.96.7 1.66-.9-.15-1.87-.2-2.91-.14-2.93.17-4.81 1.88-4.69 4.26.06 1.2.66 2.24 1.69 2.92.87.57 1.99.85 3.16.79 1.54-.08 2.75-.67 3.6-1.74.64-.82 1.05-1.87 1.23-3.2.74.45 1.29 1.04 1.59 1.75.51 1.2.54 3.18-1.07 4.79-1.41 1.41-3.11 2.02-5.68 2.04-2.85-.02-5.01-.94-6.4-2.72C3.75 16.5 3.09 14.2 3.06 12.01v-.02c.03-2.19.69-4.49 1.99-6.16 1.4-1.79 3.55-2.71 6.4-2.73h.02c2.86.02 5.03.94 6.45 2.74.7.89 1.22 1.99 1.57 3.28l1.57-.42c-.42-1.55-1.06-2.89-1.94-4-1.72-2.18-4.24-3.3-7.49-3.32h-.03C8.6 1.4 6.08 2.52 4.37 4.71 2.86 6.65 2.09 9.35 2.06 12v.01c.03 2.65.8 5.35 2.31 7.29 1.71 2.19 4.23 3.31 7.49 3.34h.03c2.9-.02 4.94-.78 6.63-2.47 2.21-2.21 2.14-4.98 1.41-6.68-.52-1.22-1.51-2.21-2.86-2.86z" />
    </svg>
  );
}

// Logo lockup ĐẦY ĐỦ (nguyên bản) — badge + wordmark + tagline + 4 icon nền tảng.
export function VDuyLockup({ tagline = "Tích xanh · Cứu tài khoản · Booking báo chí" }: { tagline?: string }) {
  return (
    <div className="vdsl-lockup">
      <div className="vdsl-row">
        <VDuyBadge size={128} intro />
        <div className="vdsl-words">
          <div className="vdsl-wordIn">
            <VDuyWordmark fontSize={64} shine />
          </div>
          <div className="vdsl-tag">
            <span className="vdsl-tagline-bar" />
            <span className="vdsl-tagline">{tagline}</span>
          </div>
        </div>
      </div>
      <div className="vdsl-icons">
        {ICON_TILES.map((t, i) => (
          <div key={i} className="vdsl-iconIn" style={{ animationDelay: `${1.35 + i * 0.15}s` }}>
            <div
              className="vdsl-iconFloat"
              style={{ animationDelay: `${i * 0.3}s`, background: t.bg, border: t.border, boxShadow: t.shadow }}
            >
              <TileGlyph kind={t.svg} />
            </div>
          </div>
        ))}
      </div>
      <style>{`
${keyframes()}
.vdsl-lockup{display:flex;flex-direction:column;gap:30px;}
.vdsl-row{display:flex;align-items:center;gap:30px;flex-wrap:wrap;}
.vdsl-words{display:flex;flex-direction:column;gap:12px;}
.vdsl-wordIn{animation:vds-wordIn .9s cubic-bezier(.2,.8,.25,1) .55s both;}
.vdsl-tag{display:flex;align-items:center;gap:12px;animation:vds-tagIn 1.4s ease 1.1s both;}
.vdsl-tagline-bar{width:34px;height:2px;background:linear-gradient(90deg,#1877f2,transparent);}
.vdsl-tagline{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a6bada;}
.vdsl-icons{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.vdsl-iconIn{animation:vds-iconIn .6s cubic-bezier(.2,.8,.3,1.1) both;}
.vdsl-iconFloat{width:58px;height:58px;border-radius:16px;display:flex;align-items:center;justify-content:center;animation:vds-iconFloat 4.4s ease-in-out infinite;}
@media(max-width:520px){.vdsl-wordIn :is(span){font-size:44px!important;}}
      `}</style>
    </div>
  );
}
